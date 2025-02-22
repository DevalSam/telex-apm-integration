import { validateMetrics, validateCrashReport, ValidationError } from '../validation';
import { createMockMetrics, createMockCrash } from '../../test-helpers';

describe('Validation Utils', () => {
  describe('validateMetrics', () => {
    it('accepts valid metrics', () => {
      const metrics = createMockMetrics();
      expect(() => validateMetrics(metrics)).not.toThrow();
    });

    it('rejects null metrics', () => {
      expect(() => validateMetrics(null as any))
        .toThrow(ValidationError);
    });

    it('validates memory range', () => {
      const metrics = createMockMetrics();
      metrics.metrics.memory = -1;
      expect(() => validateMetrics(metrics))
        .toThrow('Memory must be a number between 0 and 100');

      metrics.metrics.memory = 101;
      expect(() => validateMetrics(metrics))
        .toThrow('Memory must be a number between 0 and 100');
    });

    it('validates CPU range', () => {
      const metrics = createMockMetrics();
      metrics.metrics.cpu = -1;
      expect(() => validateMetrics(metrics))
        .toThrow('CPU must be a number between 0 and 100');

      metrics.metrics.cpu = 101;
      expect(() => validateMetrics(metrics))
        .toThrow('CPU must be a number between 0 and 100');
    });

    it('validates FPS', () => {
      const metrics = createMockMetrics();
      metrics.metrics.fps = -1;
      expect(() => validateMetrics(metrics))
        .toThrow('FPS must be a positive number');
    });

    it('validates frame time', () => {
      const metrics = createMockMetrics();
      metrics.metrics.frameTime = -1;
      expect(() => validateMetrics(metrics))
        .toThrow('Frame time must be a positive number');
    });
  });

  describe('validateCrashReport', () => {
    it('accepts valid crash report', () => {
      const crash = createMockCrash();
      expect(() => validateCrashReport(crash)).not.toThrow();
    });

    it('rejects null crash report', () => {
      expect(() => validateCrashReport(null as any))
        .toThrow(ValidationError);
    });

    it('validates device info', () => {
      const crash = createMockCrash();
      crash.deviceInfo = {
        os: 'test-os',
        version: crash.deviceInfo.version,
        device: crash.deviceInfo.device
      };
      expect(() => validateCrashReport(crash)).not.toThrow();

      // Now test with missing os
      crash.deviceInfo = {
        version: crash.deviceInfo.version,
        device: crash.deviceInfo.device,
        os: ''  // Invalid empty string
      };
      expect(() => validateCrashReport(crash))
        .toThrow('OS is required and must be a string');
    });

    it('validates error message', () => {
      const crash = createMockCrash();
      crash.error = '';
      expect(() => validateCrashReport(crash))
        .toThrow('Error message is required and must be a string');
    });
  });
});