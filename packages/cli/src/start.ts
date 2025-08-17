#!/usr/bin/env node

import { join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

export async function startCommand(projectDir: string = process.cwd()) {
  console.log(`Starting production server for project at: ${projectDir}`);
  
  // Check if the built server exists
  const serverPath = join(projectDir, 'dist', 'server.js');
  if (!existsSync(serverPath)) {
    console.error('Built server not found. Please run "apex build" first.');
    process.exit(1);
  }
  
  // Spawn the Node.js process to run the built server
  const serverProcess = spawn('node', [serverPath], {
    cwd: projectDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  // Handle process events
  serverProcess.on('error', (error) => {
    console.error('Failed to start production server:', error);
    process.exit(1);
  });
  
  serverProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`Production server exited with code ${code}`);
      process.exit(code);
    }
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down production server...');
    serverProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down production server...');
    serverProcess.kill('SIGTERM');
  });
  
  console.log(`Production server started. Visit http://localhost:3000 to view your app.`);
}

// If this file is run directly, execute the start command
if (require.main === module) {
  const projectDir = process.argv[2] || process.cwd();
  startCommand(projectDir).catch(error => {
    console.error('Failed to start production server:', error);
    process.exit(1);
  });
}