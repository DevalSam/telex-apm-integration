/**
 * Represents structured metadata for logging events
 */
export interface LogMetadata {
    [key: string]: any;
    
    /** The log message */
    message: string;
    
    /** Log level indicating severity */
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    
    /** Timestamp of the log event */
    timestamp: number;
    
    /** Service or component generating the log */
    service?: string;
    
    /** Environment where the log was generated */
    environment?: 'development' | 'staging' | 'production';
    
    /** Request ID for tracing */
    requestId?: string;
    
    /** User context if available */
    user?: {
      id?: string;
      role?: string;
    };
    
    /** Additional labels for filtering and searching */
    labels?: {
      [key: string]: string;
    };
    
    /** Performance metrics if applicable */
    metrics?: {
      duration?: number;
      memory?: number;
      cpu?: number;
    };
    
    /** Source code location */
    source?: {
      file?: string;
      line?: number;
      function?: string;
    };
    
    /** Additional structured data */
    data?: Record<string, unknown>;
  }
  
  export function isLogMetadata(value: unknown): value is LogMetadata {
    return (
      typeof value === 'object' &&
      value !== null &&
      'message' in value &&
      'level' in value &&
      'timestamp' in value
    );
  }
  