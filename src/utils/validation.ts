
import { MetricsData, CrashReport } from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateMetrics(metrics: MetricsData): void {
  if (!metrics) {
    throw new ValidationError('Metrics cannot be null or undefined');
  }

  if (typeof metrics !== 'object') {
    throw new ValidationError('Metrics must be an object');
  }

  if (!metrics.platform || typeof metrics.platform !== 'string') {
    throw new ValidationError('Platform is required and must be a string');
  }

  if (!metrics.timestamp || typeof metrics.timestamp !== 'number') {
    throw new ValidationError('Timestamp is required and must be a number');
  }

  if (!metrics.metrics || typeof metrics.metrics !== 'object') {
    throw new ValidationError('Metrics data is required and must be an object');
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
  if (!crash) {
    throw new ValidationError('Crash report cannot be null or undefined');
  }

  if (typeof crash !== 'object') {
    throw new ValidationError('Crash report must be an object');
  }

  if (!crash.platform || typeof crash.platform !== 'string') {
    throw new ValidationError('Platform is required and must be a string');
  }

  if (!crash.timestamp || typeof crash.timestamp !== 'number') {
    throw new ValidationError('Timestamp is required and must be a number');
  }

  if (!crash.error || typeof crash.error !== 'string') {
    throw new ValidationError('Error message is required and must be a string');
  }

  if (!crash.deviceInfo || typeof crash.deviceInfo !== 'object') {
    throw new ValidationError('Device info is required and must be an object');
  }

  if (!crash.deviceInfo.os || typeof crash.deviceInfo.os !== 'string') {
    throw new ValidationError('OS is required and must be a string');
  }

  if (!crash.deviceInfo.version || typeof crash.deviceInfo.version !== 'string') {
    throw new ValidationError('Version is required and must be a string');
  }

  if (!crash.deviceInfo.device || typeof crash.deviceInfo.device !== 'string') {
    throw new ValidationError('Device name is required and must be a string');
  }
}
