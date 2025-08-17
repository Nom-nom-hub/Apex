# Plugin API Documentation

## Overview

Apex plugins allow you to extend the framework with additional functionality. Plugins can hook into various lifecycle events and modify the behavior of your application.

## Plugin Manifest Format

Plugins are defined using a manifest format that specifies metadata and hooks:

```typescript
interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  main?: string;
  module?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  apex?: {
    hooks?: PluginHooks;
    config?: Record<string, any>;
  };
}
```

## Plugin Hooks

Plugins can define hooks that are called at various points in the application lifecycle:

### onDev
Called when the development server starts.

### onBuild
Called when the application is built for production.

### transform
Called to transform code during the build process.

### onRequest
Called for each incoming request.

## Creating a Plugin

To create a plugin, export a function that returns a PluginManifest:

```typescript
import { PluginManifest } from '@apex/core';

const myPlugin = (options: any): PluginManifest => {
  return {
    name: 'my-plugin',
    version: '1.0.0',
    description: 'An example plugin',
    apex: {
      hooks: {
        onDev: async (context) => {
          console.log('My plugin initialized in dev mode');
        },
        onBuild: async (context) => {
          console.log('My plugin running in build mode');
        }
      }
    }
  };
};

export default myPlugin;
```

## Using Plugins

To use a plugin, add it to your `apex.config.ts` file:

```typescript
import { defineConfig } from '@apex/core';
import myPlugin from './my-plugin';

export default defineConfig({
  plugins: [
    myPlugin({
      // Plugin-specific options
    })
  ]
});
```

## Built-in Plugins

### Auth Plugin

The auth plugin provides authentication functionality including JWT tokens and session management.

```typescript
import { defineConfig } from '@apex/core';
import authPlugin from '@apex/plugin-auth';

export default defineConfig({
  plugins: [
    authPlugin({
      jwtSecret: 'your-jwt-secret',
      sessionSecret: 'your-session-secret',
      cookieName: 'auth-token',
      jwtIssuer: 'your-app-name',
      jwtAudience: 'your-users'
    })
  ]
});
```

Once the auth plugin is enabled, you can access the authenticated user in your routes:

```typescript
export async function loader({ request, params, context }: LoaderArgs) {
  // Access the authenticated user
  const user = request.user;
  
  if (!user) {
    // Redirect to login page
    return redirect('/login');
  }
  
  // Return user-specific data
  return json({ user });
}
```