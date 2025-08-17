import React from 'react';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Apex Blog</h1>
          <nav className="mt-4">
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li>
                <a href="/about" className="text-blue-600 hover:text-blue-800">About</a>
              </li>
              <li>
                <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2023 Apex Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}