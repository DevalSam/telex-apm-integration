// src/types/index.ts
export interface CrashReport {
    platform: string;
    timestamp: number;
    error: string;
    stackTrace: string;
    deviceInfo: {
      os: string;
      version: string;
      device: string;
    };
  }