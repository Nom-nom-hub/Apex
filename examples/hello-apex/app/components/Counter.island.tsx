import React, { useState } from 'react';
import { Island } from '@apex/renderer-react';

export default function CounterIsland({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}