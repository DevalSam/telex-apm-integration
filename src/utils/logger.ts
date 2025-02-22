// src/utils/logger.ts
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
      context: {
        service: prefix
      } as Record<string, unknown>,
      ...(options.defaultMetadata ?? {}) // Ensuring valid object structure
    };
  }

  private createLogMetadata(
    message: string,
    level: LogLevel,
    method: string,
    additionalMeta?: LogMetadata
  ): LogMetadata {
    const baseContext = this.defaultMetadata.context as Record<string, unknown>;
    const additionalContext = (additionalMeta?.context ?? {}) as Record<string, unknown>;

    return {
      ...this.defaultMetadata,
      message,
      level,
      timestamp: Date.now(),
      context: {
        ...baseContext,
        service: this.prefix,
        method,
        ...additionalContext
      },
      ...(additionalMeta ?? {})
    };
  }

  private formatMessage(message: string): string {
    return `[${this.prefix}] ${message}`;
  }

  info(message: string, meta?: LogMetadata): void {
    const logMetadata = this.createLogMetadata(
      message,
      'info',
      'info',
      meta
    );
    logger.info(this.formatMessage(message), logMetadata);
  }

  error(message: string, meta?: LogMetadata): void {
    const logMetadata = this.createLogMetadata(
      message,
      'error',
      'error',
      meta
    );
    logger.error(this.formatMessage(message), logMetadata);
  }

  warn(message: string, meta?: LogMetadata): void {
    const logMetadata = this.createLogMetadata(
      message,
      'warn',
      'warn',
      meta
    );
    logger.warn(this.formatMessage(message), logMetadata);
  }

  debug(message: string, meta?: LogMetadata): void {
    const logMetadata = this.createLogMetadata(
      message,
      'debug',
      'debug',
      meta
    );
    logger.debug(this.formatMessage(message), logMetadata);
  }
}

// Example usage:
// const logger = new Logger('SettingsHandler');
// logger.error('Failed to load settings:', {
//   context: {
//     method: 'loadSettings',
//     error: 'Invalid format'
//   },
//   data: { 
//     settingsAttempted: true 
//   }
// });