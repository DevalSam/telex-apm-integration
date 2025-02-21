

import { SettingsHandler } from '../settings-handler';

describe('SettingsHandler', () => {
  let handler: SettingsHandler;

  beforeEach(() => {
    handler = new SettingsHandler();
  });

  const validSettings = {
    collection_interval: '*/5 * * * *',
    metrics_channel: 'metrics-123',
    alerts_channel: 'alerts-123',
    monitored_platforms: 'flutter,react-native',
    memory_threshold: 90,
    cpu_threshold: 80,
    fps_threshold: 30,
    enable_crash_reporting: true,
    alert_sensitivity: 'Medium'
  };

  describe('loadSettings', () => {
    it('loads valid settings successfully', () => {
      const settings = handler.loadSettings(validSettings);
      expect(settings.collection_interval).toBe('*/5 * * * *');
      expect(settings.monitored_platforms).toEqual(['flutter', 'react-native']);
    });

    it('validates required fields', () => {
      const invalidSettings = { ...validSettings, collection_interval: '' };
      expect(() => handler.loadSettings(invalidSettings))
        .toThrow('Collection interval is required');
    });

    it('validates crontab format', () => {
      const invalidSettings = { ...validSettings, collection_interval: 'invalid' };
      expect(() => handler.loadSettings(invalidSettings))
        .toThrow('Invalid collection interval format');
    });

    it('validates threshold ranges', () => {
      expect(() => handler.loadSettings({ ...validSettings, memory_threshold: 101 }))
        .toThrow('Memory threshold must be between 0 and 100');
      
      expect(() => handler.loadSettings({ ...validSettings, cpu_threshold: -1 }))
        .toThrow('CPU threshold must be between 0 and 100');
      
      expect(() => handler.loadSettings({ ...validSettings, fps_threshold: -1 }))
        .toThrow('FPS threshold must be a positive number');
    });
  });

  describe('getSettings', () => {
    it('returns loaded settings', () => {
      handler.loadSettings(validSettings);
      const settings = handler.getSettings();
      expect(settings).toEqual(expect.objectContaining(validSettings));
    });

    it('throws error when settings not loaded', () => {
      expect(() => handler.getSettings()).toThrow('Settings not loaded');
    });
  });

  describe('getSetting', () => {
    it('returns specific setting value', () => {
      handler.loadSettings(validSettings);
      expect(handler.getSetting('collection_interval')).toBe('*/5 * * * *');
    });

    it('throws error when settings not loaded', () => {
      expect(() => handler.getSetting('collection_interval'))
        .toThrow('Settings not loaded');
    });
  });
});
