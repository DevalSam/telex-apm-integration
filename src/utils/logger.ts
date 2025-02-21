
import winston from 'winston';
import type { LogLevel, LogMetadata, LoggerOptions } from './logger-types';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// Create the logger instance
export const logger = winston.createLogger({
  level: 'info',
  levels: LOG_LEVELS,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export class Logger {
  private prefix: string;
  private defaultMetadata: LogMetadata;

  constructor(prefix: string = 'APM Integration', options: LoggerOptions = {}) {
    this.prefix = prefix;
    this.defaultMetadata = {
      service: prefix,
      timestamp: Date.now(),
      ...options.defaultMetadata
    };
  }

  private formatMessage(message: string): string {
    return `[${this.prefix}] ${message}`;
  }

  private formatMetadata(meta?: LogMetadata): LogMetadata {
    return {
      ...this.defaultMetadata,
      timestamp: Date.now(),
      ...meta
    };
  }

  info(message: string, meta?: LogMetadata): void {
    logger.info(this.formatMessage(message), this.formatMetadata(meta));
  }

  error(message: string, meta?: LogMetadata): void {
    logger.error(this.formatMessage(message), this.formatMetadata(meta));
  }

  warn(message: string, meta?: LogMetadata): void {
    logger.warn(this.formatMessage(message), this.formatMetadata(meta));
  }

  debug(message: string, meta?: LogMetadata): void {
    logger.debug(this.formatMessage(message), this.formatMetadata(meta));
  }
}
