import type { MetricsData, CrashReport } from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateMetrics(metrics: MetricsData): void {
  if (!metrics || typeof metrics !== 'object') {
    throw new ValidationError('Invalid metrics data');
  }

  if (!metrics.metrics || typeof metrics.metrics !== 'object') {
    throw new ValidationError('Missing required metrics properties');
  }

  const { memory, cpu, fps, frameTime } = metrics.metrics;

  if (typeof memory !== 'number' || memory < 0 || memory > 100) {
    throw new ValidationError('Memory must be a number between 0 and 100');
  }

  if (typeof cpu !== 'number' || cpu < 0 || cpu > 100) {
    throw new ValidationError('CPU must be a number between 0 and 100');
  }

  if (typeof fps !== 'number' || fps < 0) {
    throw new ValidationError('FPS must be a positive number');
  }

  if (typeof frameTime !== 'number' || frameTime < 0) {
    throw new ValidationError('Frame time must be a positive number');
  }
}

export function validateCrashReport(crash: CrashReport): void {
  if (!crash || typeof crash !== 'object') {
    throw new ValidationError('Invalid crash report');
  }

  if (!crash.error || typeof crash.error !== 'string' || crash.error.trim() === '') {
    throw new ValidationError('Error message is required and must be a string');
  }

  if (!crash.deviceInfo || typeof crash.deviceInfo !== 'object') {
    throw new ValidationError('Device info must be a valid object');
  }

  const { os, version, device } = crash.deviceInfo;

  if (!os || typeof os !== 'string' || os.trim() === '') {
    throw new ValidationError('OS is required and must be a string');
  }

  if (!version || typeof version !== 'string') {
    throw new ValidationError('Version is required and must be a string');
  }

  if (!device || typeof device !== 'string') {
    throw new ValidationError('Device name is required and must be a string');
  }
}