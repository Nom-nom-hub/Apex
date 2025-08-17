#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

if (command === 'dev') {
  console.log('Apex dev: running');
  process.exit(0);
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
  process.exit(0);
}