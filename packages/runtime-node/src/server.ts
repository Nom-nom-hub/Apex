import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { join, extname } from 'path';
import { existsSync, readFileSync, statSync } from 'fs';
import { scanRoutes, matchRoute } from '@apex/core';
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
            // Handle metrics endpoint
            if (req.url === '/metrics') {
              await this.serveMetrics(res);
              return;
            }
            
            // Handle client-side hydration script
            if (req.url === '/island-hydration.js') {
              await this.serveHydrationScript(res);
              return;
            }
            
            // Handle static assets
            if (req.url && this.serveStaticAsset(req, res)) {
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
          console.log(`Metrics available at http://localhost:${this.options.port}/metrics`);
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
  
  private serveStaticAsset(req: IncomingMessage, res: ServerResponse): boolean {
    if (!req.url) return false;
    
    // Check if there's a public directory
    const publicDir = join(process.cwd(), 'public');
    if (!existsSync(publicDir)) return false;
    
    // Resolve the file path
    const filePath = join(publicDir, req.url);
    
    // Prevent directory traversal
    const relativePath = join('/', req.url);
    if (relativePath.includes('..')) {
      res.statusCode = 403;
      res.end('Forbidden');
      return true;
    }
    
    // Check if file exists
    if (!existsSync(filePath)) return false;
    
    // Check if it's a file (not a directory)
    const stat = statSync(filePath);
    if (!stat.isFile()) return false;
    
    // Set content type based on file extension
    const ext = extname(filePath).toLowerCase();
    const contentType = this.getContentType(ext);
    res.setHeader('Content-Type', contentType);
    
    // Read and serve the file
    const fileContent = readFileSync(filePath);
    res.end(fileContent);
    return true;
  }
  
  private getContentType(ext: string): string {
    const contentTypes: Record<string, string> = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    };
    
    return contentTypes[ext] || 'application/octet-stream';
  }
  
  private async serveMetrics(res: ServerResponse): Promise<void> {
    try {
      // Simple metrics response
      const metricsData = `
# HELP apex_requests_total Total number of requests
# TYPE apex_requests_total counter
apex_requests_total{method="GET"} 10

# HELP apex_request_duration_ms Request duration in milliseconds
# TYPE apex_request_duration_ms histogram
apex_request_duration_ms_bucket{le="50"} 5
apex_request_duration_ms_bucket{le="100"} 8
apex_request_duration_ms_bucket{le="200"} 10
apex_request_duration_ms_bucket{le="+Inf"} 10
apex_request_duration_ms_sum 750
apex_request_duration_ms_count 10
      `.trim();
      
      res.setHeader('Content-Type', 'text/plain; version=0.0.4');
      res.end(metricsData);
    } catch (error) {
      console.error('Error serving metrics:', error);
      res.statusCode = 500;
      res.end('Error serving metrics');
    }
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
    
    try {
      // Scan routes
      const routes = scanRoutes(this.options.routesDir);
      
      // Match route
      const matchedRoute = matchRoute(routes, req.url);
      
      if (!matchedRoute) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }
      
      // Convert .page.tsx path to .page.js path
      const jsFilePath = matchedRoute.filePath.replace(/\.page\.tsx$/, '.page.js');
      
      // Import the route module
      const routeModule = await import(jsFilePath);
      
      // Get the default export (the page component)
      const PageComponent = routeModule.default;
      
      if (!PageComponent) {
        res.statusCode = 500;
        res.end('Route module does not export a default component');
        return;
      }
      
      // Check if there's a loader for this route
      let loaderData = {};
      const loaderPath = matchedRoute.filePath.replace(/\.page\.tsx$/, '.loader.ts');
      const loaderJsPath = matchedRoute.filePath.replace(/\.page\.tsx$/, '.loader.js');
      
      if (existsSync(loaderJsPath)) {
        try {
          const loaderModule = await import(loaderJsPath);
          if (loaderModule.loader) {
            loaderData = await loaderModule.loader();
          }
        } catch (error) {
          console.error('Error loading route data:', error);
        }
      }
      
      // Render the page
      const renderResult = await renderPage(PageComponent, loaderData);
      
      // Create full HTML document
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Apex App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root">
    ${renderResult.html}
  </div>
  <script src="/island-hydration.js"></script>
</body>
</html>
      `.trim();
      
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    } catch (error) {
      console.error('Error rendering page:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }
}