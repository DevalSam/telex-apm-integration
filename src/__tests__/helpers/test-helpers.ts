
import { MetricsData, CrashReport } from '../../types';

/**
 * Creates a mock metrics object for testing.
 * @param overrides - Optional overrides for default values.
 * @returns A mock metrics object.
 */
export const createMockMetrics = (overrides: Partial<MetricsData> = {}): MetricsData => {
  const defaults: MetricsData = {
    platform: 'test-platform',
    timestamp: Date.now(),
    metrics: {
      memory: 50, // Memory usage in MB
      cpu: 30,    // CPU usage percentage
      fps: 60,    // Frames per second
      frameTime: 16.67, // Time per frame in milliseconds
    },
  };

  return { ...defaults, ...overrides };
};

/**
 * Creates a mock crash report object for testing.
 * @param overrides - Optional overrides for default values.
 * @returns A mock crash report object.
 */
export const createMockCrash = (overrides: Partial<CrashReport> = {}): CrashReport => {
  const defaults: CrashReport = {
    platform: 'test-platform',
    timestamp: Date.now(),
    error: 'Test error message',
    stackTrace: 'Error: Test error\n    at <anonymous>:1:1',
    deviceInfo: {
      os: 'TestOS',
      version: '1.0.0',
      device: 'TestDevice',
    },
  };

  return { ...defaults, ...overrides };
};

/**
 * Utility to generate multiple mock metrics for testing.
 * @param count - Number of mock metrics to generate.
 * @returns An array of mock metrics.
 */
export const generateMockMetrics = (count: number): MetricsData[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockMetrics({
      timestamp: Date.now() - index * 1000, // Simulate timestamps spaced by 1 second
    }),
  );
};

/**
 * Utility to generate multiple mock crash reports for testing.
 * @param count - Number of mock crash reports to generate.
 * @returns An array of mock crash reports.
 */
export const generateMockCrashes = (count: number): CrashReport[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockCrash({
      timestamp: Date.now() - index * 1000, // Simulate timestamps spaced by 1 second
    }),
  );
};
