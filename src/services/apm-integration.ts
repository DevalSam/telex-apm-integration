

import { MetricsData, CrashReport } from '../types';
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
      this.logger.error('Metrics processing failed:', error);
      throw error instanceof Error ? error : new Error('Unknown error in metrics processing');
    }
  }

  async handleCrash(crashData: CrashReport | null): Promise<void> {
    try {
      if (!crashData) {
        throw new Error('Invalid crash report');
      }

      this.logger.warn('Crash detected:', crashData);

      // Convert crash to metrics format
      const crashMetrics: MetricsData = {
        platform: crashData.platform,
        timestamp: crashData.timestamp,
        metrics: {
          memory: 0,
          cpu: 0,
          fps: 0,
          frameTime: 0
        }
      };

      await this.metricsAggregator.processMetrics(crashMetrics);
    } catch (error) {
      this.logger.error('Crash processing failed:', error);
      throw error instanceof Error ? error : new Error('Unknown error in crash processing');
    }
  }
}
