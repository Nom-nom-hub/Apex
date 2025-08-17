import React from 'react';

export default function DocsHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Apex Documentation</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Apex is a modern web framework that combines the best of server-side rendering 
          with client-side interactivity through islands architecture.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        <p className="text-gray-700 mb-4">
          To get started with Apex, install the CLI and create your first project:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-lg mb-6">
          <code>npm install -g @apex/cli
apex create my-app
cd my-app
apex dev</code>
        </pre>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <ul className="list-disc pl-5 text-gray-700 mb-6">
          <li>File-based routing system</li>
          <li>Server-side data loading with loaders</li>
          <li>Client-side interactivity with islands</li>
          <li>Automatic static site generation with ISR</li>
          <li>Built-in observability and monitoring</li>
          <li>Plugin system for extensibility</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h2>
        <p className="text-gray-700 mb-4">
          Check out our example applications to see Apex in action:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog</h3>
            <p className="text-gray-700 mb-4">A simple blog application demonstrating routing and data loading.</p>
            <a href="/examples/blog" className="text-indigo-600 hover:text-indigo-800 font-medium">View Example →</a>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">E-commerce</h3>
            <p className="text-gray-700 mb-4">A complete e-commerce starter with product listings and cart functionality.</p>
            <a href="/examples/ecommerce" className="text-indigo-600 hover:text-indigo-800 font-medium">View Example →</a>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">SaaS</h3>
            <p className="text-gray-700 mb-4">A dashboard-style SaaS application with metrics and project management.</p>
            <a href="/examples/saas" className="text-indigo-600 hover:text-indigo-800 font-medium">View Example →</a>
          </div>
        </div>
      </div>
    </div>
  );
}