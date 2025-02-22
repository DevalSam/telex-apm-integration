
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogMetadata {
  timestamp?: number;
  level?: LogLevel;
  service?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: LogMetadata;
  timestamp: number;
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  defaultMetadata?: LogMetadata;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
}

