// test-helpers/index.ts

import { MetricsData, CrashReport } from '../src/types/telex';

export const createMockMetrics = (overrides: Partial<MetricsData> = {}): MetricsData => ({
  platform: 'test',
  timestamp: Date.now(),
  metrics: {
    memory: 50,
    cpu: 30,
    fps: 60,
    frameTime: 16.67,
    ...overrides?.metrics
  },
  ...overrides
});

export const createMockCrash = (overrides: Partial<CrashReport> = {}): CrashReport => ({
  platform: 'test',
  timestamp: Date.now(),
  error: 'Test error',
  stackTrace: 'Test stack trace',
  deviceInfo: {
    os: 'test',
    version: '1.0',
    device: 'test-device',
    ...overrides?.deviceInfo
  },
  ...overrides
});

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const createMockLogger = () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
});
