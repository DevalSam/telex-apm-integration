

// Export core functionality
export { APMIntegration } from './services/apm-integration';
export { MetricsData, CrashReport } from './types/telex';

// Note: We don't export test helpers from the main index
// They should be imported directly from their location when needed for tests
