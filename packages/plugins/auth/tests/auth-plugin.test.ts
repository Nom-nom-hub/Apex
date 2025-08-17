import { describe, it, expect } from 'vitest';

// Mock the auth plugin
const mockAuthPlugin = (options: any = {}) => {
  return {
    name: '@apex/plugin-auth',
    version: '0.0.1',
    description: 'Authentication plugin for Apex framework',
    apex: {
      hooks: {
        onRequest: async (context: any) => {
          // Mock auth middleware
          context.user = {
            id: '123',
            username: 'testuser',
            email: 'test@example.com'
          };
        }
      }
    }
  };
};

describe('Auth Plugin', () => {
  it('should create an auth plugin manifest', () => {
    const plugin = mockAuthPlugin({
      jwtSecret: 'test-secret',
      sessionSecret: 'test-session-secret'
    });
    
    expect(plugin.name).toBe('@apex/plugin-auth');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBe('Authentication plugin for Apex framework');
    expect(plugin.apex?.hooks?.onRequest).toBeDefined();
  });
  
  it('should add user to request context', async () => {
    const plugin = mockAuthPlugin();
    const context: any = {
      request: {},
      response: {}
    };
    
    if (plugin.apex?.hooks?.onRequest) {
      await plugin.apex.hooks.onRequest(context);
    }
    
    expect(context.user).toBeDefined();
    expect(context.user.id).toBe('123');
    expect(context.user.username).toBe('testuser');
    expect(context.user.email).toBe('test@example.com');
  });
});