import { Logger } from '../utils/logger.js';
import { MetricsAggregator } from './metrics-aggregator.js';

export class MetricsCollector {
  private intervals: Map<string, NodeJS.Timeout>;
  private aggregator: MetricsAggregator;
  private logger: Logger;

  constructor() {
    this.intervals = new Map();
    this.aggregator = new MetricsAggregator();
    this.logger = new Logger('MetricsCollector');
  }

  public startCollection(platform: string, monitor: any, intervalMs: number): void {
    if (this.intervals.has(platform)) {
      this.stopCollection(platform);
    }

    const interval = setInterval(async () => {
      try {
        const metrics = await monitor.collectMetrics();
        await this.aggregator.processMetrics(metrics);
        this.logger.info(`Collected metrics for ${platform}`, { metrics });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to collect metrics for ${platform}: ${errorMessage}`);
      }
    }, intervalMs);

    this.intervals.set(platform, interval);
    this.logger.info(`Started metrics collection for ${platform}`);
  }

  public stopCollection(platform: string): void {
    const interval = this.intervals.get(platform);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(platform);
      this.logger.info(`Stopped metrics collection for ${platform}`);
    }
  }

  public stopAllCollections(): void {
    // Using underscore to indicate intentionally unused parameter
    this.intervals.forEach((_, platform) => {
      this.stopCollection(platform);
    });
  }
}