import React from 'react';

export default function AboutPage() {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">About Our Blog</h2>
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Welcome to our Apex-powered blog! This example demonstrates how to build a 
            full-featured blog application using the Apex framework.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Features Demonstrated</h3>
          <ul className="list-disc pl-5 text-gray-700 mb-4">
            <li>File-based routing with dynamic segments</li>
            <li>Server-side data loading with loaders</li>
            <li>Reusable layout components</li>
            <li>Static site generation with ISR</li>
            <li>Caching and performance optimization</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Technology Stack</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Apex Framework</li>
            <li>React for UI components</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}