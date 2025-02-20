
import { APMIntegration } from '../src';
import { APMConfig } from '../src/types';

async function main() {
  // Configuration
  const config: APMConfig = {
    organization: 'test-org',
    platforms: {
      flutter: true,
      reactNative: false,
      maui: false
    },
    intervals: {
      performanceCheck: 300, // 5 minutes
      crashReport: 60 // 1 minute
    }
  };

  // Initialize integration
  const apmIntegration = new APMIntegration(config);

  // Simulate some activity
  setTimeout(async () => {
    try {
      // Simulate a crash
      throw new Error('Test crash');
    } catch (error) {
      if (error instanceof Error) {
        await apmIntegration.handleCrash(error);
      }
    }
  }, 2000);
}

main().catch(console.error);
