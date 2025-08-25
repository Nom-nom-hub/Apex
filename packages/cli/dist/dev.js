"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDevServer = startDevServer;
const path_1 = require("path");
const runtime_node_1 = require("@apex/runtime-node");
// Parse command line arguments for --runtime flag
function parseRuntimeArg() {
    const args = process.argv.slice(2);
    const runtimeIndex = args.indexOf('--runtime');
    if (runtimeIndex !== -1 && runtimeIndex + 1 < args.length) {
        return args[runtimeIndex + 1];
    }
    // Default to node runtime
    return 'node';
}
async function startDevServer() {
    const runtime = parseRuntimeArg();
    // For now, we'll assume the current working directory is the project root
    const routesDir = (0, path_1.join)(process.cwd(), 'app', 'routes');
    console.log(`Starting development server with ${runtime} runtime...`);
    console.log(`Routes directory: ${routesDir}`);
    // Create and start the dev server
    const server = new runtime_node_1.DevServer({
        routesDir: routesDir
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
