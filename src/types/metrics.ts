// src/types/metrics.ts
export interface MetricsData {
  platform: string;
  timestamp: number;
  metrics: Record<string, unknown>;
}

// src/services/apm-integration.ts
import { MetricsData } from '../types/metrics';

export function sendMetricsData(data: MetricsData) {
  // Implementation
}

// Example of correct usage:
const data: MetricsData = {
  platform: 'web',
  timestamp: Date.now(),
  metrics: {}
};

// src/services/settings-handler.ts
export class SettingsHandler {
  private settings: Record<string, unknown>;

  constructor() {
    this.settings = {}; // Initialize in constructor
  }
}

// src/utils/__tests__/validation.test.ts
interface TestData {
  optionalField?: string; // Make the field optional
  requiredField: string;
}

describe('validation', () => {
  it('should handle property deletion', () => {
    const data: TestData = {
      optionalField: 'test',
      requiredField: 'required'
    };
    delete data.optionalField; // Now safe to delete
  });
});
