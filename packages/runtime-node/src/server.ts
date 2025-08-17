import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { join, basename } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { scanRoutes, matchRoute, scanRouteModules, LoaderArgs, ActionArgs, Response, json, redirect } from '@apex/core';
import { renderPage } from '@apex/renderer-react';

export interface DevServerOptions {
  port?: number;
  routesDir: string;
}

export class DevServer {
  private server: Server | null = null;
  private options: DevServerOptions;
  
  constructor(options: DevServerOptions) {
    this.options = {
      port: 3000,
      ...options
    };
  }
  
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
          try {
            // Handle client-side hydration script
            if (req.url === '/island-hydration.js') {
              await this.serveHydrationScript(res);
              return;
            }
            
            await this.handleRequest(req, res);
          } catch (error) {
            console.error('Error handling request:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        });
        
        this.server.listen(this.options.port, () => {
          console.log(`Dev server running on http://localhost:${this.options.port}`);
          resolve();
        });
        
        this.server.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            reject(err);
          } else {
            this.server = null;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
  
  private async serveHydrationScript(res: ServerResponse): Promise<void> {
    try {
      // In a real implementation, this would serve a bundled client script
      // For now, we'll serve a simple script
      const scriptContent = `
        // Simple client-side hydration script
        function hydrateIslands() {
          // Find all island markers
          const islandMarkers = document.querySelectorAll('[data-island]');
          
          islandMarkers.forEach(marker => {
            const id = marker.id;
            const componentName = marker.getAttribute('data-island');
            const propsJson = marker.getAttribute('data-props');
            
            let props = {};
            try {
              props = JSON.parse(propsJson || '{}');
            } catch (e) {
              console.error('Error parsing island props:', e);
            }
            
            // For this example, we'll just re-render the counter
            if (componentName === 'CounterIsland') {
              // Create a simple counter component
              let count = props.initialCount || 0;
              const container = marker;
              const countElement = document.createElement('p');
              countElement.textContent = 'Count: ' + count;
              
              const incrementButton = document.createElement('button');
              incrementButton.textContent = 'Increment';
              incrementButton.onclick = () => {
                count++;
                countElement.textContent = 'Count: ' + count;
              };
              
              const decrementButton = document.createElement('button');
              decrementButton.textContent = 'Decrement';
              decrementButton.onclick = () => {
                count--;
                countElement.textContent = 'Count: ' + count;
              };
              
              // Clear the container and add our elements
              container.innerHTML = '';
              container.style.border = '1px solid #ccc';
              container.style.padding = '1rem';
              container.style.borderRadius = '4px';
              container.appendChild(countElement);
              container.appendChild(incrementButton);
              container.appendChild(decrementButton);
            }
          });
        }
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', hydrateIslands);
        } else {
          hydrateIslands();
        }
      `;
      
      res.setHeader('Content-Type', 'application/javascript');
      res.end(scriptContent);
    } catch (error) {
      console.error('Error serving hydration script:', error);
      res.statusCode = 500;
      res.end('Error serving hydration script');
    }
  }
  
  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!req.url) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    
    // Scan routes on each request for development
    const routes = scanRoutes(this.options.routesDir);
    const routeModules = scanRouteModules(routes);
    
    // Match route
    const matchedRouteModule = routeModules.find((rm: any) => 
      matchRoute([rm.route], req.url || '') !== null
    );
    
    if (!matchedRouteModule) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    
    const matchedRoute = matchedRouteModule.route;
    
    try {
      // Handle POST requests with actions
      if (req.method === 'POST' && matchedRouteModule.actionPath) {
        const actionResult = await this.executeAction(matchedRouteModule.actionPath, req, matchedRoute);
        await this.sendResponse(res, actionResult);
        return;
      }
      
      // Handle GET requests with loaders
      let loaderData: any = null;
      if (req.method === 'GET' && matchedRouteModule.loaderPath) {
        const loaderResult = await this.executeLoader(matchedRouteModule.loaderPath, req, matchedRoute);
        if (loaderResult.status >= 300 && loaderResult.status < 400) {
          // Handle redirects
          await this.sendResponse(res, loaderResult);
          return;
        }
        
        if (typeof loaderResult.body === 'string') {
          try {
            loaderData = JSON.parse(loaderResult.body);
          } catch (e) {
            loaderData = loaderResult.body;
          }
        } else {
          loaderData = loaderResult.body;
        }
      }
      
      // Import the page component
      const pageModule = await import(matchedRoute.filePath);
      const PageComponent = pageModule.default;
      
      if (!PageComponent) {
        res.statusCode = 500;
        res.end('Page component not found');
        return;
      }
      
      // Render the page with loader data
      const result = await renderPage(PageComponent, loaderData || {});
      
      // Send HTML response with island hydration script
      res.setHeader('Content-Type', 'text/html');
      res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Apex App</title>
</head>
<body>
  <div id="root">${result.html}</div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="/island-hydration.js"></script>
</body>
</html>
      `);
    } catch (error) {
      console.error('Error handling request:', error);
      res.statusCode = 500;
      res.end('Error handling request');
    }
  }
  
  private async executeLoader(loaderPath: string, req: IncomingMessage, route: any): Promise<Response> {
    try {
      const loaderModule = await import(loaderPath);
      const loaderFunction = loaderModule.loader;
      
      if (!loaderFunction) {
        throw new Error(`No loader function exported from ${loaderPath}`);
      }
      
      const loaderArgs: LoaderArgs = {
        request: req,
        params: this.extractParams(route.path, req.url || ''),
        context: {}
      };
      
      const result = await loaderFunction(loaderArgs);
      return result;
    } catch (error) {
      console.error('Error executing loader:', error);
      return {
        status: 500,
        headers: {},
        body: 'Error executing loader'
      };
    }
  }
  
  private async executeAction(actionPath: string, req: IncomingMessage, route: any): Promise<Response> {
    try {
      const actionModule = await import(actionPath);
      const actionFunction = actionModule.action;
      
      if (!actionFunction) {
        throw new Error(`No action function exported from ${actionPath}`);
      }
      
      const actionArgs: ActionArgs = {
        request: req,
        params: this.extractParams(route.path, req.url || ''),
        context: {}
      };
      
      const result = await actionFunction(actionArgs);
      return result;
    } catch (error) {
      console.error('Error executing action:', error);
      return {
        status: 500,
        headers: {},
        body: 'Error executing action'
      };
    }
  }
  
  private extractParams(routePath: string, url: string): Record<string, string> {
    // Simple parameter extraction
    const params: Record<string, string> = {};
    
    // Extract dynamic parameters from route path
    const routeParts = routePath.split('/').filter(Boolean);
    const urlParts = url.split('/').filter(Boolean);
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) {
        const paramName = routeParts[i].slice(1, -1);
        params[paramName] = urlParts[i] || '';
      }
    }
    
    return params;
  }
  
  private async sendResponse(res: ServerResponse, response: Response): Promise<void> {
    res.statusCode = response.status;
    
    // Set headers
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string | string[]);
    });
    
    // Send body
    if (typeof response.body === 'string') {
      res.end(response.body);
    } else {
      res.end(JSON.stringify(response.body));
    }
  }
}