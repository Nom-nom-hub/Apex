# Apex Framework

A modern web framework that combines the best of server-side rendering with client-side interactivity through islands architecture.

## Overview

Apex is a full-stack web framework designed for building fast, scalable web applications. It features:

- **File-based routing**: Simple and intuitive routing system
- **Server-side data loading**: Loaders and actions for efficient data fetching
- **Islands architecture**: Selective client-side hydration for optimal performance
- **Plugin system**: Extensible architecture for adding features
- **Built-in caching**: ISR (Incremental Static Regeneration) and caching primitives
- **Observability**: Structured logging, metrics, and tracing
- **Multi-runtime support**: Works with Node.js, Bun, and Deno

## Quick Start

```bash
# Install the CLI globally
npm install -g @apex/cli

# Create a new project
apex create my-app
cd my-app

# Start the development server
apex dev

# Build for production
apex build

# Run the production server
apex start
```

## Features

### File-based Routing

Apex uses a file-based routing system where files in the `app/routes` directory automatically become routes:

```
app/
├── routes/
│   ├── index.page.tsx          # /
│   ├── about.page.tsx          # /about
│   ├── blog/
│   │   ├── index.page.tsx      # /blog
│   │   └── $slug.page.tsx     # /blog/:slug
│   └── products/
│       ├── index.page.tsx      # /products
│       └── $id.page.tsx       # /products/:id
```

### Loaders and Actions

Loaders run on the server to fetch data before rendering:

```typescript
// app/routes/blog/$slug.loader.ts
export async function loader({ params }) {
  const post = await fetchPost(params.slug);
  return { post };
}
```

Actions handle form submissions and mutations:

```typescript
// app/routes/blog/$slug.action.ts
export async function action({ request }) {
  const formData = await request.formData();
  await createComment(formData);
  return redirect(`/blog/${formData.get('slug')}`);
}
```

### Islands Architecture

Islands allow you to add client-side interactivity to specific parts of your page:

```tsx
// app/components/Counter.island.tsx
import React, { useState } from 'react';

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### Caching and ISR

Apex provides built-in caching and ISR capabilities:

```typescript
// app/routes/blog/$slug.loader.ts
export const prerender = {
  cache: {
    maxAge: 60 // Cache for 60 seconds
  }
};

export async function loader({ params }) {
  const post = await fetchPost(params.slug);
  return { post };
}
```

### Plugins

Extend Apex with plugins:

```typescript
// apex.config.ts
import authPlugin from '@apex/plugin-auth';

export default {
  plugins: [
    authPlugin({
      jwtSecret: process.env.JWT_SECRET
    })
  ]
};
```

## Examples

Check out our example applications:

- [Blog](examples/blog) - A simple blog application
- [E-commerce Starter](examples/ecommerce-starter) - An e-commerce starter template
- [SaaS Starter](examples/saas-starter) - A SaaS dashboard application

## Documentation

See our [documentation](examples/docs) for detailed guides and API references.

## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for more details.

## License

MIT © Apex Team