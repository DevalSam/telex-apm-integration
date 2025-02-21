

export interface MetricsData {
  platform: string;
  timestamp: number;
  metrics: {
    memory: number;
    cpu: number;
    fps: number;
    frameTime: number;
  };
}

export interface CrashReport {
  platform: string;
  timestamp: number;
  error: string;
  stackTrace?: string;
  deviceInfo: {
    os: string;
    version: string;
    device: string;
  };
}

export interface APMConfig {
  organization: string;
  authToken: string;
  metricsChannelId: string;
  crashChannelId: string;
  platforms: {
    flutter?: boolean;
    reactNative?: boolean;
    maui?: boolean;
  };
  intervals: {
    performanceCheck: number;  // in seconds
    crashReport: number;       // in seconds
  };
}
