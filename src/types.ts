export interface PlatformMonitor {
    collectMetrics(): Promise<MetricsData>;
    handleCrash(error: Error): Promise<CrashReport>;
  }
  
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