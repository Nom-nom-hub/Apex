# Observability & Instrumentation Documentation

## Overview

Apex provides built-in observability and instrumentation capabilities including structured logging, OpenTelemetry traces, and request metrics.

## Structured Logging

Apex includes a structured logger that outputs JSON-formatted log entries for easy parsing and analysis.

### Basic Usage

```typescript
import { logger } from '@apex/core';

// Log messages with different levels
logger.debug('Debug message', { userId: 123 });
logger.info('User logged in', { userId: 123, ipAddress: '192.168.1.1' });
logger.warn('Slow database query', { query: 'SELECT * FROM users', duration: 1200 });
logger.error('Failed to process payment', { 
  userId: 123, 
  orderId: 456, 
  error: 'Insufficient funds' 
});
```

### Logger Methods

#### `logger.debug(message, ...args)`

Logs a debug message.

- `message`: String message to log
- `...args`: Additional arguments to include in the log entry

#### `logger.info(message, ...args)`

Logs an informational message.

- `message`: String message to log
- `...args`: Additional arguments to include in the log entry

#### `logger.warn(message, ...args)`

Logs a warning message.

- `message`: String message to log
- `...args`: Additional arguments to include in the log entry

#### `logger.error(message, ...args)`

Logs an error message.

- `message`: String message to log
- `...args`: Additional arguments to include in the log entry

### Log Entry Format

All log entries are formatted as JSON with the following structure:

```json
{
  "timestamp": "2023-01-01T00:00:00.000Z",
  "level": "info",
  "service": "apex-app",
  "message": "User logged in",
  "userId": 123,
  "ipAddress": "192.168.1.1"
}
```

## OpenTelemetry Tracing

Apex integrates with OpenTelemetry to provide distributed tracing capabilities.

### Basic Usage

```typescript
import { tracer } from '@apex/core';

// Create a span
const span = tracer.startSpan('process-user-login');
try {
  // Process user login
  await processLogin(userId, credentials);
} catch (error) {
  span.recordException(error);
  throw error;
} finally {
  span.end();
}

// Create a span and execute a function within it
const result = await tracer.withSpan('fetch-user-data', async () => {
  return await fetchUserData(userId);
});
```

### Tracer Methods

#### `tracer.startSpan(name, options?)`

Creates a new span.

- `name`: String name for the span
- `options`: Optional configuration object
  - `attributes`: Key-value pairs to associate with the span

#### `tracer.withSpan(name, fn)`

Creates a span and executes a function within it, automatically ending the span.

- `name`: String name for the span
- `fn`: Async function to execute within the span

## Request Metrics

Apex automatically collects metrics about HTTP requests including counts and durations.

### Metrics Endpoint

Metrics are exposed at the `/metrics` endpoint in Prometheus format:

```
# HELP apex_requests_total Total number of requests
# TYPE apex_requests_total counter
apex_requests_total{method="GET",status="200"} 42

# HELP apex_request_duration_ms Request duration in milliseconds
# TYPE apex_request_duration_ms histogram
apex_request_duration_ms_bucket{le="50"} 25
apex_request_duration_ms_bucket{le="100"} 38
apex_request_duration_ms_bucket{le="200"} 42
apex_request_duration_ms_bucket{le="+Inf"} 42
apex_request_duration_ms_sum 1850
apex_request_duration_ms_count 42
```

### Custom Metrics

You can record custom metrics in your application:

```typescript
import { metrics } from '@apex/core';

// Increment a counter
metrics.increment('user_logins', 1, { method: 'oauth' });

// Record a timing
const startTime = Date.now();
await processPayment(paymentData);
const duration = Date.now() - startTime;
metrics.timing('payment_processing_duration', duration);
```

### Metrics Methods

#### `metrics.increment(counter, value?, attributes?)`

Increments a counter metric.

- `counter`: String name of the counter
- `value`: Number to increment by (default: 1)
- `attributes`: Key-value pairs to associate with the metric

#### `metrics.timing(histogram, value, attributes?)`

Records a timing metric.

- `histogram`: String name of the histogram
- `value`: Timing value in milliseconds
- `attributes`: Key-value pairs to associate with the metric

## Configuration

### Initializing Telemetry

```typescript
import { initializeTelemetry } from '@apex/core';

initializeTelemetry({
  serviceName: 'my-apex-app',
  serviceVersion: '1.0.0',
  exporterUrl: 'http://localhost:4318/v1/traces', // Optional OTLP exporter
  enabled: true // Default: true
});
```

### Environment Variables

The following environment variables can be used to configure observability:

- `APEX_TELEMETRY_ENABLED`: Enable/disable telemetry (default: true)
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OTLP exporter endpoint
- `OTEL_SERVICE_NAME`: Service name for traces
- `OTEL_SERVICE_VERSION`: Service version for traces

## Best Practices

### Logging

1. Use appropriate log levels:
   - DEBUG: Detailed diagnostic information
   - INFO: General information about application flow
   - WARN: Potentially harmful situations
   - ERROR: Error events that might still allow the application to continue running

2. Include contextual information:
```typescript
logger.info('User created account', {
  userId: newUser.id,
  email: newUser.email,
  referralSource: signupSource
});
```

### Tracing

1. Create spans for significant operations:
```typescript
const span = tracer.startSpan('database-query');
try {
  await database.query(sql);
} finally {
  span.end();
}
```

2. Add attributes to spans for better context:
```typescript
const span = tracer.startSpan('process-payment');
span.setAttribute('payment.amount', amount);
span.setAttribute('payment.currency', currency);
span.setAttribute('user.id', userId);
```

### Metrics

1. Use consistent naming conventions:
   - Use lowercase with underscores
   - Prefix with application name when appropriate
   - Use descriptive names

2. Record meaningful metrics:
```typescript
// Good
metrics.increment('user_registrations', 1, { source: 'facebook' });
metrics.timing('api_response_time', duration, { endpoint: '/users' });

// Avoid
metrics.increment('counter1');
metrics.timing('timer1', value);
```

## Troubleshooting

### Missing Logs

If logs aren't appearing:

1. Check that the logger is properly imported
2. Verify log level configuration
3. Ensure console output isn't being redirected

### Missing Traces

If traces aren't appearing in your collector:

1. Verify OpenTelemetry configuration
2. Check network connectivity to the collector
3. Ensure the correct exporter endpoint is configured

### Missing Metrics

If metrics aren't appearing at `/metrics`:

1. Verify the metrics endpoint is accessible
2. Check that the server is properly configured
3. Ensure metrics are being recorded in your application code

## Advanced Topics

### Custom Exporters

Implement custom exporters for specialized use cases:

```typescript
import { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';

class CustomSpanExporter implements SpanExporter {
  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void) {
    // Custom export logic
    spans.forEach(span => {
      // Send span to custom backend
    });
    resultCallback({ code: ExportResultCode.SUCCESS });
  }
  
  shutdown(): Promise<void> {
    // Cleanup logic
    return Promise.resolve();
  }
}
```

### Distributed Tracing

Enable distributed tracing to track requests across services:

```typescript
import { context, propagation } from '@opentelemetry/api';

// Extract context from incoming request
const parentContext = propagation.extract(context.active(), headers);

// Create span with parent context
const span = tracer.startSpan('process-request', {}, parentContext);
```

### Alerting

Set up alerts based on metrics:

1. Monitor error rates:
   - Alert when `apex_requests_total{status=~"5.."} / apex_requests_total > 0.05`

2. Monitor response times:
   - Alert when 95th percentile response time exceeds threshold

3. Monitor throughput:
   - Alert when request rate drops below baseline