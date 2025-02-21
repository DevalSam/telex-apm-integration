
import { APMIntegration } from '../services/apm-integration';
import { MetricsAggregator } from '../services/metrics-aggregator';
import { createMockMetrics, createMockCrash } from '../test-helpers';

jest.mock('../services/metrics-aggregator');
jest.mock('../utils/logger');

describe('APMIntegration', () => {
  let integration: APMIntegration;
  let mockMetricsAggregator: jest.Mocked<MetricsAggregator>;

  beforeEach(() => {
    mockMetricsAggregator = {
      processMetrics: jest.fn().mockResolvedValue(undefined)
    } as jest.Mocked<MetricsAggregator>;

    (MetricsAggregator as jest.Mock).mockImplementation(() => mockMetricsAggregator);
    integration = new APMIntegration();
  });

  describe('handleMetrics', () => {
    test('processes valid metrics', async () => {
      const metrics = createMockMetrics();
      await expect(integration.handleMetrics(metrics)).resolves.not.toThrow();
    });

    test('handles null metrics', async () => {
      await expect(integration.handleMetrics(null as any))
        .rejects.toThrow('Invalid metrics data');
    });

    test('handles processing errors', async () => {
      const metrics = createMockMetrics();
      mockMetricsAggregator.processMetrics.mockRejectedValueOnce(new Error('Processing failed'));
      await expect(integration.handleMetrics(metrics))
        .rejects.toThrow('Processing failed');
    });
  });

  describe('handleCrash', () => {
    test('processes valid crash report', async () => {
      const crash = createMockCrash();
      await expect(integration.handleCrash(crash)).resolves.not.toThrow();
    });

    test('handles null crash report', async () => {
      await expect(integration.handleCrash(null as any))
        .rejects.toThrow('Invalid crash report');
    });

    test('handles processing errors', async () => {
      const crash = createMockCrash();
      mockMetricsAggregator.processMetrics.mockRejectedValueOnce(new Error('Processing failed'));
      await expect(integration.handleCrash(crash))
        .rejects.toThrow('Processing failed');
    });
  });
});
