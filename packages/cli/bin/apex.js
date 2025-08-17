#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

if (command === 'dev') {
  // Import the dev server dynamically
  import('../dist/dev.js')
    .then(module => {
      return module.startDevServer();
    })
    .catch(error => {
      console.error('Error starting dev server:', error);
      process.exit(1);
    });
} else if (command === 'build') {
  // Import the build command dynamically
  import('../dist/build.js')
    .then(module => {
      const projectDir = args[1] || process.cwd();
      return module.buildCommand(projectDir);
    })
    .catch(error => {
      console.error('Error building project:', error);
      process.exit(1);
    });
} else if (command === 'start') {
  // Import the start command dynamically
  import('../dist/start.js')
    .then(module => {
      const projectDir = args[1] || process.cwd();
      return module.startCommand(projectDir);
    })
    .catch(error => {
      console.error('Error starting production server:', error);
      process.exit(1);
    });
} else if (command === 'create') {
  const projectName = args[1];
  if (!projectName) {
    console.error('Error: Please specify a project name');
    process.exit(1);
  }
  console.log(`Creating new Apex project: ${projectName}`);
  // In a real implementation, this would create the project files
  process.exit(0);
} else {
  console.log('Apex CLI: hello');
  console.log('Usage: apex <command>');
  console.log('Commands:');
  console.log('  create <name>  Create a new Apex project');
  console.log('  dev            Start the development server');
  console.log('  build [dir]    Build the project for production');
  console.log('  start [dir]    Start the production server');
  console.log('');
  console.log('Options:');
  console.log('  --runtime <node|bun|deno>  Specify the runtime to use (default: node)');
  process.exit(0);
}