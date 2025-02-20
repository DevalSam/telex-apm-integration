// src/types/index.ts

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
  deviceInfo: Record<string, any>;
}

export interface PlatformMonitor {
  collectMetrics(): Promise<MetricsData>;
  handleCrash(error: Error): Promise<CrashReport>;
}

export interface APMConfig {
  organization: string;
  platforms: {
    flutter?: boolean;
    reactNative?: boolean;
    maui?: boolean;
  };
  intervals: {
    performanceCheck: number;
    crashReport: number;
  };
}
