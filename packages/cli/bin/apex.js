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
} else if (command === 'deploy') {
  // Import the deploy command dynamically
  import('../dist/deploy.js')
    .then(module => {
      const projectDir = args[1] || process.cwd();
      const deployArgs = args.slice(2);
      
      const options = {};
      const adapterIndex = deployArgs.indexOf('--adapter');
      if (adapterIndex !== -1 && adapterIndex + 1 < deployArgs.length) {
        options.adapter = deployArgs[adapterIndex + 1];
      }
      
      return module.deployCommand(projectDir, options);
    })
    .catch(error => {
      console.error('Error deploying static site:', error);
      process.exit(1);
    });
} else if (command === 'create') {
  const projectName = args[1];
  if (!projectName) {
    console.error('Error: Please specify a project name');
    process.exit(1);
  }
  
  // Import the create command dynamically
  import('../dist/create.js')
    .then(module => {
      return module.createCommand(projectName);
    })
    .catch(error => {
      console.error('Error creating project:', error);
      process.exit(1);
    });
} else {
  console.log('Apex CLI: hello');
  console.log('Usage: apex <command>');
  console.log('Commands:');
  console.log('  create <name>  Create a new Apex project');
  console.log('  dev            Start the development server');
  console.log('  build [dir]    Build the project for production');
  console.log('  start [dir]    Start the production server');
  console.log('  deploy [dir]   Deploy the project as a static site');
  console.log('');
  console.log('Options:');
  console.log('  --runtime <node|bun|deno>  Specify the runtime to use (default: node)');
  console.log('  --adapter <static|cdn>     Specify the deployment adapter (default: static)');
  process.exit(0);
}