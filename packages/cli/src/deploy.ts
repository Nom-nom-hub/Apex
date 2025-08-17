#!/usr/bin/env node

import { join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { build } from 'esbuild';

interface StaticExportOptions {
  outDir?: string;
  adapter?: string;
}

export async function deployCommand(projectDir: string = process.cwd(), options: StaticExportOptions = {}) {
  console.log(`Deploying static site for project at: ${projectDir}`);
  
  // Set default options
  const outDir = options.outDir || join(projectDir, 'dist', 'static');
  const adapter = options.adapter || 'static';
  
  // Ensure output directory exists
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  
  // Scan routes directory
  const routesDir = join(projectDir, 'app', 'routes');
  if (!existsSync(routesDir)) {
    console.error('Routes directory not found');
    process.exit(1);
  }
  
  // Collect all static routes
  const staticRoutes = collectStaticRoutes(routesDir);
  console.log(`Found ${staticRoutes.length} static routes to export`);
  
  // Generate static HTML files for each route
  for (const route of staticRoutes) {
    try {
      console.log(`Generating static HTML for route: ${route.path}`);
      
      // Create directory structure for the route
      const routeOutDir = join(outDir, route.path === '/' ? '' : route.path);
      if (!existsSync(routeOutDir)) {
        mkdirSync(routeOutDir, { recursive: true });
      }
      
      // Generate HTML content (simplified for this example)
      const htmlContent = generateStaticHtml(route);
      
      // Write HTML file
      const htmlFilePath = join(routeOutDir, 'index.html');
      writeFileSync(htmlFilePath, htmlContent);
      
      console.log(`Generated static HTML file: ${htmlFilePath}`);
      
      // If this is the root route, also copy to outDir
      if (route.path === '/') {
        const rootHtmlFilePath = join(outDir, 'index.html');
        writeFileSync(rootHtmlFilePath, htmlContent);
        console.log(`Generated root HTML file: ${rootHtmlFilePath}`);
      }
    } catch (error) {
      console.error(`Error generating static HTML for route ${route.path}:`, error);
    }
  }
  
  // Create a simple manifest file with revalidation metadata
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    routes: staticRoutes.map(route => ({
      path: route.path,
      prerender: route.prerender,
      lastModified: new Date().toISOString()
    }))
  };
  
  const manifestFilePath = join(outDir, 'manifest.json');
  writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest file: ${manifestFilePath}`);
  
  // Create a simple robots.txt file
  const robotsTxt = `User-agent: *
Disallow:

Sitemap: https://your-site.com/sitemap.xml
`;
  
  const robotsTxtFilePath = join(outDir, 'robots.txt');
  writeFileSync(robotsTxtFilePath, robotsTxt);
  console.log(`Generated robots.txt file: ${robotsTxtFilePath}`);
  
  console.log(`Static site deployed to: ${outDir}`);
  console.log(`To serve the static site, you can use:`);
  console.log(`  npx serve ${outDir}`);
  console.log(`  python -m http.server 8000 --directory ${outDir}`);
  console.log(`  php -S localhost:8000 -t ${outDir}`);
}

interface StaticRoute {
  path: string;
  filePath: string;
  prerender?: any;
}

function collectStaticRoutes(routesDir: string, basePath: string = '', routes: StaticRoute[] = []): StaticRoute[] {
  const entries = readdirSync(routesDir);
  
  for (const entry of entries) {
    const fullPath = join(routesDir, entry);
    const stats = statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Recursively scan subdirectories
      const routeSegment = entry.startsWith('[') && entry.endsWith(']') 
        ? '' // Skip dynamic routes for static export
        : entry;
      
      const newBasePath = basePath ? join(basePath, routeSegment) : routeSegment;
      collectStaticRoutes(fullPath, newBasePath, routes);
    } else if (stats.isFile() && entry.endsWith('.page.tsx')) {
      // Process static page files
      const fileName = entry.replace('.page.tsx', '');
      const routeSegment = fileName === 'index' 
        ? '' 
        : fileName;
      
      const routePath = basePath ? join(basePath, routeSegment) : routeSegment;
      const normalizedPath = routePath 
        ? `/${routePath.replace(/\\\\/g, '/')}` 
        : '/';
      
      // Try to read prerender configuration from the file
      let prerender: any = null;
      try {
        const loaderPath = fullPath.replace('.page.tsx', '.loader.ts');
        if (existsSync(loaderPath)) {
          // In a real implementation, we would parse the file to extract prerender config
          // For now, we'll use a default configuration
          prerender = {
            cache: {
              maxAge: 60
            }
          };
        }
      } catch (error) {
        // Ignore errors when reading prerender config
      }
      
      routes.push({
        path: normalizedPath,
        filePath: fullPath,
        prerender
      });
    }
  }
  
  return routes;
}

function generateStaticHtml(route: StaticRoute): string {
  // Generate a simple HTML page for the route
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>Static Page for ${route.path}</title>
  <meta name=\"description\" content=\"Static export of route ${route.path}\">
  ${route.prerender ? `<meta name=\"revalidate\" content=\"${route.prerender.cache?.maxAge || 60}\">` : ''}
</head>
<body>
  <div id=\"root\">
    <h1>Static Page for ${route.path}</h1>
    <p>This is a static export of the route: ${route.path}</p>
    <p>Last generated: ${new Date().toISOString()}</p>
    ${route.prerender ? `<p>Revalidation interval: ${route.prerender.cache?.maxAge || 60} seconds</p>` : ''}
  </div>
</body>
</html>`;
}

// If this file is run directly, execute the deploy command
if (require.main === module) {
  const projectDir = process.argv[2] || process.cwd();
  const args = process.argv.slice(3);
  
  const options: StaticExportOptions = {};
  const adapterIndex = args.indexOf('--adapter');
  if (adapterIndex !== -1 && adapterIndex + 1 < args.length) {
    options.adapter = args[adapterIndex + 1];
  }
  
  deployCommand(projectDir, options).catch(error => {
    console.error('Failed to deploy static site:', error);
    process.exit(1);
  });
}