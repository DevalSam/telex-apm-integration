// src/__tests__/index.test.ts
import type { MetricsData, CrashReport } from '../types';
import { APMIntegration } from '../services/apm-integration';
import { MetricsAggregator } from '../services/metrics-aggregator';
import { createMockMetrics, createMockCrash } from '../test-helpers';

jest.mock('../services/metrics-aggregator');
jest.mock('../utils/logger');

describe('APMIntegration', () => {
  let integration: APMIntegration;
  let mockMetricsAggregator: jest.MockedObject<MetricsAggregator>;

  beforeEach(() => {
    const mockAggregator = {
      processMetrics: jest.fn().mockResolvedValue(undefined),
      getMetricsHistory: jest.fn().mockReturnValue([]),
      analyzeMetrics: jest.fn(),
      clearHistory: jest.fn(),
      setHistoryLimit: jest.fn(),
      getMetricsSummary: jest.fn(),
      calculateStatistics: jest.fn(),
      calculateAverage: jest.fn(),
      detectAnomalies: jest.fn(),
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      }
    };

    mockMetricsAggregator = mockAggregator as unknown as jest.MockedObject<MetricsAggregator>;
    (MetricsAggregator as jest.Mock).mockImplementation(() => mockMetricsAggregator);
    integration = new APMIntegration();
  });

  describe('handleMetrics', () => {
    it('processes valid metrics', async () => {
      const metrics = createMockMetrics();
      await expect(integration.handleMetrics(metrics)).resolves.not.toThrow();
      expect(mockMetricsAggregator.processMetrics).toHaveBeenCalledWith(metrics);
    });

    it('handles null metrics', async () => {
      await expect(integration.handleMetrics(null as unknown as MetricsData))
        .rejects.toThrow('Invalid metrics data');
      expect(mockMetricsAggregator.processMetrics).not.toHaveBeenCalled();
    });

    it('handles processing errors', async () => {
      const metrics = createMockMetrics();
      const errorMessage = 'Processing failed';
      mockMetricsAggregator.processMetrics.mockRejectedValueOnce(new Error(errorMessage));
      await expect(integration.handleMetrics(metrics))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('handleCrash', () => {
    it('processes valid crash report', async () => {
      const crash = createMockCrash();
      await expect(integration.handleCrash(crash)).resolves.not.toThrow();
    });

    it('handles null crash report', async () => {
      await expect(integration.handleCrash(null as unknown as CrashReport))
        .rejects.toThrow('Invalid crash report');
    });

    it('handles processing errors', async () => {
      const crash = createMockCrash();
      const errorMessage = 'Processing failed';
      mockMetricsAggregator.processMetrics.mockRejectedValueOnce(new Error(errorMessage));
      await expect(integration.handleCrash(crash))
        .rejects.toThrow(errorMessage);
    });
  });
});