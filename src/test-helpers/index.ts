import { jest } from '@jest/globals';
import { MetricsData, CrashReport } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export interface MockMetricsOptions {
  platform?: string;
  metrics?: Partial<MetricsData['metrics']>;
}

export interface MockCrashOptions {
  error?: string;
  deviceInfo?: Partial<CrashReport['deviceInfo']>;
}

export const createMockMetrics = (options: MockMetricsOptions = {}): MetricsData => ({
  platform: options.platform || 'test',
  timestamp: Date.now(),
  metrics: {
    memory: 50,
    cpu: 30,
    fps: 60,
    frameTime: 16.67,
    ...options.metrics
  }
});

export const createMockCrash = (options: MockCrashOptions = {}): CrashReport => ({
  platform: 'test',
  timestamp: Date.now(),
  error: options.error || 'Test error',
  stackTrace: 'Test stack trace',
  deviceInfo: {
    os: 'test',
    version: '1.0',
    device: 'test-device',
    ...options.deviceInfo
  }
});

class MockLogger extends Logger {
  constructor() {
    super('TestLogger');
  }
}

export const createMockLogger = () => {
  const logger = new MockLogger();
  return {
    ...logger,
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  } as unknown as jest.Mocked<Logger>;
};

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const createMockError = (message: string, withStack = true): Error => {
  const error = new Error(message);
  if (!withStack) {
    delete error.stack;
  }
  return error;
};