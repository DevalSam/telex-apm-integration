import { VercelRequest, VercelResponse } from '@vercel/node';

// Export types and classes for external use
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

// Default export for Vercel function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Request received:', req.method, req.url);
    res.status(200).json({ message: 'Hello, world!' });
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}