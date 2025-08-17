// This script will be served by the dev server and handles client-side hydration
// of island components

interface IslandComponent {
  (props: any): JSX.Element;
}

interface IslandRegistry {
  [id: string]: {
    component: IslandComponent;
    props: any;
  };
}

// In a real implementation, this would be populated by the server
// For now, we'll define a simple counter component
const CounterIsland: IslandComponent = ({ initialCount = 0 }) => {
  const [count, setCount] = React.useState(initialCount);
  
  return React.createElement(
    'div',
    { style: { border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' } },
    React.createElement('p', null, `Count: ${count}`),
    React.createElement(
      'button',
      { onClick: () => setCount(count + 1) },
      'Increment'
    ),
    React.createElement(
      'button',
      { onClick: () => setCount(count - 1) },
      'Decrement'
    )
  );
};

// Simple hydration function
function hydrateIslands() {
  // Find all island markers
  const islandMarkers = document.querySelectorAll('[data-island]');
  
  islandMarkers.forEach(marker => {
    const id = marker.id;
    const componentName = marker.getAttribute('data-island');
    const propsJson = marker.getAttribute('data-props');
    
    let props = {};
    try {
      props = JSON.parse(propsJson || '{}');
    } catch (e) {
      console.error('Error parsing island props:', e);
    }
    
    // For this example, we only have Counter islands
    if (componentName === 'CounterIsland') {
      const root = ReactDOM.hydrateRoot(
        marker,
        React.createElement(CounterIsland, props)
      );
    }
  });
}

// Wait for DOM to be ready and React to be loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateIslands);
} else {
  hydrateIslands();
}