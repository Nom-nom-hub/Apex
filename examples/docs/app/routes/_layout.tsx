import React from 'react';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Apex Documentation</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <a href="/" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Guides
                </a>
                <a href="/api" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  API Reference
                </a>
                <a href="/examples" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Examples
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 pr-8">
            <nav className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/getting-started" className="text-gray-600 hover:text-gray-900">Getting Started</a>
                </li>
                <li>
                  <a href="/routing" className="text-gray-600 hover:text-gray-900">Routing</a>
                </li>
                <li>
                  <a href="/loaders-actions" className="text-gray-600 hover:text-gray-900">Loaders & Actions</a>
                </li>
                <li>
                  <a href="/islands" className="text-gray-600 hover:text-gray-900">Islands</a>
                </li>
                <li>
                  <a href="/plugins" className="text-gray-600 hover:text-gray-900">Plugins</a>
                </li>
                <li>
                  <a href="/deployments" className="text-gray-600 hover:text-gray-900">Deployments</a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="md:w-3/4 mt-6 md:mt-0">
            <div className="bg-white shadow rounded-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2023 Apex Framework. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}