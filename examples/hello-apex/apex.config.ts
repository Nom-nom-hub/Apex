import { defineConfig } from '@apex/core';
import authPlugin from '@apex/plugin-auth';

export default defineConfig({
  plugins: [
    authPlugin({
      jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
      sessionSecret: process.env.SESSION_SECRET || 'super-secret-session-key',
      cookieName: 'auth-token',
      jwtIssuer: 'apex-example-app',
      jwtAudience: 'apex-users'
    })
  ]
});