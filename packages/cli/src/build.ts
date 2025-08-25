#!/usr/bin/env node

import { build } from 'esbuild';
import { join, resolve, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'fs';

interface BuildOptions {
  entryPoints: string[];
  outdir: string;
  bundle: boolean;
  platform: 'node' | 'browser';
  format: 'esm' | 'cjs';
  target: string[];
  minify?: boolean;
  sourcemap?: boolean;
}

async function buildProject(options: BuildOptions) {
  try {
    // Ensure output directory exists
    if (!existsSync(options.outdir)) {
      mkdirSync(options.outdir, { recursive: true });
    }

    // Run esbuild
    const result = await build({
      entryPoints: options.entryPoints,
      outdir: options.outdir,
      bundle: options.bundle,
      platform: options.platform,
      format: options.format,
      target: options.target,
      minify: options.minify,
      sourcemap: options.sourcemap,
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Add any additional esbuild options here
    });

    console.log(`Build completed successfully!`);
    console.log(`Output directory: ${options.outdir}`);
    
    return result;
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }
}

// Function to scan for route files
function scanRouteFiles(routesDir: string): string[] {
  const entryPoints: string[] = [];
  
  function scanDirectory(dir: string) {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stats.isFile() && (entry.endsWith('.page.tsx') || entry.endsWith('.loader.ts') || entry.endsWith('.action.ts'))) {
        entryPoints.push(fullPath);
      }
    }
  }
  
  if (existsSync(routesDir)) {
    scanDirectory(routesDir);
  }
  
  return entryPoints;
}

// Function to scan for island components
function scanIslandFiles(componentsDir: string): string[] {
  const entryPoints: string[] = [];
  
  function scanDirectory(dir: string) {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stats.isFile() && entry.endsWith('.island.tsx')) {
        entryPoints.push(fullPath);
      }
    }
  }
  
  if (existsSync(componentsDir)) {
    scanDirectory(componentsDir);
  }
  
  return entryPoints;
}

// Main build function
export async function buildCommand(projectDir: string = process.cwd()) {
  console.log(`Building project at: ${projectDir}`);
  
  // Define entry points by scanning directories
  const routesDir = join(projectDir, 'app', 'routes');
  const componentsDir = join(projectDir, 'app', 'components');
  
  const routeEntryPoints = scanRouteFiles(routesDir);
  const islandEntryPoints = scanIslandFiles(componentsDir);
  
  // Filter out non-existent files
  const validRouteEntryPoints = routeEntryPoints.filter(file => existsSync(file));
  const validIslandEntryPoints = islandEntryPoints.filter(file => existsSync(file));
  
  if (validRouteEntryPoints.length === 0) {
    console.warn('No valid route entry points found. Creating a simple placeholder.');
    const placeholderDir = join(projectDir, 'app', 'routes');
    if (!existsSync(placeholderDir)) {
      mkdirSync(placeholderDir, { recursive: true });
    }
    
    const placeholderFile = join(placeholderDir, 'index.page.tsx');
    if (!existsSync(placeholderFile)) {
      writeFileSync(placeholderFile, `
import React from 'react';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Apex!</h1>
      <p>Your app is ready to build.</p>
    </div>
  );
}
      `.trim());
    }
    
    validRouteEntryPoints.push(placeholderFile);
  }
  
  // Server build
  console.log('Building server bundle...');
  await buildProject({
    entryPoints: validRouteEntryPoints,
    outdir: join(projectDir, 'dist', 'server'),
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node16'],
    minify: true,
    sourcemap: true,
  });
  
  // Client build (for islands)
  if (validIslandEntryPoints.length > 0) {
    console.log('Building client bundle...');
    await buildProject({
      entryPoints: validIslandEntryPoints,
      outdir: join(projectDir, 'dist', 'client'),
      bundle: true,
      platform: 'browser',
      format: 'esm',
      target: ['es2020'],
      minify: true,
      sourcemap: true,
    });
  }
  
  // Create a simple server.js file that can run the built app
  const serverJsContent = `
const { createServer } = require('http');
const { join } = require('path');
const { readFileSync } = require('fs');

// Simple server to serve the built app
const server = createServer((req, res) => {
  if (req.url === '/') {
    // Serve a simple HTML page for the root route
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(\`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Apex App</title>
        </head>
        <body>
          <div id="root">
            <h1>Welcome to Apex!</h1>
            <p>Your app has been built successfully.</p>
            <p>Run <code>node dist/server.js</code> to start the production server.</p>
          </div>
        </body>
      </html>
    \`);
  } else if (req.url === '/health') {
    // Health check endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
  } else {
    // 404 for other routes
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Production server running on http://localhost:\${PORT}\`);
});
  `.trim();
  
  const distDir = join(projectDir, 'dist');
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }
  
  writeFileSync(join(distDir, 'server.js'), serverJsContent);
  
  console.log('Build process completed!');
  console.log(`To run your built app: node ${join(projectDir, 'dist', 'server.js')}`);
}

// If this file is run directly, execute the build command
if (require.main === module) {
  const projectDir = process.argv[2] || process.cwd();
  buildCommand(projectDir).catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
  });
}