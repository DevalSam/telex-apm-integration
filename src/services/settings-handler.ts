

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

const DEFAULT_SETTINGS: APMSettings = {
  collection_interval: '*/5 * * * *',
  metrics_channel: 'default-metrics',
  alerts_channel: 'default-alerts',
  monitored_platforms: [],
  memory_threshold: 90,
  cpu_threshold: 80,
  fps_threshold: 30,
  enable_crash_reporting: true,
  alert_sensitivity: 'Medium'
};

export class SettingsHandler {
  private logger: Logger;
  private settings: APMSettings;

  constructor() {
    this.logger = new Logger('SettingsHandler');
    this.settings = { ...DEFAULT_SETTINGS };  // Initialize with default settings
  }

  public loadSettings(settings: Partial<APMSettings>): APMSettings {
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

  private validateSettings(settings: Partial<APMSettings>): void {
    // Required text fields
    if (settings.collection_interval && !this.isValidCrontab(settings.collection_interval)) {
      throw new Error('Invalid collection interval format');
    }

    // Validate thresholds
    if (settings.memory_threshold !== undefined && 
        (typeof settings.memory_threshold !== 'number' || 
         settings.memory_threshold < 0 || 
         settings.memory_threshold > 100)) {
      throw new Error('Memory threshold must be between 0 and 100');
    }

    if (settings.cpu_threshold !== undefined && 
        (typeof settings.cpu_threshold !== 'number' || 
         settings.cpu_threshold < 0 || 
         settings.cpu_threshold > 100)) {
      throw new Error('CPU threshold must be between 0 and 100');
    }

    if (settings.fps_threshold !== undefined && 
        (typeof settings.fps_threshold !== 'number' || 
         settings.fps_threshold < 0)) {
      throw new Error('FPS threshold must be a positive number');
    }
  }

  private parseSettings(settings: Partial<APMSettings>): APMSettings {
    return {
      ...this.settings,  // Start with current settings
      ...settings,       // Override with new settings
      monitored_platforms: Array.isArray(settings.monitored_platforms) 
        ? settings.monitored_platforms 
        : typeof settings.monitored_platforms === 'string'
          ? settings.monitored_platforms.split(',')
          : this.settings.monitored_platforms
    };
  }

  private isValidCrontab(crontab: string): boolean {
    const pattern = /^(\*|\d+)(\/\d+)?(\s+(\*|\d+)(\/\d+)?){4}$/;
    return pattern.test(crontab);
  }

  public getSettings(): APMSettings {
    return { ...this.settings };
  }

  public getSetting<K extends keyof APMSettings>(key: K): APMSettings[K] {
    return this.settings[key];
  }
}
