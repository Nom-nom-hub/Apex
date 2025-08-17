import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { mkdirSync, writeFileSync, rmdirSync, unlinkSync } from 'fs';
import { scanRoutes, matchRoute } from '../src/router';

describe('Router', () => {
  const testRoutesDir = join(__dirname, 'tmp-routes');
  
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
  
  describe('scanRoutes', () => {
    it('should scan static routes correctly', () => {
      // Create test files
      writeFileSync(join(testRoutesDir, 'index.page.tsx'), '// index page');
      writeFileSync(join(testRoutesDir, 'about.page.tsx'), '// about page');
      mkdirSync(join(testRoutesDir, 'blog'));
      writeFileSync(join(testRoutesDir, 'blog', 'index.page.tsx'), '// blog index');
      writeFileSync(join(testRoutesDir, 'blog', 'first.page.tsx'), '// first post');
      
      const routes = scanRoutes(testRoutesDir);
      
      expect(routes).toHaveLength(4);
      expect(routes[0]).toEqual({
        path: '/',
        filePath: join(testRoutesDir, 'index.page.tsx'),
        isDynamic: false
      });
      
      expect(routes[1]).toEqual({
        path: '/about',
        filePath: join(testRoutesDir, 'about.page.tsx'),
        isDynamic: false
      });
      
      expect(routes[2]).toEqual({
        path: '/blog',
        filePath: join(testRoutesDir, 'blog', 'index.page.tsx'),
        isDynamic: false
      });
      
      expect(routes[3]).toEqual({
        path: '/blog/first',
        filePath: join(testRoutesDir, 'blog', 'first.page.tsx'),
        isDynamic: false
      });
    });
    
    it('should scan dynamic routes correctly', () => {
      // Create test files with dynamic segments
      writeFileSync(join(testRoutesDir, 'index.page.tsx'), '// index page');
      mkdirSync(join(testRoutesDir, '[id]'));
      writeFileSync(join(testRoutesDir, '[id]', 'page.page.tsx'), '// dynamic page');
      mkdirSync(join(testRoutesDir, 'blog'));
      writeFileSync(join(testRoutesDir, 'blog', '[slug].page.tsx'), '// blog post');
      
      const routes = scanRoutes(testRoutesDir);
      
      expect(routes).toHaveLength(3);
      expect(routes[0]).toEqual({
        path: '/',
        filePath: join(testRoutesDir, 'index.page.tsx'),
        isDynamic: false
      });
      
      expect(routes[1]).toEqual({
        path: '/blog/[slug]',
        filePath: join(testRoutesDir, 'blog', '[slug].page.tsx'),
        isDynamic: true
      });
      
      expect(routes[2]).toEqual({
        path: '/[id]/page',
        filePath: join(testRoutesDir, '[id]', 'page.page.tsx'),
        isDynamic: true
      });
    });
  });
  
  describe('matchRoute', () => {
    it('should match static routes exactly', () => {
      const routes = [
        { path: '/', filePath: '/index.page.tsx', isDynamic: false },
        { path: '/about', filePath: '/about.page.tsx', isDynamic: false },
        { path: '/blog/first', filePath: '/blog/first.page.tsx', isDynamic: false }
      ];
      
      expect(matchRoute(routes, '/')).toEqual(routes[0]);
      expect(matchRoute(routes, '/about')).toEqual(routes[1]);
      expect(matchRoute(routes, '/blog/first')).toEqual(routes[2]);
      expect(matchRoute(routes, '/nonexistent')).toBeNull();
    });
    
    it('should match dynamic routes', () => {
      const routes = [
        { path: '/', filePath: '/index.page.tsx', isDynamic: false },
        { path: '/user/[id]', filePath: '/user/[id].page.tsx', isDynamic: true },
        { path: '/blog/[slug]', filePath: '/blog/[slug].page.tsx', isDynamic: true }
      ];
      
      expect(matchRoute(routes, '/user/123')).toEqual(routes[1]);
      expect(matchRoute(routes, '/blog/hello-world')).toEqual(routes[2]);
      expect(matchRoute(routes, '/user/123/')).toEqual(routes[1]); // trailing slash
    });
  });
});

// We need to import these for the tests to work
import { readdirSync, statSync } from 'fs';