import { join } from 'path';
import { DevServer } from '@apex/runtime-node';

export async function startDevServer() {
  // For now, we'll assume the current working directory is the project root
  const routesDir = join(process.cwd(), 'app', 'routes');
  
  const server = new DevServer({
    routesDir,
    port: 3000
  });
  
  try {
    await server.start();
    
    // Keep the process alive
    process.on('SIGINT', async () => {
      console.log('Shutting down dev server...');
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start dev server:', error);
    process.exit(1);
  }
}