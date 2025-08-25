import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello Apex</h1>
          <p className="text-lg text-gray-600">
            Welcome to your new Apex application!
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Get Started</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </span>
              Edit this page in <code className="bg-gray-100 px-1 rounded">app/routes/index.page.tsx</code>
            </li>
            <li className="flex items-center">
              <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </span>
              Create new routes in the <code className="bg-gray-100 px-1 rounded">app/routes</code> directory
            </li>
            <li className="flex items-center">
              <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </span>
              Add components in the <code className="bg-gray-100 px-1 rounded">app/components</code> directory
            </li>
          </ul>
        </div>
        <div className="text-center">
          <a 
            href="/dashboard" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-150 ease-in-out transform hover:scale-105"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}