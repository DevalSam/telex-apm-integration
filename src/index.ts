
export * from './types';
export { APMIntegration } from './services/apm-integration';
export { MetricsAggregator } from './services/metrics-aggregator';
export { SettingsHandler, type APMSettings } from './services/settings-handler';
export { ValidationError } from './utils/validation';

// Re-export types for external use
export type {
  MetricsData,
  CrashReport,
  APMConfig,
  PlatformMonitor
} from './types';
