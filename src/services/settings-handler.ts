
import { Logger } from '../utils/logger';

export interface APMSettings {
  collection_interval: string;
  metrics_channel: string;
  alerts_channel: string;
  monitored_platforms: string[];
  memory_threshold: number;
  cpu_threshold: number;
  fps_threshold: number;
  enable_crash_reporting: boolean;
  alert_sensitivity: 'High' | 'Medium' | 'Low';
}

export class SettingsHandler {
  private logger: Logger;
  private settings!: APMSettings; // Using definite assignment assertion

  constructor() {
    this.logger = new Logger('SettingsHandler');
  }

  public loadSettings(settings: any): APMSettings {
    try {
      this.validateSettings(settings);
      this.settings = this.parseSettings(settings);
      this.logger.info('Settings loaded successfully');
      return this.settings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to load settings:', errorMessage);
      throw error;
    }
  }

  private validateSettings(settings: any): void {
    // Required text fields
    if (!settings.collection_interval) {
      throw new Error('Collection interval is required');
    }
    if (!settings.metrics_channel) {
      throw new Error('Metrics channel ID is required');
    }
    if (!settings.alerts_channel) {
      throw new Error('Alerts channel ID is required');
    }

    // Validate crontab format
    if (!this.isValidCrontab(settings.collection_interval)) {
      throw new Error('Invalid collection interval format');
    }

    // Validate thresholds
    if (typeof settings.memory_threshold !== 'number' || 
        settings.memory_threshold < 0 || 
        settings.memory_threshold > 100) {
      throw new Error('Memory threshold must be between 0 and 100');
    }
    if (typeof settings.cpu_threshold !== 'number' || 
        settings.cpu_threshold < 0 || 
        settings.cpu_threshold > 100) {
      throw new Error('CPU threshold must be between 0 and 100');
    }
    if (typeof settings.fps_threshold !== 'number' || 
        settings.fps_threshold < 0) {
      throw new Error('FPS threshold must be a positive number');
    }
  }

  private parseSettings(settings: any): APMSettings {
    return {
      collection_interval: settings.collection_interval,
      metrics_channel: settings.metrics_channel,
      alerts_channel: settings.alerts_channel,
      monitored_platforms: typeof settings.monitored_platforms === 'string' 
        ? settings.monitored_platforms.split(',')
        : settings.monitored_platforms || [],
      memory_threshold: Number(settings.memory_threshold || 90),
      cpu_threshold: Number(settings.cpu_threshold || 80),
      fps_threshold: Number(settings.fps_threshold || 30),
      enable_crash_reporting: Boolean(settings.enable_crash_reporting ?? true),
      alert_sensitivity: settings.alert_sensitivity || 'Medium'
    };
  }

  private isValidCrontab(crontab: string): boolean {
    const pattern = /^(\*|\d+)(\/\d+)?(\s+(\*|\d+)(\/\d+)?){4}$/;
    return pattern.test(crontab);
  }

  public getSettings(): APMSettings {
    if (!this.settings) {
      throw new Error('Settings not loaded');
    }
    return { ...this.settings };
  }

  public getSetting<K extends keyof APMSettings>(key: K): APMSettings[K] {
    if (!this.settings) {
      throw new Error('Settings not loaded');
    }
    return this.settings[key];
  }
}
