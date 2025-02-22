import { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from './utils/logger.js';
import { APMConfigSchema } from './types.js';

// Export types and classes for external use
export * from './types.js';
export { APMIntegration } from './services/apm-integration.js';
export { MetricsAggregator } from './services/metrics-aggregator.js';
export { SettingsHandler, type APMSettings } from './services/settings-handler.js';
export { ValidationError } from './utils/validation.js';

// Default export for Vercel function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    logger.info('Request received', {
      method: req.method,
      url: req.url,
      query: req.query,
    });

    // Validate incoming configuration if present
    if (req.body?.config) {
      const config = APMConfigSchema.parse(req.body.config);
      logger.debug('Validated configuration', { config });
    }

    // Handle different HTTP methods
    switch (req.method?.toUpperCase()) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        return res.status(405).json({
          error: 'Method Not Allowed',
          allowedMethods: ['GET', 'POST'],
        });
    }
  } catch (error) {
    logger.error('Error in handler', { error });
    
    // Handle known error types
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.message,
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  // Add your GET endpoint logic here
  res.status(200).json({
    message: 'APM Integration Service',
    status: 'operational',
    version: process.env.npm_package_version,
  });
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  // Add your POST endpoint logic here
  const { body } = req;
  
  // Implement your POST handling logic
  res.status(200).json({
    message: 'Data received successfully',
    timestamp: new Date().toISOString(),
  });
}