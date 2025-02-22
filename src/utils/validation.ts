// src/utils/validation.ts
import { Logger } from './logger';

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export class ValidationUtils {
  private static logger = new Logger('ValidationUtils');

  /**
   * Validates a cron expression
   * @param cron The cron expression to validate
   * @returns boolean indicating if the cron expression is valid
   * @throws {ValidationError} if the cron expression is invalid
   */
  public static validateCronExpression(cron: string): boolean {
    try {
      // Cron format: minute hour day month weekday
      const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
      
      if (!cron || typeof cron !== 'string') {
        throw new ValidationError('Invalid cron expression: must be a non-empty string');
      }

      // Basic format validation
      if (!cronRegex.test(cron)) {
        throw new ValidationError('Invalid cron expression format');
      }

      // Split into components
      const parts = cron.split(' ');
      if (parts.length !== 5) {
        throw new ValidationError('Invalid cron expression: must have exactly 5 parts');
      }

      // Validate each part
      const isValid = this.validateCronPart(parts[0], 0, 59) && // minute
                     this.validateCronPart(parts[1], 0, 23) && // hour
                     this.validateCronPart(parts[2], 1, 31) && // day
                     this.validateCronPart(parts[3], 1, 12) && // month
                     this.validateCronPart(parts[4], 0, 6);    // weekday

      if (!isValid) {
        throw new ValidationError('Invalid cron expression: invalid part values');
      }

      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      
      this.logger.error('Cron validation failed:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        context: {
          method: 'validateCronExpression',
          cron
        }
      });
      throw new ValidationError('Cron validation failed');
    }
  }

  private static validateCronPart(part: string, min: number, max: number): boolean {
    // Handle asterisk
    if (part === '*') {
      return true;
    }

    // Handle step values
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      if (range !== '*') {
        return false;
      }
      const stepNum = parseInt(step, 10);
      return !isNaN(stepNum) && stepNum >= 1 && stepNum <= max;
    }

    // Handle simple numbers
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= min && num <= max;
  }

  /**
   * Validates a threshold value is within range
   * @param value The threshold value
   * @param min Minimum allowed value
   * @param max Maximum allowed value
   * @param name Name of the threshold for error messages
   * @throws {ValidationError} if the threshold is out of range
   */
  public static validateThreshold(
    value: number,
    min: number,
    max: number,
    name: string
  ): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError(`${name} must be a valid number`);
    }
    
    if (value < min || value > max) {
      throw new ValidationError(`${name} must be between ${min} and ${max}`);
    }
    
    return true;
  }
}

// Export validation functions for metrics and crash reports
export function validateMetrics(data: unknown): void {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid metrics data');
  }
}

export function validateCrashReport(data: unknown): void {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid crash report');
  }
}