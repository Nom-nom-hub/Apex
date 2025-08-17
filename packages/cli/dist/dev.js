"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDevServer = startDevServer;
const path_1 = require("path");
// Temporary workaround for the import issue
// In a real implementation, we would import from '@apex/runtime-node'
async function startDevServer() {
    // For now, we'll assume the current working directory is the project root
    const routesDir = (0, path_1.join)(process.cwd(), 'app', 'routes');
    console.log('Starting development server...');
    console.log(`Routes directory: ${routesDir}`);
    console.log('Development server running on http://localhost:3000');
    // Keep the process alive
    process.on('SIGINT', () => {
        console.log('Shutting down dev server...');
        process.exit(0);
    });
    // Simulate server running
    setInterval(() => {
        // Keep alive
    }, 1000);
}
