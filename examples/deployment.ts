// examples/deployment.ts

import { APMIntegration } from '../src';
import { FlutterMonitor } from '../src/platforms/flutter';

async function main() {
  // Initialize integration
  const integration = new APMIntegration();
  await integration.initialize();

  // Set up Flutter monitoring
  const flutterMonitor = new FlutterMonitor();
  
  // Start collecting metrics
  setInterval(async () => {
    try {
      const metrics = await flutterMonitor.collectMetrics();
      await integration.handleMetrics(metrics);
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  // Set up crash handling
  process.on('uncaughtException', async (error) => {
    try {
      await integration.handleCrash({
        platform: 'flutter',
        timestamp: Date.now(),
        error: error.message,
        stackTrace: error.stack,
        deviceInfo: {
          os: process.platform,
          version: process.version,
          device: 'example'
        }
      });
    } catch (e) {
      console.error('Error handling crash:', e);
    }
  });
}

main().catch(console.error);
