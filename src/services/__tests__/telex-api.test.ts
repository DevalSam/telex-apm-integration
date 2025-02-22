import axios from 'axios';
import { TelexAPI } from '../telex-api.js';

// Properly mock axios
jest.mock('axios');

describe('TelexAPI', () => {
  let api: TelexAPI;
  const mockOrgId = 'test-org-id';
  const mockToken = 'test-token';

  beforeEach(() => {
    api = new TelexAPI(mockOrgId, mockToken);
    jest.clearAllMocks();
  });

  describe('sendMetricsMessage', () => {
    test('sends metrics successfully', async () => {
      const mockMetrics = {
        platform: 'flutter',
        metrics: { memory: 50, cpu: 30 }
      };

      (axios as jest.MockedFunction<typeof axios>)
        .mockResolvedValueOnce({ data: { status: 'success' } });

      await api.sendMetricsMessage('channel-id', mockMetrics);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/channels/channel-id/messages'),
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`
          })
        })
      );
    });

    test('handles API errors with error message', async () => {
      (axios as jest.MockedFunction<typeof axios>)
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(api.sendMetricsMessage('channel-id', {}))
        .rejects.toThrow('API Error');
    });

    test('handles API errors without message', async () => {
      (axios as jest.MockedFunction<typeof axios>)
        .mockRejectedValueOnce({ custom: 'error' });

      await expect(api.sendMetricsMessage('channel-id', {}))
        .rejects.toThrow();
    });
  });

  describe('sendCrashAlert', () => {
    test('sends crash alert successfully', async () => {
      const mockCrash = {
        platform: 'flutter',
        error: 'Test error'
      };

      (axios as jest.MockedFunction<typeof axios>)
        .mockResolvedValueOnce({ data: { status: 'success' } });

      await api.sendCrashAlert('channel-id', mockCrash);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/channels/channel-id/messages')
        })
      );
    });

    test('handles network errors', async () => {
      (axios as jest.MockedFunction<typeof axios>)
        .mockRejectedValueOnce(new Error('Network Error'));

      await expect(api.sendCrashAlert('channel-id', {}))
        .rejects.toThrow('Network Error');
    });
  });

  describe('updateIntegrationSettings', () => {
    test('updates settings successfully', async () => {
      const settings = { key: 'value' };
      
      (axios as jest.MockedFunction<typeof axios>)
        .mockResolvedValueOnce({ data: { status: 'success' } });

      await api.updateIntegrationSettings('integration-id', settings);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: expect.stringContaining('/integrations/integration-id/settings'),
          data: settings
        })
      );
    });

    test('handles validation errors', async () => {
      (axios as jest.MockedFunction<typeof axios>)
        .mockRejectedValueOnce(new Error('Validation Error'));

      await expect(api.updateIntegrationSettings('integration-id', {}))
        .rejects.toThrow('Validation Error');
    });
  });
});