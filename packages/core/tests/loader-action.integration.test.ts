import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { mkdirSync, writeFileSync, rmdirSync, unlinkSync } from 'fs';
import { scanRoutes, scanRouteModules } from '../src/index';

describe('Integration - Loaders and Actions', () => {
  const testRoutesDir = join(__dirname, 'integration-loader-action');
  
  it('should scan routes with associated loader and action files', () => {
    // Create temporary routes directory for testing
    mkdirSync(testRoutesDir, { recursive: true });
    
    try {
      // Create test files
      writeFileSync(join(testRoutesDir, 'index.page.tsx'), '// index page');
      writeFileSync(join(testRoutesDir, 'index.loader.ts'), '// index loader');
      writeFileSync(join(testRoutesDir, 'index.action.ts'), '// index action');
      
      writeFileSync(join(testRoutesDir, 'about.page.tsx'), '// about page');
      // No loader or action for about page
      
      // Create dashboard route
      const dashboardDir = join(testRoutesDir, 'dashboard');
      mkdirSync(dashboardDir);
      writeFileSync(join(dashboardDir, 'index.page.tsx'), '// dashboard page');
      writeFileSync(join(dashboardDir, 'index.loader.ts'), '// dashboard loader');
      
      // Scan routes
      const routes = scanRoutes(testRoutesDir);
      expect(routes).toHaveLength(3);
      
      // Scan route modules
      const routeModules = scanRouteModules(routes);
      expect(routeModules).toHaveLength(3);
      
      // Check root route has loader and action
      const rootModule = routeModules.find(rm => rm.route.path === '/');
      expect(rootModule).toBeDefined();
      expect(rootModule?.loaderPath).toBeDefined();
      expect(rootModule?.actionPath).toBeDefined();
      
      // Check about route has no loader or action
      const aboutModule = routeModules.find(rm => rm.route.path === '/about');
      expect(aboutModule).toBeDefined();
      expect(aboutModule?.loaderPath).toBeUndefined();
      expect(aboutModule?.actionPath).toBeUndefined();
      
      // Check dashboard route has loader but no action
      const dashboardModule = routeModules.find(rm => rm.route.path === '/dashboard');
      expect(dashboardModule).toBeDefined();
      expect(dashboardModule?.loaderPath).toBeDefined();
      expect(dashboardModule?.actionPath).toBeUndefined();
    } finally {
      // Clean up
      try {
        unlinkSync(join(testRoutesDir, 'index.page.tsx'));
        unlinkSync(join(testRoutesDir, 'index.loader.ts'));
        unlinkSync(join(testRoutesDir, 'index.action.ts'));
        unlinkSync(join(testRoutesDir, 'about.page.tsx'));
        
        unlinkSync(join(testRoutesDir, 'dashboard', 'index.page.tsx'));
        unlinkSync(join(testRoutesDir, 'dashboard', 'index.loader.ts'));
        rmdirSync(join(testRoutesDir, 'dashboard'));
        
        rmdirSync(testRoutesDir);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});