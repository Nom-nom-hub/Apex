import { PluginManifest } from '@apex/core';
import { AuthPluginOptions } from './types';
import { createAuthMiddleware } from './middleware';

const authPlugin = (options: AuthPluginOptions = {}): PluginManifest => {
  return {
    name: '@apex/plugin-auth',
    version: '0.0.1',
    description: 'Authentication plugin for Apex framework',
    apex: {
      hooks: {
        onRequest: async (context: any) => {
          // Add auth middleware to the request context
          const authMiddleware = createAuthMiddleware(options);
          await authMiddleware(context);
        }
      }
    }
  };
};

export default authPlugin;
export * from './types';
export * from './middleware';