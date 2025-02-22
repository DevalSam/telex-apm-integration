import {
  createMockMetrics,
  createMockCrash
} from '../../test-helpers.js';

describe('Test Helpers', () => {
  describe('createMockMetrics', () => {
    it('creates default metrics', () => {
      const metrics = createMockMetrics();
      expect(metrics).toEqual({
        platform: 'test',
        timestamp: expect.any(Number),
        metrics: {
          memory: 50,
          cpu: 30,
          fps: 60,
          frameTime: 16.67
        }
      });
    });

    it('allows overriding metrics values', () => {
      const metrics = createMockMetrics({
        platform: 'custom',
        metrics: {
          memory: 75,
          cpu: 30,
          fps: 60,
          frameTime: 16.67
        }
      });
      expect(metrics.platform).toBe('custom');
      expect(metrics.metrics.memory).toBe(75);
      expect(metrics.metrics.cpu).toBe(30); // Default value remains
    });
  });

  describe('createMockCrash', () => {
    it('creates default crash report', () => {
      const crash = createMockCrash();
      expect(crash).toEqual({
        platform: 'test',
        timestamp: expect.any(Number),
        error: 'Test error',
        stackTrace: 'Test stack trace',
        deviceInfo: {
          os: 'test',
          version: '1.0',
          device: 'test-device'
        }
      });
    });

    it('allows overriding crash values', () => {
      const crash = createMockCrash({
        error: 'Custom error',
        deviceInfo: {
          os: 'custom',
          version: '1.0',
          device: 'test-device'
        }
      });
      expect(crash.error).toBe('Custom error');
      expect(crash.deviceInfo.os).toBe('custom');
      expect(crash.deviceInfo.version).toBe('1.0'); // Default value remains
    });
  });
});