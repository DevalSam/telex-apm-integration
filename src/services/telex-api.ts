

import axios from 'axios';
import { Logger } from '../utils/logger';

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

  private async makeRequest(method: string, endpoint: string, data?: any) {
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
      if (error instanceof Error) {
        this.logger.error('API request failed:', error.message);
        throw error;
      } else {
        this.logger.error('API request failed:', String(error));
        throw new Error('Unknown API error');
      }
    }
  }

  public async sendMetricsMessage(channelId: string, metrics: any): Promise<void> {
    await this.makeRequest('POST', `/organisations/${this.orgId}/channels/${channelId}/messages`, {
      content: JSON.stringify(metrics, null, 2)
    });
  }

  public async sendCrashAlert(channelId: string, crash: any): Promise<void> {
    await this.makeRequest('POST', `/organisations/${this.orgId}/channels/${channelId}/messages`, {
      content: JSON.stringify(crash, null, 2)
    });
  }

  public async updateIntegrationSettings(integrationId: string, settings: any): Promise<void> {
    await this.makeRequest('PUT', `/organisations/${this.orgId}/integrations/${integrationId}/settings`, settings);
  }
}
