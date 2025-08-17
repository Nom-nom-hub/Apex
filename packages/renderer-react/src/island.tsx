import React from 'react';

// Keep track of islands for hydration
let islandId = 0;
const islandRegistry: Record<string, { component: React.ComponentType<any>, props: any }> = {};

// Island component that renders a marker on the server and hydrates on the client
export function Island({ 
  component: Component, 
  ...props 
}: { 
  component: React.ComponentType<any>;
  [key: string]: any;
}) {
  // Generate a unique ID for this island
  const id = `island-${islandId++}`;
  
  // Register the island for client-side hydration
  if (typeof window === 'undefined') {
    // Server-side: register the island
    islandRegistry[id] = { component: Component, props };
  }
  
  // Server-side rendering
  if (typeof window === 'undefined') {
    return React.createElement('div', {
      id,
      'data-island': Component.name || 'Island',
      'data-props': JSON.stringify(props),
      children: React.createElement(Component, props)
    });
  }
  
  // Client-side rendering (during hydration)
  return React.createElement(Component, props);
}

// Function to get island registry for client-side hydration
export function getIslandRegistry() {
  return islandRegistry;
}

// Function to clear island registry (for testing)
export function clearIslandRegistry() {
  Object.keys(islandRegistry).forEach(key => delete islandRegistry[key]);
  islandId = 0;
}