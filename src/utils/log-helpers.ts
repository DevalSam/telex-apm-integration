// src/utils/log-helpers.ts
import { CrashReport, LogMetadata } from '../types';

export function createCrashMetadata(crashData: CrashReport): LogMetadata {
  return {
    message: crashData.error,
    level: 'warn', // Set the log level
    timestamp: crashData.timestamp,
    context: {
      service: 'APMIntegration',
      method: 'handleCrash',
      platform: crashData.platform,
    },
    data: crashData, // Include the full crash data
  };
}
