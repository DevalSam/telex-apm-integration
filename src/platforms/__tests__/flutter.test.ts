

import { FlutterMonitor } from '../flutter';

describe('FlutterMonitor', () => {
  let monitor: FlutterMonitor;

  beforeEach(() => {
    monitor = new FlutterMonitor();
  });

  describe('collectMetrics', () => {
    test('returns metrics in correct format', async () => {
      const metrics = await monitor.collectMetrics();
      
      expect(metrics).toHaveProperty('platform', 'flutter');
      expect(metrics).toHaveProperty('timestamp');
      expect(metrics.metrics).toHaveProperty('memory');
      expect(metrics.metrics).toHaveProperty('cpu');
      expect(metrics.metrics).toHaveProperty('fps');
      expect(metrics.metrics).toHaveProperty('frameTime');
      
      // Verify ranges
      expect(metrics.metrics.memory).toBeGreaterThanOrEqual(0);
      expect(metrics.metrics.memory).toBeLessThanOrEqual(100);
      expect(metrics.metrics.cpu).toBeGreaterThanOrEqual(0);
      expect(metrics.metrics.cpu).toBeLessThanOrEqual(100);
    });

    test('handles collection errors', async () => {
      // Mock internal method to throw
      jest.spyOn(monitor as any, 'getMemoryUsage').mockRejectedValueOnce(new Error('Memory access failed'));
      
      await expect(monitor.collectMetrics())
        .rejects
        .toThrow('Failed to collect Flutter metrics: Memory access failed');
    });

    test('handles non-Error failures', async () => {
      jest.spyOn(monitor as any, 'getMemoryUsage').mockRejectedValueOnce('Unknown error');
      
      await expect(monitor.collectMetrics())
        .rejects
        .toThrow('Failed to collect Flutter metrics: Unknown error');
    });
  });

  describe('handleCrash', () => {
    test('creates properly formatted crash report', async () => {
      const testError = new Error('Test crash');
      const report = await monitor.handleCrash(testError);
      
      expect(report).toHaveProperty('platform', 'flutter');
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('error', 'Test crash');
      expect(report).toHaveProperty('stackTrace');
      expect(report).toHaveProperty('deviceInfo');
    });

    test('handles errors without stack traces', async () => {
      const errorWithoutStack = new Error('No stack');
      delete errorWithoutStack.stack;
      
      const report = await monitor.handleCrash(errorWithoutStack);
      expect(report.stackTrace).toBeUndefined();
    });

    test('includes device info', async () => {
      const error = new Error('Test');
      const report = await monitor.handleCrash(error);
      
      expect(report.deviceInfo).toEqual(expect.objectContaining({
        os: expect.any(String),
        version: expect.any(String),
        device: expect.any(String)
      }));
    });
  });

  describe('internal metrics collection', () => {
    test('memory usage is within bounds', async () => {
      const memory = await (monitor as any).getMemoryUsage();
      expect(memory).toBeGreaterThanOrEqual(0);
      expect(memory).toBeLessThanOrEqual(100);
    });

    test('CPU usage is within bounds', async () => {
      const cpu = await (monitor as any).getCPUUsage();
      expect(cpu).toBeGreaterThanOrEqual(0);
      expect(cpu).toBeLessThanOrEqual(100);
    });

    test('FPS is within typical range', async () => {
      const fps = await (monitor as any).getFPS();
      expect(fps).toBeGreaterThanOrEqual(0);
      expect(fps).toBeLessThanOrEqual(60);
    });
  });
});
