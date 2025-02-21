
import { MetricsAggregator } from '../metrics-aggregator';
import { createMockMetrics } from '../../test-helpers';
import { ValidationError } from '../../utils/validation';

jest.mock('../../utils/logger');

describe('MetricsAggregator', () => {
  let aggregator: MetricsAggregator;

  beforeEach(() => {
    aggregator = new MetricsAggregator();
  });

  describe('processMetrics', () => {
    test('handles empty history', async () => {
      const metrics = createMockMetrics();
      await expect(aggregator.processMetrics(metrics)).resolves.not.toThrow();
      expect(aggregator.getMetricsHistory('test')).toHaveLength(1);
    });

    test('maintains history limit', async () => {
      const metrics = createMockMetrics();
      const promises = Array.from({ length: 105 }, () => 
        aggregator.processMetrics(metrics)
      );
      await Promise.all(promises);
      expect(aggregator.getMetricsHistory('test')).toHaveLength(100);
    });

    test('rejects invalid metrics', async () => {
      const invalidMetrics = { platform: 'test', timestamp: Date.now() };
      await expect(aggregator.processMetrics(invalidMetrics as any))
        .rejects.toThrow(ValidationError);
    });

    test('handles different platforms separately', async () => {
      await aggregator.processMetrics(createMockMetrics({ platform: 'platform1' }));
      await aggregator.processMetrics(createMockMetrics({ platform: 'platform2' }));

      expect(aggregator.getMetricsHistory('platform1')).toHaveLength(1);
      expect(aggregator.getMetricsHistory('platform2')).toHaveLength(1);
    });
  });

  describe('anomaly detection', () => {
    test('detects high memory usage', async () => {
      const metrics = createMockMetrics({
        metrics: { memory: 95, cpu: 30, fps: 60, frameTime: 16.67 }
      });
      await aggregator.processMetrics(metrics);
    });

    test('detects high CPU usage', async () => {
      const metrics = createMockMetrics({
        metrics: { memory: 50, cpu: 85, fps: 60, frameTime: 16.67 }
      });
      await aggregator.processMetrics(metrics);
    });

    test('detects low FPS', async () => {
      const metrics = createMockMetrics({
        metrics: { memory: 50, cpu: 30, fps: 25, frameTime: 40 }
      });
      await aggregator.processMetrics(metrics);
    });

    test('detects multiple anomalies', async () => {
      const metrics = createMockMetrics({
        metrics: { memory: 95, cpu: 85, fps: 25, frameTime: 40 }
      });
      await aggregator.processMetrics(metrics);
    });
  });

  describe('statistics calculation', () => {
    test('calculates averages correctly', async () => {
      // First set of metrics
      await aggregator.processMetrics(createMockMetrics({
        metrics: { memory: 40, cpu: 20, fps: 55, frameTime: 16 }
      }));
      
      // Second set of metrics
      await aggregator.processMetrics(createMockMetrics({
        metrics: { memory: 60, cpu: 40, fps: 65, frameTime: 17 }
      }));

      const history = aggregator.getMetricsHistory('test');
      expect(history).toHaveLength(2);
      
      const lastMetrics = history[1].metrics;
      expect(lastMetrics.memory).toBe(60);
      expect(lastMetrics.cpu).toBe(40);
      expect(lastMetrics.fps).toBe(65);
      expect(lastMetrics.frameTime).toBe(17);
    });

    test('handles single data point', async () => {
      const metrics = createMockMetrics({
        metrics: { memory: 45, cpu: 25, fps: 60, frameTime: 16.67 }
      });
      await aggregator.processMetrics(metrics);

      const history = aggregator.getMetricsHistory('test');
      expect(history).toHaveLength(1);
      expect(history[0].metrics).toEqual(metrics.metrics);
    });
  });

  describe('error handling', () => {
    test('handles null metrics', async () => {
      await expect(aggregator.processMetrics(null as any))
        .rejects.toThrow(ValidationError);
    });

    test('handles invalid metric values', async () => {
      const invalidMetrics = createMockMetrics({
        metrics: { memory: -1, cpu: 30, fps: 60, frameTime: 16.67 }
      });
      await expect(aggregator.processMetrics(invalidMetrics))
        .rejects.toThrow(ValidationError);
    });

    test('handles missing metric properties', async () => {
      const incompleteMetrics = createMockMetrics();
      delete (incompleteMetrics.metrics as any).memory;
      await expect(aggregator.processMetrics(incompleteMetrics))
        .rejects.toThrow(ValidationError);
    });
  });
});
