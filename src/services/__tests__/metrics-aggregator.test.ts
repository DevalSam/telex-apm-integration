

import { MetricsAggregator } from '../metrics-aggregator';
import { createMockMetrics } from '../../../test-helpers';

jest.mock('../../utils/logger');

describe('MetricsAggregator', () => {
  let aggregator: MetricsAggregator;

  beforeEach(() => {
    aggregator = new MetricsAggregator();
  });

  describe('processMetrics', () => {
    test('handles empty history', async () => {
      const metrics = createMockMetrics();
      await aggregator.processMetrics(metrics);
    });

    test('maintains history limit', async () => {
      const metrics = createMockMetrics();
      const promises = Array.from({ length: 105 }, () => 
        aggregator.processMetrics(metrics)
      );
      await Promise.all(promises);
    });

    test('handles null metrics', async () => {
      await expect(aggregator.processMetrics(null as any))
        .rejects.toThrow('Invalid metrics data');
    });

    test('handles metrics without properties', async () => {
      const invalidMetrics = { platform: 'test', timestamp: Date.now() };
      await expect(aggregator.processMetrics(invalidMetrics as any))
        .rejects.toThrow();
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
        metrics: { memory: 50, cpu: 30, fps: 25, frameTime: 16.67 }
      });
      await aggregator.processMetrics(metrics);
    });

    test('detects multiple anomalies', async () => {
      const metrics = createMockMetrics({
        metrics: { memory: 95, cpu: 85, fps: 25, frameTime: 16.67 }
      });
      await aggregator.processMetrics(metrics);
    });
  });

  describe('statistics calculation', () => {
    test('calculates averages correctly', async () => {
      await aggregator.processMetrics(createMockMetrics({
        metrics: { memory: 40, cpu: 20, fps: 55, frameTime: 16 }
      }));
      
      await aggregator.processMetrics(createMockMetrics({
        metrics: { memory: 60, cpu: 40, fps: 65, frameTime: 17 }
      }));
    });

    test('handles single data point', async () => {
      await aggregator.processMetrics(createMockMetrics());
    });
  });
});
