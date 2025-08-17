import { describe, it, expect, beforeEach } from 'vitest';
import { StructuredLogger, MetricsCollector, initializeTelemetry, logger, metrics, tracer, withSpan } from '../src/observability';

describe('Observability', () => {
  beforeEach(() => {
    // Reset metrics before each test
    metrics.reset();
  });

  describe('StructuredLogger', () => {
    it('should create a logger instance', () => {
      const loggerInstance = new StructuredLogger('test-service');
      expect(loggerInstance).toBeInstanceOf(StructuredLogger);
    });

    it('should log messages with different levels', () => {
      const loggerInstance = new StructuredLogger('test-service');
      
      // Capture console.log output
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => {
        logs.push(...args);
      };

      try {
        loggerInstance.debug('Debug message');
        loggerInstance.info('Info message');
        loggerInstance.warn('Warn message');
        loggerInstance.error('Error message');
        
        expect(logs).toHaveLength(4);
        
        // Check that each log entry is valid JSON
        for (const log of logs) {
          expect(() => JSON.parse(log)).not.toThrow();
        }
      } finally {
        // Restore console.log
        console.log = originalLog;
      }
    });
  });

  describe('MetricsCollector', () => {
    it('should create a metrics collector instance', () => {
      const metricsCollector = new MetricsCollector();
      expect(metricsCollector).toBeInstanceOf(MetricsCollector);
    });

    it('should increment counters', () => {
      metrics.increment('test_counter');
      metrics.increment('test_counter', 5);
      
      const metricsData = metrics.getMetrics();
      expect(metricsData['test_counter']).toBeDefined();
      expect(metricsData['test_counter'].value).toBe(6);
    });

    it('should record timing metrics', () => {
      metrics.timing('test_duration', 100);
      metrics.timing('test_duration', 200);
      metrics.timing('test_duration', 300);
      
      const metricsData = metrics.getMetrics();
      expect(metricsData['test_duration']).toBeDefined();
      expect(metricsData['test_duration'].type).toBe('histogram');
      expect(metricsData['test_duration'].count).toBe(3);
      expect(metricsData['test_duration'].avg).toBe(200);
      expect(metricsData['test_duration'].min).toBe(100);
      expect(metricsData['test_duration'].max).toBe(300);
    });

    it('should reset metrics', () => {
      metrics.increment('test_counter');
      metrics.timing('test_duration', 100);
      
      let metricsData = metrics.getMetrics();
      expect(Object.keys(metricsData)).toHaveLength(2);
      
      metrics.reset();
      
      metricsData = metrics.getMetrics();
      expect(Object.keys(metricsData)).toHaveLength(0);
    });
  });

  describe('Tracing', () => {
    it('should create spans', async () => {
      // This is a simple test for the withSpan function
      // In a real implementation, this would test actual tracing
      let spanExecuted = false;
      
      await withSpan('test-span', async () => {
        spanExecuted = true;
        return 'result';
      });
      
      expect(spanExecuted).toBe(true);
    });
  });

  describe('Initialization', () => {
    it('should initialize telemetry', () => {
      expect(() => {
        initializeTelemetry({
          serviceName: 'test-service',
          serviceVersion: '1.0.0'
        });
      }).not.toThrow();
    });
  });
});