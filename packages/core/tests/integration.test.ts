import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { mkdirSync, writeFileSync, rmdirSync, unlinkSync } from 'fs';
import { scanRoutes, matchRoute } from '../src/router';
import { renderPage } from '@apex/renderer-react';

describe('Integration', () => {
  const testRoutesDir = join(__dirname, 'integration-routes');
  
  it('should scan routes and render a page', async () => {
    // Create temporary routes directory for testing
    mkdirSync(testRoutesDir, { recursive: true });
    
    // Create a test page
    const pageContent = `
      export default function HomePage() {
        return React.createElement('h1', null, 'Hello Apex');
      }
    `;
    writeFileSync(join(testRoutesDir, 'index.page.tsx'), pageContent);
    
    // Scan routes
    const routes = scanRoutes(testRoutesDir);
    
    // Verify we found the route
    expect(routes).toHaveLength(1);
    expect(routes[0]).toEqual({
      path: '/',
      filePath: join(testRoutesDir, 'index.page.tsx'),
      isDynamic: false
    });
    
    // Clean up
    unlinkSync(join(testRoutesDir, 'index.page.tsx'));
    rmdirSync(testRoutesDir);
  });
});