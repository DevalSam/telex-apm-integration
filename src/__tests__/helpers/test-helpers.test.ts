import {
  createMockMetrics,
  createMockCrash,
} from './test-helpers.js';

describe('Test Helpers', () => {
  describe('createMockMetrics', () => {
    it('creates metrics with default values', () => {
      const metrics = createMockMetrics();
      
      expect(metrics).toEqual({
        platform: 'test-platform',
        timestamp: expect.any(Number),
        metrics: {
          memory: 50,
          cpu: 30,
          fps: 60,
          frameTime: 16.67,
        },
      });
    });

    it('applies overrides correctly', () => {
      const overrides = {
        platform: 'custom-platform',
        metrics: {
          memory: 100,
          cpu: 80,
        },
      };
      
      const metrics = createMockMetrics(overrides);
      
      expect(metrics).toEqual({
        platform: 'custom-platform',
        timestamp: expect.any(Number),
        metrics: {
          memory: 100,
          cpu: 80,
          fps: 60,
          frameTime: 16.67,
        },
      });
    });

    it('allows partial metrics overrides', () => {
      const overrides = {
        metrics: {
          memory: 75,
        },
      };
      
      const metrics = createMockMetrics(overrides);
      
      expect(metrics.metrics).toEqual({
        memory: 75,
        cpu: 30,
        fps: 60,
        frameTime: 16.67,
      });
    });
  });

  describe('createMockCrash', () => {
    it('creates crash report with default values', () => {
      const crash = createMockCrash();
      
      expect(crash).toEqual({
        platform: 'test-platform',
        timestamp: expect.any(Number),
        error: 'Test error message',
        stackTrace: 'Error: Test error\n    at <anonymous>:1:1',
        deviceInfo: {
          os: 'TestOS',
          version: '1.0.0',
          device: 'TestDevice',
        },
      });
    });

    it('applies overrides correctly', () => {
      const overrides = {
        platform: 'custom-platform',
        error: 'Custom error',
        deviceInfo: {
          os: 'CustomOS',
        },
      };
      
      const crash = createMockCrash(overrides);
      
      expect(crash).toEqual({
        platform: 'custom-platform',
        timestamp: expect.any(Number),
        error: 'Custom error',
        stackTrace: 'Error: Test error\n    at <anonymous>:1:1',
        deviceInfo: {
          os: 'CustomOS',
          version: '1.0.0',
          device: 'TestDevice',
        },
      });
    });

    it('allows partial deviceInfo overrides', () => {
      const overrides = {
        deviceInfo: {
          os: 'CustomOS',
        },
      };
      
      const crash = createMockCrash(overrides);
      
      expect(crash.deviceInfo).toEqual({
        os: 'CustomOS',
        version: '1.0.0',
        device: 'TestDevice',
      });
    });
  });
});