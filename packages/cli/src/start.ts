#!/usr/bin/env node

import { join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

// Parse command line arguments for --runtime flag
function parseRuntimeArg(): { runtime: string, remainingArgs: string[] } {
  const args = process.argv.slice(2);
  const runtimeIndex = args.indexOf('--runtime');
  
  if (runtimeIndex !== -1 && runtimeIndex + 1 < args.length) {
    const runtime = args[runtimeIndex + 1];
    const remainingArgs = [...args];
    remainingArgs.splice(runtimeIndex, 2); // Remove --runtime and its value
    return { runtime, remainingArgs };
  }
  
  // Default to node runtime
  return { runtime: 'node', remainingArgs: args };
}

export async function startCommand(projectDir: string = process.cwd()) {
  const { runtime, remainingArgs } = parseRuntimeArg();
  const projectPath = remainingArgs[0] || projectDir;
  
  console.log(`Starting production server for project at: ${projectPath} with ${runtime} runtime`);
  
  // Check if the built server exists
  const serverPath = join(projectPath, 'dist', 'server.js');
  if (!existsSync(serverPath)) {
    console.error('Built server not found. Please run "apex build" first.');
    process.exit(1);
  }
  
  // Determine the runtime command
  let runtimeCommand = 'node';
  let runtimeArgs = [serverPath];
  
  if (runtime === 'bun') {
    runtimeCommand = 'bun';
  } else if (runtime === 'deno') {
    runtimeCommand = 'deno';
    runtimeArgs = ['run', '--allow-net', '--allow-read', '--allow-env', serverPath];
  }
  
  // Spawn the runtime process to run the built server
  const serverProcess = spawn(runtimeCommand, runtimeArgs, {
    cwd: projectPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  // Handle process events
  serverProcess.on('error', (error) => {
    console.error(`Failed to start production server with ${runtime} runtime:`, error);
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
  
  console.log(`Production server started with ${runtime} runtime. Visit http://localhost:3000 to view your app.`);
}

// If this file is run directly, execute the start command
if (require.main === module) {
  startCommand().catch(error => {
    console.error('Failed to start production server:', error);
    process.exit(1);
  });
}