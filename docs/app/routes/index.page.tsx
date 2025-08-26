import React from 'react'
import Layout from '../components/RootLayout'
import Counter from '../components/Counter.island'

export default function Index() {
  return (
    <Layout>
      <h1>Welcome to Apex Framework</h1>
      <p>
        Apex is a modern, full-stack web framework designed for building fast, 
        scalable web applications with React and TypeScript.
      </p>
      
      <h2>Features</h2>
      <ul>
        <li>File-based routing system</li>
        <li>Server-side rendering with client-side hydration</li>
        <li>Partial hydration for interactive components</li>
        <li>TypeScript support out of the box</li>
        <li>Built-in development server with hot reloading</li>
        <li>Optimized production builds</li>
        <li>Extensible plugin system</li>
      </ul>
      
      <h2>Interactive Example</h2>
      <Counter initialCount={0} />
      
      <h2>Get Started</h2>
      <p>To create a new Apex project, run:</p>
      <pre><code>pnpm create apex-app@latest my-app</code></pre>
      
      <h2>Documentation</h2>
      <p>
        Visit our <a href="/docs">documentation</a> to learn more about Apex features 
        and how to build your own applications.
      </p>
    </Layout>
  )
}