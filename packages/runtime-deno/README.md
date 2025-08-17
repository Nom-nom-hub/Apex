# @apex/runtime-deno

Deno runtime adapter for the Apex framework.

## Overview

This package provides a Deno-specific runtime adapter for the Apex framework. It includes implementations for the HTTP server and file watching capabilities using Deno's native APIs.

## Features

- Secure HTTP server using Deno's built-in HTTP server
- Efficient file watching with Deno's native file watching capabilities
- Seamless integration with Apex core functionality
- Optimized for Deno's secure JavaScript runtime

## Installation

```bash
npm install @apex/runtime-deno
```

## Usage

The Deno runtime adapter is automatically used when running:

```bash
apex dev --runtime=deno
```

or

```bash
apex start --runtime=deno
```

## API

### DenoServer

Implements the HTTP server using Deno's native HTTP server capabilities.

### DenoFileWatcher

Implements file watching using Deno's native file watching capabilities.

## Requirements

- Deno v1.30 or higher
- Node.js is not required when using this adapter

## Permissions

The Deno runtime adapter requires the following permissions:

- `--allow-net` for HTTP server
- `--allow-read` for file system access
- `--allow-env` for environment variables

## Performance

The Deno runtime adapter takes advantage of Deno's optimizations:

- Fast startup times
- Low memory footprint
- Built-in TypeScript support
- Secure by default with explicit permissions

## Security

Deno's security model provides:

- Explicit permission requests
- Sandboxed execution by default
- No access to system resources without permission

## Limitations

- Only compatible with Deno runtime
- Some Node.js-specific APIs may not be available
- Requires explicit permission flags

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT