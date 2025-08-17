import { createServer, Server, IncomingMessage, ServerResponse } from 'http';

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
    
    // For simplicity, we'll just serve a simple static page
    const simpleHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Apex App</title>
</head>
<body>
  <div id="root">
    <h1>Hello Apex!</h1>
    <p>This is a simple page for testing observability.</p>
  </div>
  <script src="/island-hydration.js"></script>
</body>
</html>
    `.trim();
    
    res.setHeader('Content-Type', 'text/html');
    res.end(simpleHtml);
  }
}