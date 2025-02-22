import axios from 'axios';
import { Logger } from '../utils/logger.js';

interface MetricsData {
  [key: string]: unknown;
}

interface CrashData {
  [key: string]: unknown;
}

interface IntegrationSettings {
  [key: string]: unknown;
}

export class TelexAPI {
  private baseUrl: string;
  private orgId: string;
  private authToken: string;
  private logger: Logger;

  constructor(orgId: string, authToken: string) {
    this.baseUrl = 'https://api.telex.im';
    this.orgId = orgId;
    this.authToken = authToken;
    this.logger = new Logger('TelexAPI');
  }

  private async makeRequest<T>(method: string, endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        data
      });
      return response.data;
    } catch (error) {
      this.logger.error('API request failed:', {
        message: error instanceof Error ? error.message : String(error),
        context: {
          endpoint,
          method
        }
      });
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown API error');
      }
    }
  }

  public async sendMetricsMessage(channelId: string, metrics: MetricsData): Promise<void> {
    await this.makeRequest<void>('POST', `/organisations/${this.orgId}/channels/${channelId}/messages`, {
      content: JSON.stringify(metrics, null, 2)
    });
  }

  public async sendCrashAlert(channelId: string, crash: CrashData): Promise<void> {
    await this.makeRequest<void>('POST', `/organisations/${this.orgId}/channels/${channelId}/messages`, {
      content: JSON.stringify(crash, null, 2)
    });
  }

  public async updateIntegrationSettings(integrationId: string, settings: IntegrationSettings): Promise<void> {
    await this.makeRequest<void>('PUT', `/organisations/${this.orgId}/integrations/${integrationId}/settings`, settings);
  }
}