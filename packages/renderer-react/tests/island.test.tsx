import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { Island, getIslandRegistry, clearIslandRegistry } from '../src/island';

describe('Island', () => {
  beforeEach(() => {
    clearIslandRegistry();
  });
  
  it('should render an island component on the server', () => {
    const TestComponent = () => React.createElement('div', null, 'Hello Island');
    
    // Simulate server-side rendering
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    try {
      const island = React.createElement(Island, { 
        component: TestComponent,
        testProp: 'test-value'
      });
      
      // Render to string to simulate server-side rendering
      const { renderToString } = require('react-dom/server');
      const html = renderToString(island);
      
      expect(html).toContain('data-island="TestComponent"');
      expect(html).toContain('data-props');
      
      // Check that the island was registered
      const registry = getIslandRegistry();
      const islandId = Object.keys(registry)[0];
      expect(registry[islandId]).toBeDefined();
      expect(registry[islandId].component).toBe(TestComponent);
      expect(registry[islandId].props).toEqual({ testProp: 'test-value' });
    } finally {
      // Restore window
      // @ts-ignore
      global.window = originalWindow;
    }
  });
  
  it('should render an island component on the client', () => {
    const TestComponent = () => React.createElement('div', null, 'Hello Island');
    
    // Simulate client-side rendering by defining window
    // @ts-ignore
    global.window = {};
    
    try {
      const island = React.createElement(Island, { 
        component: TestComponent,
        testProp: 'test-value'
      });
      
      // Render to string to simulate client-side rendering
      const { renderToString } = require('react-dom/server');
      const html = renderToString(island);
      
      expect(html).toContain('<div>Hello Island</div>');
    } finally {
      // Restore window
      // @ts-ignore
      delete global.window;
    }
  });
});