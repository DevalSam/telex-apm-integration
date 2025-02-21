
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
      const metrics = createMockMetrics({ 
        metrics: { memory: -1 } 
      });
      expect(() => validateMetrics(metrics))
        .toThrow('Memory must be a number between 0 and 100');

      const metrics2 = createMockMetrics({ 
        metrics: { memory: 101 } 
      });
      expect(() => validateMetrics(metrics2))
        .toThrow('Memory must be a number between 0 and 100');
    });

    it('validates CPU range', () => {
      const metrics = createMockMetrics({ 
        metrics: { cpu: -1 } 
      });
      expect(() => validateMetrics(metrics))
        .toThrow('CPU must be a number between 0 and 100');

      const metrics2 = createMockMetrics({ 
        metrics: { cpu: 101 } 
      });
      expect(() => validateMetrics(metrics2))
        .toThrow('CPU must be a number between 0 and 100');
    });

    it('validates FPS', () => {
      const metrics = createMockMetrics({ 
        metrics: { fps: -1 } 
      });
      expect(() => validateMetrics(metrics))
        .toThrow('FPS must be a positive number');
    });

    it('validates frame time', () => {
      const metrics = createMockMetrics({ 
        metrics: { frameTime: -1 } 
      });
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
      const crash = createMockCrash({
        deviceInfo: {
          version: '1.0',
          device: 'test-device'
          // os is intentionally omitted
        }
      });
      expect(() => validateCrashReport(crash))
        .toThrow('OS is required and must be a string');
    });

    it('validates error message', () => {
      const crash = createMockCrash({
        error: ''
      });
      expect(() => validateCrashReport(crash))
        .toThrow('Error message is required and must be a string');
    });
  });
});
