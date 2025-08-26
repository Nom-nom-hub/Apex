import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Apex Framework</title>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          header {
            background-color: #333;
            color: white;
            padding: 1rem;
          }
          nav {
            display: flex;
            gap: 1rem;
          }
          nav a {
            color: white;
            text-decoration: none;
          }
          nav a:hover {
            text-decoration: underline;
          }
          main {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          footer {
            text-align: center;
            padding: 2rem;
            border-top: 1px solid #eee;
            margin-top: 2rem;
          }
        `}</style>
      </head>
      <body>
        <header>
          <h1>Apex Framework</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/docs">Documentation</a>
            <a href="/examples">Examples</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© {new Date().getFullYear()} Apex Framework. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}