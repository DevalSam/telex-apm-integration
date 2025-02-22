/**
 * Represents a crash report containing error information and related metadata
 */
export interface CrashReport {
  [key: string]: any;
  
  /** The main error message */
  error: string;
  
  /** Error stack trace if available */
  stack?: string;
  
  /** Timestamp when the error occurred */
  timestamp: number;
  
  /** The severity level of the crash */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** The component or module where the crash occurred */
  component?: string;
  
  /** User information when the crash occurred */
  user?: {
    id?: string;
    session?: string;
  };
  
  /** System information at the time of crash */
  system?: {
    os?: string;
    browser?: string;
    version?: string;
  };
  
  /** Additional context about the crash */
  context?: {
    action?: string;
    route?: string;
    previousAction?: string;
  };
  
  /** Any additional metadata related to the crash */
  metadata?: Record<string, unknown>;
}

export function isCrashReport(value: unknown): value is CrashReport {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as CrashReport).error === 'string'
  );
}
