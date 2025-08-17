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
    async handleRequest(req, res) {
        if (!req.url) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        // Scan routes on each request for development
        const routes = (0, core_1.scanRoutes)(this.options.routesDir);
        // Match route
        const matchedRoute = (0, core_1.matchRoute)(routes, req.url);
        if (!matchedRoute) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        try {
            // Import the page component
            const pageModule = await Promise.resolve(`${matchedRoute.filePath}`).then(s => __importStar(require(s)));
            const PageComponent = pageModule.default;
            if (!PageComponent) {
                res.statusCode = 500;
                res.end('Page component not found');
                return;
            }
            // Render the page
            const result = await (0, renderer_react_1.renderPage)(PageComponent);
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
        }
        catch (error) {
            console.error('Error rendering page:', error);
            res.statusCode = 500;
            res.end('Error rendering page');
        }
    }
}
exports.DevServer = DevServer;
