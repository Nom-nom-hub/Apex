# Runtime Adapters Documentation

## Overview

Apex supports multiple JavaScript runtimes through dedicated adapters. Each adapter provides implementations for the core runtime functionalities: HTTP server and file watching.

## Available Adapters

### Node.js Adapter (@apex/runtime-node)
The default adapter that uses Node.js built-in modules.

### Bun Adapter (@apex/runtime-bun)
High-performance adapter that leverages Bun's native capabilities.

### Deno Adapter (@apex/runtime-deno)
Secure adapter that uses Deno's permission-based runtime model.

## Using Runtime Adapters

### Development Mode

Specify the runtime when starting the development server:

```bash
# Use Node.js runtime (default)
apex dev

# Use Bun runtime
apex dev --runtime=bun

# Use Deno runtime
apex dev --runtime=deno
```

### Production Mode

Specify the runtime when starting the production server:

```bash
# Use Node.js runtime (default)
apex start

# Use Bun runtime
apex start --runtime=bun

# Use Deno runtime
apex start --runtime=deno
```

## Adapter Interface

All runtime adapters must implement the following interface:

### Server Class
- `constructor(options: ServerOptions)`
- `start(): Promise<void>`
- `stop(): Promise<void>`

### FileWatcher Class
- `constructor(callback: () => void)`
- `watch(paths: string[]): Promise<void>`
- `close(): Promise<void>`

## Performance Characteristics

### Startup Time
- Bun: Fastest startup due to native compilation
- Deno: Fast startup with built-in caching
- Node.js: Standard startup time

### Memory Usage
- Bun: Lowest memory footprint
- Deno: Moderate memory usage with security overhead
- Node.js: Standard memory usage

### Compatibility
- Bun: Best compatibility with modern web standards
- Deno: Secure by default with explicit permissions
- Node.js: Broad ecosystem compatibility

## Choosing a Runtime

### When to use Bun
- Performance is critical
- Modern web standards are sufficient
- Rapid development iterations

### When to use Deno
- Security is a priority
- Explicit permission control is needed
- TypeScript support is important

### When to use Node.js
- Existing Node.js ecosystem dependencies
- Maximum compatibility with existing tools
- Enterprise environments with Node.js expertise

## Adapter Implementation Details

### HTTP Server
Each adapter implements an HTTP server using the runtime's native capabilities:

- Node.js: Uses `http` module
- Bun: Uses `Bun.serve`
- Deno: Uses `Deno.serve`

### File Watching
Each adapter implements file watching for hot reloading:

- Node.js: Uses `fs.watch` or `chokidar`
- Bun: Uses `Bun.watch`
- Deno: Uses `Deno.watchFs`

## Extending with Custom Adapters

To create a custom adapter:

1. Implement the adapter interface
2. Export Server and FileWatcher classes
3. Register the adapter in the CLI configuration

## Future Roadmap

- WebContainer adapter for browser-based development
- Cloudflare Workers adapter for edge computing
- Lambda adapter for serverless deployments