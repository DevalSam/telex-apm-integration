
import { MetricsAggregator } from './metrics-aggregator';

export class APMIntegration {
  private metricsAggregator: MetricsAggregator;

  constructor() {
    this.metricsAggregator = new MetricsAggregator();
  }

  async handleMetrics(metrics: unknown): Promise<void> {
    try {
      if (!metrics) {
        throw new Error('Invalid metrics data');
      }
      await this.metricsAggregator.processMetrics(metrics);
    } catch (error) {
      console.error('Metrics processing failed:', error);
      throw new Error(`Metrics processing failed: ${(error as Error).message}`);
    }
  }

  async handleCrash(crashData: unknown): Promise<void> {
    try {
      if (!crashData || typeof crashData !== 'object') {
        throw new Error('Invalid crash data');
      }
      console.warn('Crash detected:', crashData);
      // Handle crash reporting logic here (e.g., send to an external API)
    } catch (error) {
      console.error('Crash processing failed:', error);
      throw new Error(`Crash processing failed: ${(error as Error).message}`);
    }
  }
}


