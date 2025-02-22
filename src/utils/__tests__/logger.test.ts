import { Logger } from '../logger.js';
import type { LogMetadata } from '../logger-types.js';

describe('Logger', () => {
  let logger: Logger;
  const testPrefix = 'TestPrefix';

  beforeEach(() => {
    logger = new Logger(testPrefix);
    jest.clearAllMocks();
  });

  test('should create logger with prefix', () => {
    expect(logger).toBeDefined();
  });

  test('should log info messages', () => {
    const message = 'Test info message';
    const meta: LogMetadata = { 
      key: 'value' 
    };
    
    logger.info(message, meta);
  });

  test('should log error messages', () => {
    const message = 'Test error message';
    const error = new Error('Test error');
    
    logger.error(message, {
      error: error.message,
      stack: error.stack
    });
  });

  test('should log warning messages', () => {
    const message = 'Test warning message';
    
    logger.warn(message);
  });

  test('should log debug messages', () => {
    const message = 'Test debug message';
    const meta: LogMetadata = { 
      debug: true 
    };
    
    logger.debug(message, meta);
  });

  test('should create logger without prefix', () => {
    const defaultLogger = new Logger();
    expect(defaultLogger).toBeDefined();
  });
});