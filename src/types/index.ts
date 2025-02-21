
export interface MetricsData {
  platform: string;
  timestamp: number;
  metrics: {
    memory: number;     // Memory usage in percentage (0-100)
    cpu: number;        // CPU usage percentage (0-100)
    fps: number;        // Frames per second
    frameTime: number;  // Time per frame in milliseconds
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
  metricsChannelId: string;
  crashChannelId: string;
  authToken: string;
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

export interface PlatformMonitor {
  collectMetrics(): Promise<MetricsData>;
  handleCrash(error: Error): Promise<CrashReport>;
}

// Additional interfaces for internal use
export interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  prefix?: string;
  metadata?: Record<string, unknown>;
}

export interface MetricsThresholds {
  memory: number;
  cpu: number;
  fps: number;
  frameTime: number;
}

export interface AnomalyDetectionConfig {
  thresholds: MetricsThresholds;
  sensitivity: 'High' | 'Medium' | 'Low';
  alertOnConsecutive: number;
}
