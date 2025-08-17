// Observability and instrumentation for Apex framework
import * as api from '@opentelemetry/api';

// Logger levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Structured logger interface
export interface StructuredLoggerInterface {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// Structured logger implementation
export class StructuredLogger implements StructuredLoggerInterface {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, args);
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, args);
  }

  private log(level: LogLevel, message: string, args: any[]): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...this.flattenArgs(args)
    };

    // In a real implementation, this would send logs to a logging backend
    console.log(JSON.stringify(logEntry));
  }

  private flattenArgs(args: any[]): Record<string, any> {
    if (args.length === 0) {
      return {};
    }

    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      return args[0];
    }

    const flattened: Record<string, any> = {};
    args.forEach((arg, index) => {
      if (typeof arg === 'object' && arg !== null) {
        Object.assign(flattened, arg);
      } else {
        flattened[`arg${index}`] = arg;
      }
    });

    return flattened;
  }
}

// Metrics collector implementation
export class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  increment(counter: string, value: number = 1, attributes: Record<string, string> = {}): void {
    const key = this.getKey(counter, attributes);
    const currentValue = this.counters.get(key) || 0;
    this.counters.set(key, currentValue + value);
  }

  timing(histogram: string, value: number, attributes: Record<string, string> = {}): void {
    const key = this.getKey(histogram, attributes);
    const currentValues = this.histograms.get(key) || [];
    currentValues.push(value);
    this.histograms.set(key, currentValues);
  }

  getMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};

    // Add counters
    for (const [key, value] of this.counters.entries()) {
      metrics[key] = {
        type: 'counter',
        value
      };
    }

    // Add histograms
    for (const [key, values] of this.histograms.entries()) {
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        metrics[key] = {
          type: 'histogram',
          count: values.length,
          sum,
          avg,
          min,
          max
        };
      }
    }

    return metrics;
  }

  reset(): void {
    this.counters.clear();
    this.histograms.clear();
  }

  private getKey(name: string, attributes: Record<string, string>): string {
    const attributeString = Object.entries(attributes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    
    return attributeString ? `${name}{${attributeString}}` : name;
  }
}

// Telemetry configuration
export interface TelemetryConfig {
  serviceName: string;
  serviceVersion?: string;
  enabled?: boolean;
}

// Global telemetry instance
let globalLogger: StructuredLoggerInterface | null = null;
let globalTracer: api.Tracer | null = null;
let globalMetrics: MetricsCollector | null = null;

// Initialize telemetry
export function initializeTelemetry(config: TelemetryConfig): void {
  if (config.enabled === false) {
    return;
  }

  // Initialize logger
  globalLogger = new StructuredLogger(config.serviceName);

  // Initialize tracer (simple implementation without full OpenTelemetry SDK)
  globalTracer = api.trace.getTracer(config.serviceName, config.serviceVersion);

  // Initialize metrics collector
  globalMetrics = new MetricsCollector();
}

// Get logger instance
export function getLogger(): StructuredLoggerInterface {
  if (!globalLogger) {
    globalLogger = new StructuredLogger('apex');
  }
  return globalLogger;
}

// Get tracer instance
export function getTracer(): api.Tracer {
  if (!globalTracer) {
    // Initialize a basic tracer if telemetry wasn't initialized
    globalTracer = api.trace.getTracer('apex');
  }
  return globalTracer;
}

// Get metrics collector
export function getMetrics(): MetricsCollector {
  if (!globalMetrics) {
    globalMetrics = new MetricsCollector();
  }
  return globalMetrics;
}

// Create a span and execute a function within it
export async function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const tracer = getTracer();
  const span = tracer.startSpan(name);
  
  try {
    return await api.context.with(api.trace.setSpan(api.context.active(), span), fn);
  } catch (error) {
    span.recordException(error as Error);
    throw error;
  } finally {
    span.end();
  }
}

// Record a metric
export function recordMetric(name: string, value: number, attributes: Record<string, string> = {}): void {
  const metrics = getMetrics();
  if (name.endsWith('_duration')) {
    metrics.timing(name, value, attributes);
  } else {
    metrics.increment(name, value, attributes);
  }
}

// Export observability primitives
export const logger = {
  debug: (message: string, ...args: any[]) => getLogger().debug(message, ...args),
  info: (message: string, ...args: any[]) => getLogger().info(message, ...args),
  warn: (message: string, ...args: any[]) => getLogger().warn(message, ...args),
  error: (message: string, ...args: any[]) => getLogger().error(message, ...args)
};

export const tracer = {
  startSpan: (name: string, options?: api.SpanOptions) => getTracer().startSpan(name, options),
  withSpan
};

export const metrics = {
  increment: (counter: string, value?: number, attributes?: Record<string, string>) => 
    getMetrics().increment(counter, value, attributes),
  timing: (histogram: string, value: number, attributes?: Record<string, string>) => 
    getMetrics().timing(histogram, value, attributes),
  getMetrics: () => getMetrics().getMetrics(),
  reset: () => getMetrics().reset()
};