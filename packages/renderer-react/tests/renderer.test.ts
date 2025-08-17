import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderPage } from '../src/renderer';

describe('Renderer React', () => {
  it('should render a simple component', async () => {
    const TestComponent = () => React.createElement('div', null, 'Hello World');
    
    const result = await renderPage(TestComponent);
    
    expect(result.html).toBe('<div>Hello World</div>');
  });
  
  it('should render a component with props', async () => {
    const TestComponent = ({ name }: { name: string }) => 
      React.createElement('div', null, `Hello ${name}`);
    
    const result = await renderPage(TestComponent, { name: 'Apex' });
    
    expect(result.html).toBe('<div>Hello Apex</div>');
  });
});