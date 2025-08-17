import { describe, it, expect } from 'vitest';
import apex, { scanRoutes, matchRoute, renderPage, DevServer } from '../src/index';

describe('Apex Meta-Package', () => {
  it('should export all core functionality', () => {
    expect(apex).toBeDefined();
    expect(apex.scanRoutes).toBeDefined();
    expect(apex.matchRoute).toBeDefined();
    expect(apex.renderPage).toBeDefined();
    expect(apex.DevServer).toBeDefined();
  });

  it('should have individual exports', () => {
    expect(scanRoutes).toBeDefined();
    expect(typeof scanRoutes).toBe('function');
    
    expect(matchRoute).toBeDefined();
    expect(typeof matchRoute).toBe('function');
    
    expect(renderPage).toBeDefined();
    expect(typeof renderPage).toBe('function');
    
    expect(DevServer).toBeDefined();
    expect(typeof DevServer).toBe('function');
  });

  it('should have a default export', () => {
    expect(apex.default).toBeDefined();
  });
});