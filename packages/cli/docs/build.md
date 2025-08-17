# Build Pipeline Documentation

## Overview

The Apex build pipeline uses esbuild to create optimized production bundles for both server and client code.

## Commands

### `apex build`

Builds the project for production:

```bash
apex build [directory]
```

This command:
1. Bundles server code using esbuild with Node.js target
2. Bundles client code (islands) using esbuild with browser target
3. Minifies both bundles
4. Generates source maps
5. Creates a production server entry point

### `apex start`

Starts the production server:

```bash
apex start [directory]
```

This command runs the built server bundle using Node.js.

## Output Structure

The build process creates the following structure in the `dist` directory:

```
dist/
├── server/          # Server-side bundles
├── client/          # Client-side bundles (islands)
└── server.js       # Production server entry point
```

## Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t apex-app .

# Run the container
docker run -p 3000:3000 apex-app
```

## Environment Variables

The production server respects the following environment variables:

- `PORT` - Port to run the server on (default: 3000)
- `NODE_ENV` - Node.js environment (automatically set to 'production')

## Customization

To customize the build process, you can modify the build configuration in `packages/cli/src/build.ts`.

## Performance

The build pipeline uses esbuild for fast compilation times:
- Server bundles: ~100ms for small projects
- Client bundles: ~50ms for small projects
- Total build time: Under 1 second for typical projects

## Troubleshooting

If builds fail:
1. Check that all dependencies are installed: `pnpm install`
2. Verify entry points exist in `app/routes/`
3. Check for TypeScript errors: `tsc --noEmit`
4. Clear build cache: `rm -rf dist/`