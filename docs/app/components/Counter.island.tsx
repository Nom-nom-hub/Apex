import { Island } from '@apex/core'
import React from 'react'

interface CounterProps {
  initialCount?: number
}

const Counter: Island<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = React.useState(initialCount)
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '10px' }}>Decrement</button>
    </div>
  )
}

export default Counter