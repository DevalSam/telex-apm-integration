import { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from './utils/logger.js';
import { 
  APMConfigSchema,
  type MetricsData,
} from './types/schemas.js';
import { 
  APMError, 
  ConfigurationError, 
  ValidationError 
} from './types/errors.js';

// Export types and schemas
export * from './types/schemas.js';
export * from './types/errors.js';

// Export service implementations
export { APMIntegration } from './services/apm-integration.js';
export { MetricsAggregator } from './services/metrics-aggregator.js';
export { SettingsHandler, type APMSettings } from './services/settings-handler.js';

interface HealthCheckResponse {
  status: 'operational' | 'degraded' | 'down';
  version: string;
  timestamp: string;
  environment: string;
}

interface MetricsResponse {
  success: boolean;
  timestamp: string;
  metrics: MetricsData[];
}

/**
 * Handler for APM integration endpoints
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  try {
    logger.info('Request received', {
      method: req.method,
      path: req.url,
      query: req.query,
      contentType: req.headers['content-type'],
    });

    // Validate request method
    const method = req.method?.toUpperCase();
    if (!method || !['GET', 'POST', 'PUT'].includes(method)) {
      return res.status(405).json({
        error: 'Method Not Allowed',
        allowedMethods: ['GET', 'POST', 'PUT'],
      });
    }

    // Route request to appropriate handler
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      default:
        return res.status(405).json({
          error: 'Method Not Allowed',
          allowedMethods: ['GET', 'POST', 'PUT'],
        });
    }
  } catch (err) {
    return handleError(err, res);
  }
}

/**
 * Handles GET requests - health checks and metrics retrieval
 */
async function handleGet(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  const path = new URL(req.url!, `http://${req.headers.host}`).pathname;

  switch (path) {
    case '/health': {
      const healthCheck: HealthCheckResponse = {
        status: 'operational',
        version: process.env.npm_package_version ?? 'unknown',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? 'development'
      };
      return res.status(200).json(healthCheck);
    }

    case '/metrics': {
      const metrics: MetricsResponse = {
        success: true,
        timestamp: new Date().toISOString(),
        metrics: [] // To be implemented with actual metrics gathering
      };
      return res.status(200).json(metrics);
    }

    default:
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
      });
  }
}

/**
 * Handles POST requests - submitting metrics and crash reports
 */
async function handlePost(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  const { body } = req;
  const path = new URL(req.url!, `http://${req.headers.host}`).pathname;

  // Validate incoming configuration if present
  if (body?.config) {
    try {
      await APMConfigSchema.parseAsync(body.config);
      logger.debug('Configuration validated');
    } catch (err) {
      if (err instanceof Error) {
        throw new ValidationError(err.message);
      }
      throw new ValidationError('Invalid configuration provided');
    }
  }

  switch (path) {
    case '/metrics':
      return res.status(200).json({
        success: true,
        message: 'Metrics received',
        timestamp: new Date().toISOString()
      });

    case '/crash-report':
      return res.status(200).json({
        success: true,
        message: 'Crash report received',
        timestamp: new Date().toISOString()
      });

    default:
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
      });
  }
}

/**
 * Handles PUT requests - updating configuration and settings
 */
async function handlePut(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  const { body } = req;
  const path = new URL(req.url!, `http://${req.headers.host}`).pathname;

  if (path === '/config') {
    try {
      await APMConfigSchema.parseAsync(body);
      return res.status(200).json({
        success: true,
        message: 'Configuration updated',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new ConfigurationError(err.message);
      }
      throw new ConfigurationError('Invalid configuration format');
    }
  }

  return res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
}

/**
 * Centralized error handling with improved type safety
 */
function handleError(err: unknown, res: VercelResponse): VercelResponse {
  // Type guard for Error instances
  if (err instanceof Error) {
    logger.error('Error in handler', { 
      name: err.name,
      message: err.message,
      stack: err.stack
    });

    // Handle specific error types
    if (err instanceof ConfigurationError) {
      return res.status(400).json({
        error: 'Configuration Error',
        message: err.message,
        code: err.code
      });
    }

    if (err instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
        code: err.code
      });
    }

    if (err instanceof APMError) {
      return res.status(400).json({
        error: 'APM Error',
        message: err.message,
        code: err.code
      });
    }
  }

  // Handle unknown errors
  logger.error('Unknown error in handler', { error: String(err) });
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
}