
import { MetricsData } from '../types';
import { Logger } from '../utils/logger';
import { validateMetrics } from '../utils/validation';

interface MetricsStatistics {
  memory: { current: number; average: number };
  cpu: { current: number; average: number };
  fps: { current: number; average: number };
  frameTime: { current: number; average: number };
}

interface MetricsAnomaly {
  type: 'memory' | 'cpu' | 'fps' | 'frameTime';
  value: number;
  threshold: number;
}

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
      validateMetrics(metrics);

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
    const history = this.metricsHistory.get(platform);
    if (!history || history.length === 0) return;
    
    const stats = this.calculateStatistics(history);
    const anomalies = this.detectAnomalies(history[history.length - 1].metrics, stats);
    
    if (anomalies.length > 0) {
      this.logger.warn(`Detected anomalies for ${platform}`, { anomalies });
    }
  }

  private calculateStatistics(history: MetricsData[]): MetricsStatistics {
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
      },
      frameTime: {
        current: latest.frameTime,
        average: this.calculateAverage(history.map(h => h.metrics.frameTime))
      }
    };
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0 
      ? values.reduce((a, b) => a + b, 0) / values.length 
      : 0;
  }

  private detectAnomalies(
    currentMetrics: MetricsData['metrics'], 
    stats: MetricsStatistics
  ): MetricsAnomaly[] {
    const anomalies: MetricsAnomaly[] = [];

    if (currentMetrics.memory > 90) {
      anomalies.push({ type: 'memory', value: currentMetrics.memory, threshold: 90 });
    }

    if (currentMetrics.cpu > 80) {
      anomalies.push({ type: 'cpu', value: currentMetrics.cpu, threshold: 80 });
    }

    if (currentMetrics.fps < 30) {
      anomalies.push({ type: 'fps', value: currentMetrics.fps, threshold: 30 });
    }

    if (currentMetrics.frameTime > 33.33) { // More than 30fps equivalent
      anomalies.push({ type: 'frameTime', value: currentMetrics.frameTime, threshold: 33.33 });
    }

    return anomalies;
  }

  public getMetricsHistory(platform: string): MetricsData[] {
    return this.metricsHistory.get(platform) || [];
  }
}
