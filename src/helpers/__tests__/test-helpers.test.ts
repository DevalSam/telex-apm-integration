
import { 
  createMockMetrics, 
  createMockCrash, 
  createMockLogger, 
  sleep, 
  createMockError 
} from '../../test-helpers';

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
        metrics: { memory: 75 }
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
        deviceInfo: { os: 'custom' }
      });
      expect(crash.error).toBe('Custom error');
      expect(crash.deviceInfo.os).toBe('custom');
      expect(crash.deviceInfo.version).toBe('1.0'); // Default value remains
    });
  });

  describe('createMockLogger', () => {
    it('creates logger with mock functions', () => {
      const logger = createMockLogger();
      expect(jest.isMockFunction(logger.info)).toBe(true);
      expect(jest.isMockFunction(logger.error)).toBe(true);
      expect(jest.isMockFunction(logger.warn)).toBe(true);
      expect(jest.isMockFunction(logger.debug)).toBe(true);
    });
  });

  describe('sleep', () => {
    it('waits for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const duration = Date.now() - start;
