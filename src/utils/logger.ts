
// src/utils/logger.ts

import winston from 'winston';

// Create the logger instance
export const logger = winston.createLogger({
  level: 'info',
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

// Export the Logger class for object-oriented usage
export class Logger {
  private prefix: string;

  constructor(prefix: string = 'APM Integration') {
    this.prefix = prefix;
  }

  info(message: string, meta?: any): void {
    logger.info(`[${this.prefix}] ${message}`, meta);
  }

  error(message: string, meta?: any): void {
    logger.error(`[${this.prefix}] ${message}`, meta);
  }

  warn(message: string, meta?: any): void {
    logger.warn(`[${this.prefix}] ${message}`, meta);
  }

  debug(message: string, meta?: any): void {
    logger.debug(`[${this.prefix}] ${message}`, meta);
  }
}
