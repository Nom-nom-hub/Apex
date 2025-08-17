# @apex/plugin-auth

Authentication plugin for the Apex framework.

## Installation

```bash
npm install @apex/plugin-auth
```

## Usage

Add the auth plugin to your `apex.config.ts` file:

```typescript
import { defineConfig } from '@apex/core';
import authPlugin from '@apex/plugin-auth';

export default defineConfig({
  plugins: [
    authPlugin({
      jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
      sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
      cookieName: 'auth-token',
      jwtIssuer: 'your-app-name',
      jwtAudience: 'your-users'
    })
  ]
});
```

## Features

- JWT token authentication
- Session management
- Cookie-based authentication
- Role-based access control
- Easy integration with loaders and actions

## API

### Creating Tokens

```typescript
import { createJwtToken } from '@apex/plugin-auth';

const token = createJwtToken(
  {
    userId: '123',
    username: 'john_doe',
    email: 'john@example.com',
    roles: ['user']
  },
  process.env.JWT_SECRET
);
```

### Verifying Tokens

```typescript
import { verifyJwtToken } from '@apex/plugin-auth';

try {
  const payload = verifyJwtToken(token, process.env.JWT_SECRET);
  console.log('User authenticated:', payload);
} catch (error) {
  console.log('Invalid token');
}
```

### Protecting Routes

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

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `jwtSecret` | Secret key for signing JWT tokens | Required |
| `sessionSecret` | Secret key for encrypting sessions | Required |
| `cookieName` | Name of the authentication cookie | `'auth-token'` |
| `jwtIssuer` | Issuer claim for JWT tokens | `undefined` |
| `jwtAudience` | Audience claim for JWT tokens | `undefined` |
| `sessionMaxAge` | Maximum age of sessions in milliseconds | `86400000` (24 hours) |

## License

MIT