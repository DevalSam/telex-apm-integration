
// src/services/apm-integration.ts
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

  async handleMetrics(metrics: MetricsData | null): Promise<void> {
    try {
      if (!metrics) {
        throw new Error('Invalid metrics data');
      }
      await this.metricsAggregator.processMetrics(metrics);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Metrics processing failed:', errorMessage);
      throw new Error(`Metrics processing failed: ${errorMessage}`);
    }
  }

  async handleCrash(crashData: CrashReport | null): Promise<void> {
    try {
      if (!crashData) {
        throw new Error('Invalid crash data');
      }
      this.logger.warn('Crash detected:', crashData);
      
      // Convert crash to metrics format for processing
      const metrics: MetricsData = {
        platform: crashData.platform,
        timestamp: crashData.timestamp,
        metrics: {
          memory: 0,
          cpu: 0,
          fps: 0,
          frameTime: 0
        }
      };
      
      await this.metricsAggregator.processMetrics(metrics);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Crash processing failed:', errorMessage);
      throw new Error(`Crash processing failed: ${errorMessage}`);
    }
  }
}
