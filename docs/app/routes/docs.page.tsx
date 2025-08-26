import React from 'react'
import Layout from '../components/RootLayout'

export default function Docs() {
  return (
    <Layout>
      <h1>Documentation</h1>
      <p>
        Welcome to the Apex Framework documentation. Here you'll find guides and 
        references for all aspects of the framework.
      </p>
      
      <h2>Getting Started</h2>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#project-structure">Project Structure</a></li>
        <li><a href="#routing">Routing</a></li>
        <li><a href="#components">Components</a></li>
      </ul>
      
      <h3 id="installation">Installation</h3>
      <p>To create a new Apex project, run:</p>
      <pre><code>pnpm create apex-app@latest my-app</code></pre>
      
      <h3 id="project-structure">Project Structure</h3>
      <p>Apex projects follow a specific structure:</p>
      <pre><code>
my-app/
├── app/
│   ├── components/
│   ├── routes/
│   └── styles/
├── public/
├── apex.config.ts
└── package.json
      </code></pre>
      
      <h3 id="routing">Routing</h3>
      <p>Apex uses a file-based routing system. Files in the <code>app/routes</code> directory automatically become routes.</p>
      
      <h3 id="components">Components</h3>
      <p>Apex supports both server-rendered components and interactive client components (islands).</p>
    </Layout>
  )
}