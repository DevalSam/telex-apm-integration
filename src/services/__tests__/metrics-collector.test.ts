// src/services/__tests__/metrics-collector.test.ts
import { MetricsCollector } from '../metrics-collector';
import { Logger } from '../../utils/logger';

jest.mock('../../utils/logger');
jest.mock('../metrics-aggregator');

describe('MetricsCollector', () => {
  let collector: MetricsCollector;
  let mockMonitor: jest.Mocked<any>;
  const MockLogger = Logger as jest.MockedClass<typeof Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Create mock monitor
    mockMonitor = {
      collectMetrics: jest.fn().mockResolvedValue({
        platform: 'test',
        timestamp: Date.now(),
        metrics: {
          memory: 50,
          cpu: 30,
          fps: 60,
          frameTime: 16.67
        }
      })
    };

    collector = new MetricsCollector();
  });

  afterEach(() => {
    jest.useRealTimers();
    collector.stopAllCollections();
  });

  describe('startCollection', () => {
    it('starts collecting metrics at specified interval', () => {
      const platform = 'test-platform';
      const interval = 1000;

      collector.startCollection(platform, mockMonitor, interval);
      
      expect(collector['intervals'].has(platform)).toBe(true);
      expect(MockLogger.prototype.info).toHaveBeenCalledWith(
        `Started metrics collection for ${platform}`
      );
    });

    it('replaces existing collection interval', () => {
      const platform = 'test-platform';
      const interval = 1000;

      collector.startCollection(platform, mockMonitor, interval);
      const firstInterval = collector['intervals'].get(platform);

      collector.startCollection(platform, mockMonitor, interval);
      const secondInterval = collector['intervals'].get(platform);

      expect(firstInterval).not.toBe(secondInterval);
      expect(collector['intervals'].has(platform)).toBe(true);
    });

    it('collects and processes metrics', async () => {
      const platform = 'test-platform';
      collector.startCollection(platform, mockMonitor, 1000);

      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Allow promises to resolve

      expect(mockMonitor.collectMetrics).toHaveBeenCalled();
      expect(collector['aggregator'].processMetrics).toHaveBeenCalled();
    });

    it('handles collection errors', async () => {
      const platform = 'test-platform';
      const error = new Error('Collection failed');
      mockMonitor.collectMetrics.mockRejectedValueOnce(error);

      collector.startCollection(platform, mockMonitor, 1000);
      
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Allow promises to resolve

      expect(MockLogger.prototype.error).toHaveBeenCalledWith(
        `Failed to collect metrics for ${platform}: ${error.message}`
      );
    });
  });

  describe('stopCollection', () => {
    it('stops collection for specified platform', () => {
      const platform = 'test-platform';
      collector.startCollection(platform, mockMonitor, 1000);
      collector.stopCollection(platform);

      expect(collector['intervals'].has(platform)).toBe(false);
      expect(MockLogger.prototype.info).toHaveBeenCalledWith(
        `Stopped metrics collection for ${platform}`
      );
    });

    it('handles stopping non-existent collection', () => {
      collector.stopCollection('non-existent');
      expect(MockLogger.prototype.info).not.toHaveBeenCalled();
    });
  });

  describe('stopAllCollections', () => {
    it('stops all active collections', () => {
      const platforms = ['platform1', 'platform2', 'platform3'];
      
      platforms.forEach(platform => {
        collector.startCollection(platform, mockMonitor, 1000);
      });

      collector.stopAllCollections();

      platforms.forEach(platform => {
        expect(collector['intervals'].has(platform)).toBe(false);
      });
    });
  });
});