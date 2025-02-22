// src/services/apm-integration.ts
import { MetricsData, CrashReport, LogMetadata } from '../types'; // Import from shared types file
import { MetricsAggregator } from './metrics-aggregator';
import { Logger } from '../utils/logger';

export class APMIntegration {
  private metricsAggregator: MetricsAggregator;
  private logger: Logger;

  constructor() {
    this.metricsAggregator = new MetricsAggregator();
    this.logger = new Logger('APMIntegration');
  }

  async handleMetrics(metricsData: MetricsData | null): Promise<void> {
    try {
      if (!metricsData) {
        throw new Error('Invalid metrics data');
      }

      // Validate metrics data structure
      if (!metricsData.platform || !metricsData.timestamp || !metricsData.metrics) {
        throw new Error('Missing required metrics fields');
      }

      await this.metricsAggregator.processMetrics(metricsData);
    } catch (error) {
      // Format error for logging
      const errorMetadata: LogMetadata = {
        message: error instanceof Error ? error.message : 'Unknown error',
        level: 'error',
        timestamp: Date.now(),
        context: {
          service: 'APMIntegration',
          method: 'handleMetrics',
        },
      };

      this.logger.error('Metrics processing failed:', errorMetadata);
      throw error instanceof Error ? error : new Error('Unknown error in metrics processing');
    }
  }

  async handleCrash(crashData: CrashReport | null): Promise<void> {
    try {
      if (!crashData) {
        throw new Error('Invalid crash report');
      }

      // Format crash data for logging
      const crashMetadata: LogMetadata = {
        message: crashData.error,
        level: 'warn',
        timestamp: crashData.timestamp,
        context: {
          service: 'APMIntegration',
          method: 'handleCrash',
          platform: crashData.platform,
        },
        data: crashData,
      };

      this.logger.warn('Crash detected:', crashMetadata);

      // Convert crash to metrics format
      const crashMetrics: MetricsData = {
        platform: crashData.platform,
        timestamp: crashData.timestamp,
        metrics: {
          memory: 0, // Default values (can be improved)
          cpu: 0,
          fps: 0,
          frameTime: 0,
        },
      };

      await this.metricsAggregator.processMetrics(crashMetrics);
    } catch (error) {
      // Format error for logging
      const errorMetadata: LogMetadata = {
        message: error instanceof Error ? error.message : 'Unknown error',
        level: 'error',
        timestamp: Date.now(),
        context: {
          service: 'APMIntegration',
          method: 'handleCrash',
        },
      };

      this.logger.error('Crash processing failed:', errorMetadata);
      throw error instanceof Error ? error : new Error('Unknown error in crash processing');
    }
  }
}