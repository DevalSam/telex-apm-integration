/** Available log levels */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/** Crash report information */
export interface CrashReport {
  /** Platform where the crash occurred */
  platform: string;
  
  /** Timestamp of the crash */
  timestamp: number;
  
  /** Error message */
  error: string;
  
  /** Stack trace of the error */
  stackTrace: string;
  
  /** Device information */
  deviceInfo: {
    /** Operating system */
    os: string;
    /** OS/App version */
    version: string;
    /** Device model/type */
    device: string;
  };
}

/** Performance metrics data */
export interface MetricsData {
  /** Platform being monitored */
  platform: string;
  
  /** Timestamp of metrics collection */
  timestamp: number;
  
  /** Collected metrics */
  metrics: {
    /** Memory usage in MB */
    memory: number;
    /** CPU usage percentage */
    cpu: number;
    /** Frames per second */
    fps: number;
    /** Time per frame in ms */
    frameTime: number;
  };
}

/** Logging metadata structure */
export interface LogMetadata {
  /** Log message */
  message: string;
  
  /** Log level */
  level: LogLevel;
  
  /** Timestamp of the log */
  timestamp: number;
  
  /** Contextual information */
  context: {
    /** Service generating the log */
    service: string;
    /** Method where log was generated */
    method: string;
    /** Optional platform identifier */
    platform?: string;
  };
  
  /** Additional data */
  data?: unknown;
  
  /** Allow additional properties */
  [key: string]: unknown;
}

/** Main APM configuration */
export interface APMConfig {
  /** App/Platform identifier */
  appId: string;

  /** Environment configuration */
  environment: 'development' | 'staging' | 'production';

  /** Metrics collection configuration */
  metrics: {
    /** Collection interval in milliseconds */
    collectionInterval: number;
    /** Maximum metrics history size */
    historyLimit: number;
    /** Anomaly detection thresholds */
    thresholds: {
      /** Memory threshold percentage */
      memory: number;
      /** CPU threshold percentage */
      cpu: number;
      /** Minimum acceptable FPS */
      fps: number;
      /** Maximum acceptable frame time */
      frameTime: number;
    };
  };

  /** Crash reporting configuration */
  crashReporting: {
    /** Enable/disable crash reporting */
    enabled: boolean;
    /** Maximum stored crash reports */
    maxReports: number;
    /** Include device information */
    includeDeviceInfo: boolean;
  };

  /** Logging configuration */
  logging: {
    /** Minimum log level */
    minLevel: LogLevel;
    /** Include timestamps in logs */
    includeTimestamp: boolean;
    /** Log retention period in days */
    retentionPeriod: number;
  };
}

/** Platform monitoring configuration */
export interface PlatformMonitor {
  /** Unique identifier */
  id: string;

  /** Platform name */
  platform: string;

  /** Platform status */
  status: 'online' | 'offline' | 'degraded' | 'maintenance';

  /** Last update timestamp */
  lastUpdated: number;

  /** Resource usage metrics */
  resources: {
    /** CPU usage percentage */
    cpu: number;
    /** Memory usage in MB */
    memory: number;
    /** Disk usage percentage */
    diskUsage: number;
    /** Network bandwidth in Mbps */
    bandwidth: number;
  };

  /** Performance metrics */
  performance: {
    /** Response time in ms */
    responseTime: number;
    /** Requests per second */
    requestRate: number;
    /** Error rate percentage */
    errorRate: number;
    /** Average latency in ms */
    latency: number;
  };

  /** Health monitoring */
  health: {
    /** Overall health score */
    score: number;
    /** Number of active alerts */
    activeAlerts: number;
    /** Last health check timestamp */
    lastCheck: number;
    /** Dependency statuses */
    dependencies: {
      /** Dependency name */
      name: string;
      /** Dependency status */
      status: 'healthy' | 'unhealthy' | 'unknown';
    }[];
  };

  /** Monitor configuration */
  config: {
    /** Check interval in seconds */
    monitoringInterval: number;
    /** Alert thresholds */
    thresholds: {
      /** CPU threshold percentage */
      cpu: number;
      /** Memory threshold percentage */
      memory: number;
      /** Error rate threshold */
      errorRate: number;
      /** Response time threshold */
      responseTime: number;
    };
    /** Enabled features */
    enabledFeatures: string[];
  };

  /** Additional metadata */
  metadata?: {
    /** Platform version */
    version?: string;
    /** Environment name */
    environment?: string;
    /** Geographic region */
    region?: string;
    /** Custom tags */
    tags?: Record<string, string>;
  };
}

/** APM Settings configuration */
export interface APMSettings {
  /** Metrics collection interval (cron expression) */
  collection_interval: string;
  
  /** Metrics reporting channel */
  metrics_channel: string;
  
  /** Alerts channel */
  alerts_channel: string;
  
  /** Monitored platform list */
  monitored_platforms: string[];
  
  /** Memory threshold percentage */
  memory_threshold: number;
  
  /** CPU threshold percentage */
  cpu_threshold: number;
  
  /** Minimum acceptable FPS */
  fps_threshold: number;
  
  /** Enable crash reporting */
  enable_crash_reporting: boolean;
  
  /** Alert sensitivity setting */
  alert_sensitivity: 'Low' | 'Medium' | 'High';
}