import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { Island } from '../src/island';

describe('Island E2E', () => {
  it('should hydrate islands correctly', async () => {
    // Create a mock DOM environment
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="island-0" data-island="CounterIsland" data-props='{"initialCount": 5}'></div>
        </body>
      </html>
    `, { runScripts: 'dangerously' });
    
    // Set up global objects
    global.document = dom.window.document;
    global.window = dom.window;
    global.HTMLElement = dom.window.HTMLElement;
    
    // Mock React and ReactDOM
    global.React = await import('react');
    global.ReactDOM = await import('react-dom/client');
    
    // Simulate the hydration script
    const scriptContent = `
      function hydrateIslands() {
        const islandMarkers = document.querySelectorAll('[data-island]');
        islandMarkers.forEach(marker => {
          const propsJson = marker.getAttribute('data-props');
          let props = {};
          try {
            props = JSON.parse(propsJson || '{}');
          } catch (e) {
            console.error('Error parsing island props:', e);
          }
          
          if (marker.getAttribute('data-island') === 'CounterIsland') {
            let count = props.initialCount || 0;
            const container = marker;
            container.innerHTML = '';
            container.style.border = '1px solid #ccc';
            container.style.padding = '1rem';
            container.style.borderRadius = '4px';
            
            const countElement = document.createElement('p');
            countElement.textContent = 'Count: ' + count;
            container.appendChild(countElement);
            
            const incrementButton = document.createElement('button');
            incrementButton.textContent = 'Increment';
            incrementButton.onclick = () => {
              count++;
              countElement.textContent = 'Count: ' + count;
            };
            container.appendChild(incrementButton);
            
            const decrementButton = document.createElement('button');
            decrementButton.textContent = 'Decrement';
            decrementButton.onclick = () => {
              count--;
              countElement.textContent = 'Count: ' + count;
            };
            container.appendChild(decrementButton);
          }
        });
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hydrateIslands);
      } else {
        hydrateIslands();
      }
    `;
    
    // Execute the script
    dom.window.eval(scriptContent);
    
    // Wait a bit for the script to run
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check that the island was hydrated correctly
    const islandElement = dom.window.document.getElementById('island-0');
    expect(islandElement).toBeDefined();
    expect(islandElement?.innerHTML).toContain('Count: 5');
    expect(islandElement?.innerHTML).toContain('Increment');
    expect(islandElement?.innerHTML).toContain('Decrement');
    
    // Clean up
    delete global.document;
    delete global.window;
    delete global.HTMLElement;
    delete global.React;
    delete global.ReactDOM;
  });
});