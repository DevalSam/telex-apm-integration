import { MetricsData } from '../types';
import { Logger } from '../utils/logger';
import { validateMetrics } from '../utils/validation';

export class MetricsAggregator {
  private historyLimit: number = 100;
  private metricsHistory: Map<string, MetricsData[]> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = new Logger('MetricsAggregator');
  }

  public async processMetrics(metrics: MetricsData): Promise<void> {
    try {
      validateMetrics(metrics);

      const platform = metrics.platform;
      let history = this.metricsHistory.get(platform) || [];

      // Add new metrics
      history.push(metrics);

      // Maintain history limit
      if (history.length > this.historyLimit) {
        history = history.slice(-this.historyLimit);
      }

      this.metricsHistory.set(platform, history);
    } catch (error) {
      this.logger.error('Failed to process metrics:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        context: { method: 'processMetrics' }
      });
      throw error;
    }
  }

  public getMetricsHistory(platform: string): MetricsData[] {
    return this.metricsHistory.get(platform) || [];
  }

  public clearHistory(): void {
    this.metricsHistory.clear();
  }

  public setHistoryLimit(limit: number): void {
    if (limit < 1) {
      throw new Error('History limit must be greater than 0');
    }
    this.historyLimit = limit;
  }
}