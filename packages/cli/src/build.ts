import { build, BuildOptions } from 'esbuild';
import { join, resolve, dirname } from 'path';
import { writeFile, mkdir, stat, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { scanRoutes, scanRouteModules } from '@apex/core';

interface BuildConfig {
  entryPoints: string[];
  outdir: string;
  minify?: boolean;
  sourcemap?: boolean;
}

export async function buildProject() {
  console.log('Starting Apex build...');
  
  // For now, we'll assume the current working directory is the project root
  const projectRoot = process.cwd();
  const routesDir = join(projectRoot, 'app', 'routes');
  const outDir = join(projectRoot, 'dist');
  
  // Create output directory if it doesn't exist
  try {
    await mkdir(outDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  // Scan routes to understand the project structure
  const routes = scanRoutes(routesDir);
  const routeModules = scanRouteModules(routes);
  
  console.log(`Found ${routes.length} routes`);
  
  // Build server bundle
  await buildServerBundle(projectRoot, outDir, routes, routeModules);
  
  // Build client bundle for islands
  await buildClientBundle(projectRoot, outDir);
  
  // Copy static assets if they exist
  await copyStaticAssets(projectRoot, outDir);
  
  console.log('Build completed successfully!');
}

async function buildServerBundle(
  projectRoot: string, 
  outDir: string, 
  routes: any[], 
  routeModules: any[]
) {
  console.log('Building server bundle...');
  
  // Create a virtual entry point for the server
  const serverEntryContent = `
    import { createServer } from 'http';
    import { join } from 'path';
    import { renderPage } from '@apex/renderer-react';
    
    // Import all route components
    ${routes.map((route, index) => 
      `import routeComponent${index} from '${route.filePath.replace(/\\\\/g, '/')}';`
    ).join('\n    ')}
    
    // Import all loaders and actions
    ${routeModules.filter(rm => rm.loaderPath).map((rm, index) => 
      `import { loader as loader${index} } from '${rm.loaderPath!.replace(/\\\\/g, '/')}';`
    ).join('\n    ')}
    
    ${routeModules.filter(rm => rm.actionPath).map((rm, index) => 
      `import { action as action${index} } from '${rm.actionPath!.replace(/\\\\/g, '/')}';`
    ).join('\n    ')}
    
    const routes = [
      ${routes.map((route, index) => 
        `{ path: '${route.path}', component: routeComponent${index}, isDynamic: ${route.isDynamic} }`
      ).join(',\n      ')}
    ];
    
    const loaders = {
      ${routeModules.filter(rm => rm.loaderPath).map((rm, index) => 
        `'${rm.route.path}': loader${index}`
      ).join(',\n      ')}
    };
    
    const actions = {
      ${routeModules.filter(rm => rm.actionPath).map((rm, index) => 
        `'${rm.route.path}': action${index}`
      ).join(',\n      ')}
    };
    
    // Simple server implementation
    const server = createServer(async (req, res) => {
      try {
        const url = req.url || '/';
        const method = req.method || 'GET';
        
        // Find matching route
        let matchedRoute = routes.find(r => r.path === url);
        
        // Try dynamic route matching if no exact match
        if (!matchedRoute) {
          for (const route of routes) {
            if (route.isDynamic) {
              const routeParts = route.path.split('/').filter(Boolean);
              const urlParts = url.split('/').filter(Boolean);
              
              if (routeParts.length === urlParts.length) {
                let matches = true;
                for (let i = 0; i < routeParts.length; i++) {
                  if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) {
                    // Dynamic segment, always matches
                    continue;
                  } else if (routeParts[i] !== urlParts[i]) {
                    // Static segment, must match exactly
                    matches = false;
                    break;
                  }
                }
                
                if (matches) {
                  matchedRoute = route;
                  break;
                }
              }
            }
          }
        }
        
        if (!matchedRoute) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        
        // Handle POST requests with actions
        if (method === 'POST' && actions[matchedRoute.path]) {
          const actionResult = await actions[matchedRoute.path]({ request: req, params: {}, context: {} });
          
          if (actionResult.status >= 300 && actionResult.status < 400) {
            res.statusCode = actionResult.status;
            Object.entries(actionResult.headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });
            res.end(actionResult.body);
            return;
          }
        }
        
        // Handle GET requests with loaders
        let loaderData = null;
        if (method === 'GET' && loaders[matchedRoute.path]) {
          const loaderResult = await loaders[matchedRoute.path]({ request: req, params: {}, context: {} });
          
          if (loaderResult.status >= 300 && loaderResult.status < 400) {
            // Handle redirects
            res.statusCode = loaderResult.status;
            Object.entries(loaderResult.headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });
            res.end(loaderResult.body);
            return;
          }
          
          if (typeof loaderResult.body === 'string') {
            try {
              loaderData = JSON.parse(loaderResult.body);
            } catch (e) {
              loaderData = loaderResult.body;
            }
          } else {
            loaderData = loaderResult.body;
          }
        }
        
        // Render the page
        const result = await renderPage(matchedRoute.component, loaderData || {});
        
        // Send HTML response
        res.setHeader('Content-Type', 'text/html');
        res.end(\`
<!DOCTYPE html>
<html>
<head>
  <title>Apex App</title>
</head>
<body>
  <div id="root">\${result.html}</div>
  <script src="/client.js"></script>
</body>
</html>
        \`);
      } catch (error) {
        console.error('Error handling request:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  `;
  
  // Write the virtual entry point to a temporary file
  const serverEntryPath = join(outDir, 'server-entry.js');
  await writeFile(serverEntryPath, serverEntryContent);
  
  // Build with esbuild
  const serverBuildOptions: BuildOptions = {
    entryPoints: [serverEntryPath],
    bundle: true,
    outfile: join(outDir, 'server.js'),
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    minify: true,
    sourcemap: false,
    external: ['react', 'react-dom'],
  };
  
  await build(serverBuildOptions);
  
  // Clean up temporary file
  // We'll keep it for debugging purposes for now
  console.log('Server bundle built successfully');
}

async function buildClientBundle(projectRoot: string, outDir: string) {
  console.log('Building client bundle...');
  
  // Create a simple client entry point
  const clientEntryContent = `
    // Simple client-side hydration script
    console.log('Client bundle loaded');
    
    // In a real implementation, this would handle island hydration
    // For now, we'll just log that it's working
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM content loaded');
    });
  `;
  
  // Write the client entry point
  const clientEntryPath = join(outDir, 'client-entry.js');
  await writeFile(clientEntryPath, clientEntryContent);
  
  // Build with esbuild
  const clientBuildOptions: BuildOptions = {
    entryPoints: [clientEntryPath],
    bundle: true,
    outfile: join(outDir, 'client.js'),
    platform: 'browser',
    target: 'es2020',
    format: 'iife',
    minify: true,
    sourcemap: false,
  };
  
  await build(clientBuildOptions);
  
  console.log('Client bundle built successfully');
}

async function copyStaticAssets(projectRoot: string, outDir: string) {
  console.log('Copying static assets...');
  
  // For now, we'll just log that this step would happen
  // In a real implementation, we would copy public/ directory if it exists
  const publicDir = join(projectRoot, 'public');
  if (existsSync(publicDir)) {
    console.log('Found public directory, would copy assets');
    // Implementation would go here
  }
  
  console.log('Static assets handled');
}