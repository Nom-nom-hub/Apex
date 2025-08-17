# @apex/runtime-bun

Bun runtime adapter for the Apex framework.

## Overview

This package provides a Bun-specific runtime adapter for the Apex framework. It includes implementations for the HTTP server and file watching capabilities using Bun's native APIs.

## Features

- High-performance HTTP server using `Bun.serve`
- Efficient file watching with `Bun.watch`
- Seamless integration with Apex core functionality
- Optimized for Bun's JavaScript runtime

## Installation

```bash
npm install @apex/runtime-bun
```

## Usage

The Bun runtime adapter is automatically used when running:

```bash
apex dev --runtime=bun
```

or

```bash
apex start --runtime=bun
```

## API

### BunServer

Implements the HTTP server using Bun's native server capabilities.

### BunFileWatcher

Implements file watching using Bun's native file watching capabilities.

## Requirements

- Bun v1.0 or higher
- Node.js is not required when using this adapter

## Performance

The Bun runtime adapter takes advantage of Bun's optimizations:

- Faster startup times compared to Node.js
- Lower memory footprint
- Native support for TypeScript and JSX
- Built-in bundler for optimized builds

## Limitations

- Only compatible with Bun runtime
- Some Node.js-specific APIs may not be available
- Limited ecosystem compared to Node.js

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT