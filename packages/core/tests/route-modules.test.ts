import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { mkdirSync, writeFileSync, rmdirSync, unlinkSync } from 'fs';
import { scanRouteModules, RouteModuleInfo } from '../src/route-modules';
import { Route } from '../src/router';

describe('Route Modules', () => {
  const testRoutesDir = join(__dirname, 'tmp-route-modules');
  
  beforeEach(() => {
    // Create temporary routes directory for testing
    mkdirSync(testRoutesDir, { recursive: true });
  });
  
  afterEach(() => {
    // Clean up temporary routes directory
    try {
      const cleanup = (dir: string) => {
        const entries = readdirSync(dir);
        for (const entry of entries) {
          const fullPath = join(dir, entry);
          if (statSync(fullPath).isDirectory()) {
            cleanup(fullPath);
          } else {
            unlinkSync(fullPath);
          }
        }
        rmdirSync(dir);
      };
      
      cleanup(testRoutesDir);
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  
  it('should scan for loader and action files', () => {
    // Create test files
    writeFileSync(join(testRoutesDir, 'index.page.tsx'), '// index page');
    writeFileSync(join(testRoutesDir, 'index.loader.ts'), '// index loader');
    writeFileSync(join(testRoutesDir, 'index.action.ts'), '// index action');
    
    const routes: Route[] = [
      {
        path: '/',
        filePath: join(testRoutesDir, 'index.page.tsx'),
        isDynamic: false
      }
    ];
    
    const routeModules = scanRouteModules(routes);
    
    expect(routeModules).toHaveLength(1);
    expect(routeModules[0]).toEqual({
      route: routes[0],
      loaderPath: join(testRoutesDir, 'index.loader.ts'),
      actionPath: join(testRoutesDir, 'index.action.ts')
    });
  });
  
  it('should handle missing loader and action files', () => {
    // Create test files
    writeFileSync(join(testRoutesDir, 'about.page.tsx'), '// about page');
    
    const routes: Route[] = [
      {
        path: '/about',
        filePath: join(testRoutesDir, 'about.page.tsx'),
        isDynamic: false
      }
    ];
    
    const routeModules = scanRouteModules(routes);
    
    expect(routeModules).toHaveLength(1);
    expect(routeModules[0]).toEqual({
      route: routes[0],
      loaderPath: undefined,
      actionPath: undefined
    });
  });
});

// We need to import these for the tests to work
import { readdirSync, statSync } from 'fs';