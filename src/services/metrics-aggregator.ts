// src/services/metrics-aggregator.ts
import { MetricsData } from '../types';
import { Logger } from '../utils/logger';

export class MetricsAggregator {
  private metricsHistory: Map<string, MetricsData[]>;
  private historyLimit: number;
  private logger: Logger;

  constructor() {
    this.metricsHistory = new Map();
    this.historyLimit = 100;
    this.logger = new Logger('MetricsAggregator');
  }

  async processMetrics(metrics: MetricsData): Promise<void> {
    try {
      const platform = metrics.platform;
      if (!this.metricsHistory.has(platform)) {
        this.metricsHistory.set(platform, []);
      }

      const history = this.metricsHistory.get(platform)!;
      history.push(metrics);

      // Trim history if it exceeds the limit
      while (history.length > this.historyLimit) {
        history.shift();
      }

      this.logger.info('Processed metrics', { platform, metrics });
      this.analyzeMetrics();
    } catch (error) {
      this.logger.error('Failed to process metrics', {
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics
      });
      throw error;
    }
  }

  getMetricsHistory(platform: string): MetricsData[] {
    return this.metricsHistory.get(platform) || [];
  }

  analyzeMetrics(): void {
    for (const [platform, metrics] of this.metricsHistory.entries()) {
      if (metrics.length === 0) continue;

      const latest = metrics[metrics.length - 1];
      const { memory, cpu } = latest.metrics;

      if (memory > 90) {
        this.logger.warn('High memory usage detected', { platform, memory });
      }
      if (cpu > 80) {
        this.logger.warn('High CPU usage detected', { platform, cpu });
      }
    }
  }

  clearHistory(): void {
    this.metricsHistory.clear();
    this.logger.info('Metrics history cleared');
  }

  setHistoryLimit(limit: number): void {
    if (limit < 0 || limit > 1000) {
      throw new Error('History limit must be between 0 and 1000');
    }

    this.historyLimit = limit;
    
    // Trim existing histories if needed
    this.metricsHistory.forEach((history, platform) => {
      while (history.length > this.historyLimit) {
        history.shift();
      }
      this.logger.info(`Adjusted history for ${platform}`, { newLimit: limit });
    });
  }

  getMetricsSummary(): string {
    const summary = Array.from(this.metricsHistory.entries()).map(([platform, metrics]) => {
      const count = metrics.length;
      const latest = metrics[metrics.length - 1]?.metrics;
      return `${platform}: ${count} records, Latest - Memory: ${latest?.memory}%, CPU: ${latest?.cpu}%`;
    }).join('\n');

    this.logger.info('Generated metrics summary');
    return summary || 'No metrics collected';
  }

  calculateStatistics(): any {
    const stats = new Map<string, { memory: number[], cpu: number[] }>();
    
    this.metricsHistory.forEach((metrics, platform) => {
      const platformStats = {
        memory: metrics.map(m => m.metrics.memory),
        cpu: metrics.map(m => m.metrics.cpu)
      };
      stats.set(platform, platformStats);
    });

    this.logger.info('Calculated metrics statistics');
    return Object.fromEntries(stats);
  }

  calculateAverage(): number {
    let totalCpu = 0;
    let count = 0;

    this.metricsHistory.forEach(metrics => {
      metrics.forEach(metric => {
        totalCpu += metric.metrics.cpu;
        count++;
      });
    });

    const average = count > 0 ? totalCpu / count : 0;
    this.logger.info('Calculated CPU average', { average });
    return average;
  }

  detectAnomalies(): boolean {
    let anomalyDetected = false;

    this.metricsHistory.forEach((metrics, platform) => {
      if (metrics.length === 0) return;

      const latest = metrics[metrics.length - 1];
      if (latest.metrics.memory > 90 || latest.metrics.cpu > 80) {
        anomalyDetected = true;
        this.logger.warn('Anomaly detected', {
          platform,
          metrics: latest.metrics
        });
      }
    });

    return anomalyDetected;
  }
}