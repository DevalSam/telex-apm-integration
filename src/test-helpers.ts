interface MetricsData {
    platform: string;
    timestamp: number;
    metrics: {
      memory: number;
      cpu: number;
      fps: number;
      frameTime: number;
    };
  }
  
  interface CrashReport {
    platform: string;
    timestamp: number;
    error: string;
    stackTrace: string;
    deviceInfo: {
      os: string;
      version: string;
      device: string;
    };
  }
  
  export function createMockMetrics(overrides: Partial<MetricsData> = {}): MetricsData {
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
  
  export function createMockCrash(overrides: Partial<CrashReport> = {}): CrashReport {
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