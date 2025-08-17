import { PluginLoader } from '@apex/core';

// Simple test to verify plugin loader works
async function testPluginSystem() {
  const pluginLoader = new PluginLoader();
  
  // This would normally load actual plugins
  console.log('Plugin system initialized');
  
  // Run a simple hook
  await pluginLoader.runOnDevHooks({});
  
  console.log('Plugin system test completed');
}

testPluginSystem().catch(console.error);