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
const core_1 = require("@apex/core");
const renderer_react_1 = require("@apex/renderer-react");
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
                        // Handle client-side hydration script
                        if (req.url === '/island-hydration.js') {
                            await this.serveHydrationScript(res);
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
        // Scan routes on each request for development
        const routes = (0, core_1.scanRoutes)(this.options.routesDir);
        const routeModules = (0, core_1.scanRouteModules)(routes);
        // Match route
        const matchedRouteModule = routeModules.find((rm) => (0, core_1.matchRoute)([rm.route], req.url || '') !== null);
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
            let loaderData = null;
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
                    }
                    catch (e) {
                        loaderData = loaderResult.body;
                    }
                }
                else {
                    loaderData = loaderResult.body;
                }
            }
            // Import the page component
            const pageModule = await Promise.resolve(`${matchedRoute.filePath}`).then(s => __importStar(require(s)));
            const PageComponent = pageModule.default;
            if (!PageComponent) {
                res.statusCode = 500;
                res.end('Page component not found');
                return;
            }
            // Render the page with loader data
            const result = await (0, renderer_react_1.renderPage)(PageComponent, loaderData || {});
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
        }
        catch (error) {
            console.error('Error handling request:', error);
            res.statusCode = 500;
            res.end('Error handling request');
        }
    }
    async executeLoader(loaderPath, req, route) {
        try {
            const loaderModule = await Promise.resolve(`${loaderPath}`).then(s => __importStar(require(s)));
            const loaderFunction = loaderModule.loader;
            if (!loaderFunction) {
                throw new Error(`No loader function exported from ${loaderPath}`);
            }
            const loaderArgs = {
                request: req,
                params: this.extractParams(route.path, req.url || ''),
                context: {}
            };
            const result = await loaderFunction(loaderArgs);
            return result;
        }
        catch (error) {
            console.error('Error executing loader:', error);
            return {
                status: 500,
                headers: {},
                body: 'Error executing loader'
            };
        }
    }
    async executeAction(actionPath, req, route) {
        try {
            const actionModule = await Promise.resolve(`${actionPath}`).then(s => __importStar(require(s)));
            const actionFunction = actionModule.action;
            if (!actionFunction) {
                throw new Error(`No action function exported from ${actionPath}`);
            }
            const actionArgs = {
                request: req,
                params: this.extractParams(route.path, req.url || ''),
                context: {}
            };
            const result = await actionFunction(actionArgs);
            return result;
        }
        catch (error) {
            console.error('Error executing action:', error);
            return {
                status: 500,
                headers: {},
                body: 'Error executing action'
            };
        }
    }
    extractParams(routePath, url) {
        // Simple parameter extraction
        const params = {};
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
    async sendResponse(res, response) {
        res.statusCode = response.status;
        // Set headers
        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        // Send body
        if (typeof response.body === 'string') {
            res.end(response.body);
        }
        else {
            res.end(JSON.stringify(response.body));
        }
    }
}
exports.DevServer = DevServer;
