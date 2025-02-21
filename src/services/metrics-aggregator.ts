

import { MetricsData } from '../types';
import { Logger } from '../utils/logger';

export class MetricsAggregator {
  private metricsHistory: Map<string, MetricsData[]>;
  private readonly historyLimit: number = 100;
  private logger: Logger;

  constructor() {
    this.metricsHistory = new Map();
    this.logger = new Logger('MetricsAggregator');
  }

  public async processMetrics(metrics: MetricsData): Promise<void> {
    try {
      if (!metrics || !metrics.metrics) {
        throw new Error('Invalid metrics data');
      }

      const platform = metrics.platform;
      
      if (!this.metricsHistory.has(platform)) {
        this.metricsHistory.set(platform, []);
      }

      const history = this.metricsHistory.get(platform)!;
      history.push(metrics);

      // Maintain history limit
      if (history.length > this.historyLimit) {
        history.shift();
      }

      // Analyze metrics
      await this.analyzeMetrics(platform);
      
      this.logger.info(`Processed metrics for ${platform}`, { 
        timestamp: metrics.timestamp,
        metrics: metrics.metrics 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error processing metrics:', errorMessage);
      throw error;
    }
  }

  private async analyzeMetrics(platform: string): Promise<void> {
    const history = this.metricsHistory.get(platform)!;
    
    // Calculate basic statistics
    const stats = this.calculateStatistics(history);
    
    // Check for anomalies
    const anomalies = this.detectAnomalies(history, stats);
    
    if (anomalies.length > 0) {
      this.logger.warn(`Detected anomalies for ${platform}`, { anomalies });
    }
  }

  private calculateStatistics(history: MetricsData[]): any {
    if (history.length === 0) return null;
    
    const latest = history[history.length - 1].metrics;
    return {
      memory: {
        current: latest.memory,
        average: this.calculateAverage(history.map(h => h.metrics.memory))
      },
      cpu: {
        current: latest.cpu,
        average: this.calculateAverage(history.map(h => h.metrics.cpu))
      },
      fps: {
        current: latest.fps,
        average: this.calculateAverage(history.map(h => h.metrics.fps))
      }
    };
  }

  private calculateAverage(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private detectAnomalies(history: MetricsData[], stats: any): any[] {
    if (!stats) return [];
    
    const latest = history[history.length - 1].metrics;
    const anomalies = [];

    if (latest.memory > 90) {
      anomalies.push({ type: 'memory', value: latest.memory });
    }

    if (latest.cpu > 80) {
      anomalies.push({ type: 'cpu', value: latest.cpu });
    }

    if (latest.fps < 30) {
      anomalies.push({ type: 'fps', value: latest.fps });
    }

    return anomalies;
  }
}
