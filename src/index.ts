
import { TelexClient, TelexConfig } from './types/telex';
import { APMConfig, MetricsData, CrashReport } from './types';
import { FlutterMonitor } from './platforms/flutter';
import { MetricsAggregator } from './services/metrics-aggregator';
import { Logger } from './utils/logger';

export class APMIntegration {
  private telexClient: TelexClient;
  private monitors: Map<string, any>;
  private metricsAggregator: MetricsAggregator;
  private logger: Logger;

  constructor(config: APMConfig) {
    const telexConfig: TelexConfig = {
      organization: config.organization,
      intervalConfig: config.intervals
    };

    this.telexClient = new TelexClient(telexConfig);
    this.monitors = new Map();
    this.metricsAggregator = new MetricsAggregator();
    this.logger = new Logger();

    this.initialize(config);
  }

  private async initialize(config: APMConfig): Promise<void> {
    try {
      await this.telexClient.initialize();
      this.setupMonitors(config);
      this.setupIntervals(config.intervals);
      
      this.logger.info('APM Integration initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize APM Integration:', error);
      throw error;
    }
  }

  private setupMonitors(config: APMConfig): void {
    if (config.platforms.flutter) {
      this.monitors.set('flutter', new FlutterMonitor());
    }
    // Add other platform monitors as needed
  }

  private setupIntervals(intervals: APMConfig['intervals']): void {
    // Set up performance check interval
    setInterval(async () => {
      await this.collectAndSendMetrics();
    }, intervals.performanceCheck * 1000);

    // Set up crash report check interval
    setInterval(async () => {
      await this.checkForCrashes();
    }, intervals.crashReport * 1000);
  }

  private async collectAndSendMetrics(): Promise<void> {
    try {
      for (const [platform, monitor] of this.monitors) {
        const metrics = await monitor.collectMetrics();
        await this.metricsAggregator.process(metrics);
        await this.sendMetricsToTelex(metrics);
      }
    } catch (error) {
      this.logger.error('Error collecting metrics:', error);
    }
  }

  private async checkForCrashes(): Promise<void> {
    // Implement crash checking logic
  }

  private async sendMetricsToTelex(metrics: MetricsData): Promise<void> {
    try {
      await this.telexClient.sendMessage({
        channelId: 'metrics-channel', // This would come from config in real implementation
        content: JSON.stringify(metrics),
        metadata: {
          type: 'metrics',
          platform: metrics.platform
        }
      });
    } catch (error) {
      this.logger.error('Error sending metrics to Telex:', error);
    }
  }
}
