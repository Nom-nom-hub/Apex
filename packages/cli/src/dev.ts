import { join } from 'path';

// Parse command line arguments for --runtime flag
function parseRuntimeArg(): string {
  const args = process.argv.slice(2);
  const runtimeIndex = args.indexOf('--runtime');
  
  if (runtimeIndex !== -1 && runtimeIndex + 1 < args.length) {
    return args[runtimeIndex + 1];
  }
  
  // Default to node runtime
  return 'node';
}

export async function startDevServer() {
  const runtime = parseRuntimeArg();
  
  // For now, we'll assume the current working directory is the project root
  const routesDir = join(process.cwd(), 'app', 'routes');
  
  console.log(`Starting development server with ${runtime} runtime...`);
  console.log(`Routes directory: ${routesDir}`);
  console.log(`Development server running on http://localhost:3000`);
  
  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('Shutting down dev server...');
    process.exit(0);
  });
  
  // Simulate server running
  setInterval(() => {
    // Keep alive
  }, 1000);
}