"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServer = void 0;
const http_1 = require("http");
const path_1 = require("path");
const fs_1 = require("fs");
const core_1 = require("@apex-framework/core");
const renderer_react_1 = require("@apex-framework/renderer-react");
class DevServer {
    constructor(options) {
        this.server = null;
        this.options = {
            port: 3000,
            ...options
        };
    }
    async start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = (0, http_1.createServer)(async (req, res) => {
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
                    }
                    catch (error) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.server = null;
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
    serveStaticAsset(req, res) {
        if (!req.url)
            return false;
        // Check if there's a public directory
        const publicDir = (0, path_1.join)(process.cwd(), 'public');
        if (!(0, fs_1.existsSync)(publicDir))
            return false;
        // Resolve the file path
        const filePath = (0, path_1.join)(publicDir, req.url);
        // Prevent directory traversal
        const relativePath = (0, path_1.join)('/', req.url);
        if (relativePath.includes('..')) {
            res.statusCode = 403;
            res.end('Forbidden');
            return true;
        }
        // Check if file exists
        if (!(0, fs_1.existsSync)(filePath))
            return false;
        // Check if it's a file (not a directory)
        const stat = (0, fs_1.statSync)(filePath);
        if (!stat.isFile())
            return false;
        // Set content type based on file extension
        const ext = (0, path_1.extname)(filePath).toLowerCase();
        const contentType = this.getContentType(ext);
        res.setHeader('Content-Type', contentType);
        // Read and serve the file
        const fileContent = (0, fs_1.readFileSync)(filePath);
        res.end(fileContent);
        return true;
    }
    getContentType(ext) {
        const contentTypes = {
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
    async serveMetrics(res) {
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
        }
        catch (error) {
            console.error('Error serving metrics:', error);
            res.statusCode = 500;
            res.end('Error serving metrics');
        }
    }
    async serveHydrationScript(res) {
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
        }
        catch (error) {
            console.error('Error serving hydration script:', error);
            res.statusCode = 500;
            res.end('Error serving hydration script');
        }
    }
    async handleRequest(req, res) {
        if (!req.url) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        try {
            // Scan routes
            const routes = (0, core_1.scanRoutes)(this.options.routesDir);
            // Match route
            const matchedRoute = (0, core_1.matchRoute)(routes, req.url);
            if (!matchedRoute) {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }
            // Convert .page.tsx path to .page.js path
            const jsFilePath = matchedRoute.filePath.replace(/\.page\.tsx$/, '.page.js');
            // Import the route module
            const routeModule = await Promise.resolve(`${jsFilePath}`).then(s => __importStar(require(s)));
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
            if ((0, fs_1.existsSync)(loaderJsPath)) {
                try {
                    const loaderModule = await Promise.resolve(`${loaderJsPath}`).then(s => __importStar(require(s)));
                    if (loaderModule.loader) {
                        loaderData = await loaderModule.loader();
                    }
                }
                catch (error) {
                    console.error('Error loading route data:', error);
                }
            }
            // Render the page
            const renderResult = await (0, renderer_react_1.renderPage)(PageComponent, loaderData);
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
        }
        catch (error) {
            console.error('Error rendering page:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }
}
exports.DevServer = DevServer;
