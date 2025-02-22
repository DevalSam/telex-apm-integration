import handler from '../index.js';
import { createMockMetrics, createMockCrash } from './helpers/test-helpers.js';
import { logger } from '../utils/logger.js';

// Create mock implementations
const mockRecordMetrics = jest.fn().mockResolvedValue(undefined);
const mockRecordCrash = jest.fn().mockResolvedValue(undefined);
const mockProcessMetrics = jest.fn().mockResolvedValue(undefined);
const mockGetMetricsHistory = jest.fn().mockResolvedValue([]);

// Mock the logger
jest.mock('../utils/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock the services
jest.mock('../services/apm-integration.js', () => ({
  APMIntegration: jest.fn().mockImplementation(() => ({
    handleMetrics: mockRecordMetrics,
    handleCrash: mockRecordCrash,
  })),
}));

jest.mock('../services/metrics-aggregator.js', () => ({
  MetricsAggregator: jest.fn().mockImplementation(() => ({
    processMetrics: mockProcessMetrics,
    getMetricsHistory: mockGetMetricsHistory,
    clearHistory: jest.fn(),
    setHistoryLimit: jest.fn(),
  })),
}));

describe('API Handler', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      method: 'GET',
      url: '/health',
      headers: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('GET /health', () => {
    it('returns operational status', async () => {
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'operational',
          version: expect.any(String),
        })
      );
    });
  });

  describe('POST /metrics', () => {
    beforeEach(() => {
      req.method = 'POST';
      req.url = '/metrics';
    });

    it('processes metrics data correctly', async () => {
      const metrics = createMockMetrics();
      req.body = metrics;

      await handler(req, res);

      expect(mockProcessMetrics).toHaveBeenCalledWith(expect.objectContaining(metrics));
      expect(mockRecordMetrics).toHaveBeenCalledWith(expect.objectContaining(metrics));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(logger.info).toHaveBeenCalled();
    });

    it('handles metrics processing errors', async () => {
      const metrics = createMockMetrics();
      req.body = metrics;

      const error = new Error('Processing failed');
      mockProcessMetrics.mockRejectedValueOnce(error);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error processing metrics'),
        expect.objectContaining({ error })
      );
    });
  });

  describe('POST /crash-report', () => {
    beforeEach(() => {
      req.method = 'POST';
      req.url = '/crash-report';
    });

    it('processes crash reports correctly', async () => {
      const crash = createMockCrash();
      req.body = crash;

      await handler(req, res);

      expect(mockRecordCrash).toHaveBeenCalledWith(expect.objectContaining(crash));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(logger.info).toHaveBeenCalled();
    });

    it('handles crash report processing errors', async () => {
      const crash = createMockCrash();
      req.body = crash;

      const error = new Error('Processing failed');
      mockRecordCrash.mockRejectedValueOnce(error);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error processing crash report'),
        expect.objectContaining({ error })
      );
    });
  });

  describe('Error Handling', () => {
    it('handles validation errors correctly', async () => {
      req.method = 'POST';
      req.url = '/metrics';
      req.body = { invalid: 'data' };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
      expect(logger.error).toHaveBeenCalled();
    });

    it('handles unknown endpoints correctly', async () => {
      req.url = '/unknown';

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Not Found',
        })
      );
    });

    it('handles method not allowed correctly', async () => {
      req.method = 'PUT';
      req.url = '/metrics';

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Method Not Allowed',
          allowedMethods: expect.any(Array),
        })
      );
    });
  });
});