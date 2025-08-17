Apex — Step-Chained, Cursor-Optimized Master Prompt

Use this exact, step-chained master prompt with your AI agent (Cursor, Winsurf, etc.). Each Step N is a discrete task the agent must complete, produce concrete artifacts for, run tests for, and commit with a prescribed commit message. After finishing Step N produce a short verification report and then immediately begin Step N+1. Do not proceed if any automated tests or acceptance criteria fail; instead produce a clear error report and remediation actions, fix, re-run tests, and only then continue.

Important: always produce code, documentation, tests, and example apps for each deliverable. For every code artifact include one working example and automated tests that validate core behavior.

Global rules for the agent

Work in a monorepo (pnpm/yarn workspaces recommended). Top-level packages: packages/core, packages/cli, packages/runtime-node, packages/runtime-bun, packages/runtime-deno, packages/renderer-react, examples/hello-apex.

Use TypeScript everywhere (no any unless justified with inline comment and a TODO).

Use small single-purpose commits. Each step must end with a commit using the specified commit message.

Include README.md and docs/ for each package with usage and API surface.

Provide unit tests (vitest/jest) and basic e2e (playwright) per step where applicable. Tests must pass before moving on.

Produce apex.config.ts spec file and RFCs/ folder for public API decisions.

Make all CLI interactions reproducible via documented commands.

Provide metrics: bundle size (esbuild), cold start time (measured locally in ms), and simple benchmark scripts. Output these in /benchmarks.

For every plugin or adapter provide a template and at least one example usage.

Produce a CHANGELOG.md and LICENSE (MIT) at repo root.

Step 1 — Monorepo scaffold + minimal core & CLI

Goal: Create the monorepo + working apex CLI bootstrap that prints Apex CLI: hello and scaffolds an example app.

Tasks

Initialize monorepo (pnpm workspace or yarn). Create packages/core, packages/cli, examples/hello-apex.

packages/cli exports binary apex (node) that supports apex create <name> and apex dev (dev prints hello).

packages/core contains TypeScript package with empty exports and a small pkg.json API surface.

examples/hello-apex created by apex create hello-apex and contains app/routes/index.page.tsx rendering "Hello Apex".

Add root package.json scripts: dev, build, test.

Deliverables

Repo with working apex binary (local node ./packages/cli/bin/apex.js works).

examples/hello-apex created and runnable.

Unit tests for CLI (--help, create behavior).

README for CLI usage.

Acceptance criteria

pnpm install completes without errors.

node packages/cli/bin/apex.js dev prints Apex dev: running and returns exit code 0.

Tests pass (pnpm test).

Commit message: chore: scaffold monorepo + apex cli bootstrap

Step 2 — File-based router & dev server minimal

Goal: Implement file-based router mapping app/routes/*.page.tsx to paths and a dev HTTP server that renders server HTML from a route.

Tasks

In packages/core implement file scanner that maps app/routes/**.page.tsx → route path (support nested directories and dynamic [param] syntax).

Implement packages/runtime-node dev server adapter using native http that uses the router to serve HTML for matched .page.tsx.

packages/renderer-react contains a minimal server renderer that inputs a React component and returns HTML string.

apex dev runs the runtime-node dev server, serving examples/hello-apex and returns HTML for /.

Deliverables

Router unit tests for static, nested, and dynamic paths.

Dev server integration test hitting / and returning HTML with expected body text.

Example index.page.tsx that uses default exported React component.

apex dev command launches server and serves the example app.

Acceptance criteria

apex dev serves examples/hello-apex and fetching http://localhost:3000/ returns HTML containing Hello Apex.

Router test suite passes.

Commit message: feat(core): file router + runtime-node dev server + react renderer

Step 3 — Loaders & actions primitives (typed)

Goal: Add typed server-side loader and action primitives, wire them into request lifecycle, and expose loader data to page renderer.

Tasks

Define loader/action TypeScript types and runtime contracts in packages/core.

Support index.loader.ts and index.action.ts files alongside index.page.tsx.

On GET, call loader and pass returned JSON into page as props. On POST, call action and handle redirects/json responses.

Implement simple json() and redirect() helpers.

Deliverables

Example route dashboard.loader.ts returning { user, items } used in dashboard.page.tsx.

Action example: new-item.action.ts that creates item and returns redirect('/dashboard').

Type generation: produce types/routes.d.ts with typed signatures for loader results for the example app.

Tests verifying loader data is available to rendered HTML and action redirects work.

Acceptance criteria

GET /dashboard includes loader-supplied content in HTML.

POST to action endpoint triggers redirect per redirect() helper.

Type generation runs as part of build and produces types/routes.d.ts.

Commit message: feat(core): typed loaders & actions + loader/action runtime wiring

Step 4 — Island hydration & minimal client islands

Goal: Implement client islands: allow small client components to hydrate independently.

Tasks

Create an Island primitive in packages/renderer-react which server-renders a marker and client runtime that hydrates only that component.

Implement dev client runtime bundle (esbuild) served by dev server.

Example: Counter.island.tsx server rendered but hydrates on client to support clicks.

Deliverables

Counter island example in examples/hello-apex.

E2E test: load page, ensure server markup present, then simulate client JS hydration to increment counter (Playwright or JSDOM + jsdom-global).

Documentation: how to write an island component, tradeoffs, and when to use.

Acceptance criteria

Islands hydrate correctly in browser emulation and interactive behavior works.

Bundle sizes recorded for island runtime and printed in benchmarks.

Commit message: feat(renderer): island hydration + client runtime bundle

Step 5 — Plugin system skeleton + auth plugin

Goal: Design plugin API and implement an auth plugin skeleton (JWT + session adapter).

Tasks

Define plugin manifest format apex.plugin.ts and lifecycle hooks in packages/core.

Implement plugin loader in packages/cli and packages/core that runs onDev, onBuild, transform hooks.

Create packages/plugins/auth implementing cookie session and JWT provider with example usage in examples/hello-apex.

Provide tests to assert plugin loads and auth middleware injects request.user.

Deliverables

Plugin API docs in packages/core/docs.

Auth plugin with README and example integration.

Tests for plugin lifecycle hooks and auth behavior.

Acceptance criteria

Auth plugin can be enabled in apex.config.ts and request has user on routes that require auth.

Plugin lifecycle hooks run and are logged.

Commit message: feat(plugin): plugin system + auth plugin skeleton

Step 6 — Build pipeline (esbuild), production server, and apex build

Goal: Implement production build using esbuild output, a start server to run built output, and apex build command.

Tasks

Create packages/cli apex build to run esbuild for server and client bundles, emit to /dist.

packages/core must be runnable from /dist via node dist/server.js.

Add production server configuration and a sample Dockerfile.

Run minification, code-splitting for island bundles.

Deliverables

apex build output in examples/hello-apex/dist.

apex start that runs built server and serves static assets.

Dockerfile and guide on running container locally.

Tests ensuring built server returns identical HTML as dev server.

Acceptance criteria

apex build completes without errors.

node examples/hello-apex/dist/server.js returns same HTML for /.

Commit message: chore(build): esbuild production pipeline + apex build/start

Step 7 — Runtime adapters: Bun & Deno basic adapters

Goal: Implement thin adapters for Bun and Deno that match the runtime adapter contract.

Tasks

Create packages/runtime-bun and packages/runtime-deno with adapter shims (http server, file watcher).

Add runtime detection and a --runtime flag to apex dev and apex start.

Deliverables

Documentation showing how to run apex dev --runtime=bun and --runtime=deno.

Smoke tests ensuring server boots under Bun runtime (if environment supports) or simulated runner in CI.

Adapter examples and README.

Acceptance criteria

Adapter code compiles and adapter interface tests pass.

apex dev --runtime=node remains default and unaffected.

Commit message: feat(runtime): add bun & deno runtime adapters (adapter contract)

Step 8 — Caching primitives, ISR, and simple CDN adapter

Goal: Provide cache() and revalidate() primitives and an ISR implementation for static pages, plus a simple CDN/static hosting adapter.

Tasks

Implement cache API in packages/core available to loaders: cache.set(key, value, ttl) and cache.revalidate(path).

Support export const prerender = { cache: { maxAge: 60 } } in route metadata.

Implement simple apex deploy --adapter=static to export static HTML files (with revalidation metadata).

Deliverables

Examples demonstrating ISR behavior and post-build static export.

Tests validating cache hits/misses and revalidate behavior.

Commit message: feat(cache): cache primitives + ISR + static export adapter

Step 9 — Observability & instrumentation (OpenTelemetry)

Goal: Add structured logging, OpenTelemetry traces (basic), and request metrics.

Tasks

Add structured logger API (logger.info/debug/error) and integrate into request lifecycle.

Add OpenTelemetry tracing hooks in packages/core with simple Node exporter support.

Add metrics collector that reports request latency and counts (exposed via /metrics).

Deliverables

Docs for enabling telemetry and configuration.

Tests verifying metrics endpoint and basic trace creation.

Commit message: feat(obs): structured logging + openTelemetry hooks + metrics endpoint

Step 10 — Example apps + docs + tests + release prep

Goal: Produce three complete example apps, full docs site, benchmark results, and prepare for a v0.1 release.

Tasks

Create examples: blog, ecommerce-starter, saas-starter in /examples.

Complete docs/ site in examples/docs with guides: Getting Started, Loaders & Actions, Islands, Plugins, Deployments.

Add CI config (GitHub Actions) running tests, lint, and build.

Create benchmarks/ with scripts and run results included.

Tag release v0.1.0 and produce changelog.

Deliverables

Three examples with README and tests.

Docs site with navigation and search.

Benchmarks and performance notes.

CI pipeline config.

Commit message: chore(release): prepare v0.1.0 — examples, docs, CI, benchmarks

Failure handling & remediation

If any test or acceptance criteria fails at any step:

Halt progression.

Produce a failure report (/reports/step-N-failure.md) describing failing tests, stack traces, logs, and one prioritized remediation plan.

Implement the fix, run tests again, and only continue when tests pass.

Always include why and how in the remediation notes.

Output format for each step (strict)

At the end of each step the agent must output a JSON summary to stdout (and commit it to /reports/step-N-summary.json) with the following structure: