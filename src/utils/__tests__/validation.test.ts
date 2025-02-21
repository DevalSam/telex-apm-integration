

import { validateMetrics, validateCrashReport, ValidationError } from '../validation';
import { createMockMetrics, createMockCrash } from '../../test-helpers';

describe('Validation Utils', () => {
  describe('validateMetrics', () => {
    it('accepts valid metrics', () => {
      const metrics = createMockMetrics();
      expect(() => validateMetrics(metrics)).not.toThrow();
    });

    it('rejects null or undefined metrics', () => {
      expect(() => validateMetrics(null as any)).toThrow(ValidationError);
      expect(() => validateMetrics(undefined as any)).toThrow(ValidationError);
    });

    it('validates platform field', () => {
      const metrics = createMockMetrics();
      (metrics as any).platform = null;
      expect(() => validateMetrics(metrics))
        .toThrow('Platform is required and must be a string');
    });

    it('validates timestamp field', () => {
      const metrics = createMockMetrics();
      (metrics as any).timestamp = 'invalid';
      expect(() => validateMetrics(metrics))
        .toThrow('Timestamp is required and must be a number');
    });

    describe('metrics validation', () => {
      it('validates memory range', () => {
        const metrics = createMockMetrics({ metrics: { memory: -1 } });
        expect(() => validateMetrics(metrics))
          .toThrow('Memory must be a number between 0 and 100');

        const metrics2 = createMockMetrics({ metrics: { memory: 101 } });
        expect(() => validateMetrics(metrics2))
          .toThrow('Memory must be a number between 0 and 100');
      });

      it('validates CPU range', () => {
        const metrics = createMockMetrics({ metrics: { cpu: -1 } });
        expect(() => validateMetrics(metrics))
          .toThrow('CPU must be a number between 0 and 100');

        const metrics2 = createMockMetrics({ metrics: { cpu: 101 } });
        expect(() => validateMetrics(metrics2))
          .toThrow('CPU must be a number between 0 and 100');
      });

      it('validates FPS', () => {
        const metrics = createMockMetrics({ metrics: { fps: -1 } });
        expect(() => validateMetrics(metrics))
          .toThrow('FPS must be a positive number');
      });

      it('validates frame time', () => {
        const metrics = createMockMetrics({ metrics: { frameTime: -1 } });
        expect(() => validateMetrics(metrics))
          .toThrow('Frame time must be a positive number');
      });
    });
  });

  describe('validateCrashReport', () => {
    it('accepts valid crash report', () => {
      const crash = createMockCrash();
      expect(() => validateCrashReport(crash)).not.toThrow();
    });

    it('rejects null or undefined crash report', () => {
      expect(() => validateCrashReport(null as any))
        .toThrow(ValidationError);
      expect(() => validateCrashReport(undefined as any))
        .toThrow(ValidationError);
    });

    it('validates platform field', () => {
      const crash = createMockCrash();
      (crash as any).platform = null;
      expect(() => validateCrashReport(crash))
        .toThrow('Platform is required and must be a string');
    });

    it('validates timestamp field', () => {
      const crash = createMockCrash();
      (crash as any).timestamp = 'invalid';
      expect(() => validateCrashReport(crash))
        .toThrow('Timestamp is required and must be a number');
    });

    it('validates error message', () => {
      const crash = createMockCrash({ error: '' });
      expect(() => validateCrashReport(crash))
        .toThrow('Error message is required and must be a string');
    });

    describe('device info validation', () => {
      it('validates OS field', () => {
        const crash = createMockCrash();
        crash.deviceInfo = {
          ...crash.deviceInfo,
          os: ''
        };
        expect(() => validateCrashReport(crash))
          .toThrow('OS is required and must be a string');
      });

      it('validates version field', () => {
        const crash = createMockCrash();
        crash.deviceInfo = {
          ...crash.deviceInfo,
          version: ''
        };
        expect(() => validateCrashReport(crash))
          .toThrow('Version is required and must be a string');
      });

      it('validates device field', () => {
        const crash = createMockCrash();
        crash.deviceInfo = {
          ...crash.deviceInfo,
          device: ''
        };
        expect(() => validateCrashReport(crash))
          .toThrow('Device name is required and must be a string');
      });
    });
  });
});
