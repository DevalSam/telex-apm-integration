interface Metrics {
  memory: number;
  cpu: number;
  fps: number;
  frameTime: number;
}

interface DeviceInfo {
  os: string;
  version: string;
  device: string;
}

interface MetricsData {
  platform: string;
  timestamp: number;
  metrics: Metrics;
}

interface CrashReport {
  platform: string;
  timestamp: number;
  error: string;
  stackTrace: string;
  deviceInfo: DeviceInfo;
}

// Type for nested partial objects
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function createMockMetrics(overrides: DeepPartial<MetricsData> = {}): MetricsData {
  const defaultMetrics: MetricsData = {
    platform: 'test-platform',
    timestamp: Date.now(),
    metrics: {
      memory: 50,
      cpu: 30,
      fps: 60,
      frameTime: 16.67,
    },
  };

  return {
    ...defaultMetrics,
    ...overrides,
    metrics: {
      ...defaultMetrics.metrics,
      ...(overrides.metrics || {}),
    },
  };
}

export function createMockCrash(overrides: DeepPartial<CrashReport> = {}): CrashReport {
  const defaultCrash: CrashReport = {
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

  return {
    ...defaultCrash,
    ...overrides,
    deviceInfo: {
      ...defaultCrash.deviceInfo,
      ...(overrides.deviceInfo || {}),
    },
  };
}