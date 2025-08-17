// Simple plugin example for testing
export default {
  name: 'test-plugin',
  version: '1.0.0',
  description: 'A simple test plugin',
  apex: {
    hooks: {
      onDev: async (context: any) => {
        console.log('Test plugin onDev hook called');
      },
      onBuild: async (context: any) => {
        console.log('Test plugin onBuild hook called');
      }
    }
  }
};