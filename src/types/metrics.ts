/**
 * Represents performance metrics data collected from the application
 */
export interface MetricsData {
  /** Platform where metrics were collected */
  platform: string;
  
  /** Timestamp when metrics were collected */
  timestamp: number;
  
  /** Collection of performance metrics */
  metrics: {
    /** Memory usage in MB */
    memory: number;
    
    /** CPU usage percentage */
    cpu: number;
    
    /** Frames per second */
    fps: number;
    
    /** Time taken to render a frame in ms */
    frameTime: number;
  };
}

export function isMetricsData(value: unknown): value is MetricsData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'platform' in value &&
    'timestamp' in value &&
    'metrics' in value &&
    typeof (value as MetricsData).metrics === 'object'
  );
}
