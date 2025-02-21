// jest.setup.js

// Increase timeout for all tests
jest.setTimeout(10000);

// Configure fake timers globally
jest.useFakeTimers();

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Keep error and warn for debugging
  error: jest.fn(),
  warn: jest.fn(),
  // Disable info and debug
  info: jest.fn(),
  debug: jest.fn(),
  // Keep log for general use
  log: console.log,
};
