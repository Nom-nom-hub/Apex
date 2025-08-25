import { join } from 'path';
import { mkdirSync, writeFileSync, existsSync } from 'fs';

export async function createCommand(projectName: string): Promise<void> {
  const projectDir = join(process.cwd(), projectName);
  
  // Check if directory already exists
  if (existsSync(projectDir)) {
    throw new Error(`Directory ${projectName} already exists`);
  }
  
  // Create project directory
  mkdirSync(projectDir);
  
  // Create package.json
  const packageJson = {
    name: projectName,
    version: '0.0.1',
    private: true,
    scripts: {
      dev: 'apex dev',
      build: 'apex build',
      start: 'apex start'
    },
    dependencies: {
      '@apex-framework/core': '^0.0.2',
      '@apex-framework/cli': '^0.0.2'
    }
  };
  
  writeFileSync(
    join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create app directory structure
  const appDir = join(projectDir, 'app');
  mkdirSync(appDir);
  
  const routesDir = join(appDir, 'routes');
  mkdirSync(routesDir);
  
  // Create a basic index page
  const indexPageContent = `import React from 'react';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Apex!</h1>
        <p className="text-gray-600">Your new Apex project is ready to go.</p>
      </div>
    </div>
  );
}`;
  
  writeFileSync(
    join(routesDir, 'index.page.tsx'),
    indexPageContent
  );
  
  // Create a basic 404 page
  const notFoundPageContent = `import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}`;
  
  writeFileSync(
    join(routesDir, '404.page.tsx'),
    notFoundPageContent
  );
  
  // Create tsconfig.json
  const tsconfigContent = {
    compilerOptions: {
      target: "ES2020",
      module: "commonjs",
      lib: ["ES2020", "DOM"],
      jsx: "react-jsx",
      declaration: true,
      outDir: "./dist",
      rootDir: "./app",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ["app/**/*"],
    exclude: ["node_modules", "dist"]
  };
  
  writeFileSync(
    join(projectDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2)
  );
  
  console.log(`Successfully created new Apex project: ${projectName}`);
  console.log(`\nTo get started, run the following commands:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  console.log(`  npm run dev`);
}