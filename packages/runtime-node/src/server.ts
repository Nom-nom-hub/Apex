import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { join } from 'path';
import { readFile } from 'fs/promises';
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
  
  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!req.url) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    
    // Scan routes on each request for development
    const routes = scanRoutes(this.options.routesDir);
    
    // Match route
    const matchedRoute = matchRoute(routes, req.url);
    
    if (!matchedRoute) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    
    try {
      // Import the page component
      const pageModule = await import(matchedRoute.filePath);
      const PageComponent = pageModule.default;
      
      if (!PageComponent) {
        res.statusCode = 500;
        res.end('Page component not found');
        return;
      }
      
      // Render the page
      const result = await renderPage(PageComponent);
      
      // Send HTML response
      res.setHeader('Content-Type', 'text/html');
      res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Apex App</title>
</head>
<body>
  <div id="root">${result.html}</div>
</body>
</html>
      `);
    } catch (error) {
      console.error('Error rendering page:', error);
      res.statusCode = 500;
      res.end('Error rendering page');
    }
  }
}