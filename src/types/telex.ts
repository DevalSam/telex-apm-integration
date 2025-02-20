// src/types/telex.ts

export interface TelexMessage {
  channelId: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface TelexConfig {
  apiKey?: string;
  organization: string;
  intervalConfig: {
    performanceCheck: number;
    crashReport: number;
  };
}

// Mock Telex SDK interface
export class TelexClient {
  constructor(config: TelexConfig) {
    // Initialize with config
  }

  async sendMessage(message: TelexMessage): Promise<void> {
    // Mock implementation
    console.log('Sending message to Telex:', message);
  }

  async initialize(): Promise<void> {
    // Mock initialization
    console.log('Initializing Telex client');
  }
}
