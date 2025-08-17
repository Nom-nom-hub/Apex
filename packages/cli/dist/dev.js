"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDevServer = startDevServer;
const path_1 = require("path");
const runtime_node_1 = require("@apex/runtime-node");
async function startDevServer() {
    // For now, we'll assume the current working directory is the project root
    const routesDir = (0, path_1.join)(process.cwd(), 'app', 'routes');
    const server = new runtime_node_1.DevServer({
        routesDir,
        port: 3000
    });
    try {
        await server.start();
        // Keep the process alive
        process.on('SIGINT', async () => {
            console.log('Shutting down dev server...');
            await server.stop();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start dev server:', error);
        process.exit(1);
    }
}
