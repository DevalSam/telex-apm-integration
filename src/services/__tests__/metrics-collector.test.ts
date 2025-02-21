

import { MetricsCollector } from '../metrics-collector';
import { FlutterMonitor } from '../../platforms/flutter';
import { Logger } from '../../utils/logger';

// Mock the Logger
jest.mock('../../utils/logger');

describe('MetricsCollector', () => {
  let collector: MetricsCollector;
  let mockMonitor: jest.Mocked<FlutterMonitor>;
  let mockLogger: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    
    // Create mock monitor
    mockMonitor = {
      collectMetrics: jest.fn().mockResolvedValue({
        platform: 'flutter',
        timestamp: Date.now(),
        metrics: {
          memory: 50,
          cpu: 30,
          fps: 60,
          frameTime: 16.67
        }
      }),
      handleCrash: jest.fn()
    } as any;

    // Mock logger
    mockLogger = jest.fn();
    (Logger as jest.Mock).mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }));

    collector = new MetricsCollector();
  });

  afterEach(() => {
    collector.stopAllCollections();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should start collecting metrics at specified interval', async () => {
    collector.startCollection('flutter', mockMonitor, 5000);
    
    expect(mockMonitor.collectMetrics).not.toHaveBeenCalled();
    
    // Advance time and wait for promises
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    expect(mockMonitor.collectMetrics).toHaveBeenCalledTimes(1);
  });

  test('should handle collection errors gracefully', async () => {
    const mockError = new Error('Collection failed');
    mockMonitor.collectMetrics.mockRejectedValueOnce(mockError);
    
    collector.startCollection('flutter', mockMonitor, 5000);
    
    // Advance time and wait for promises
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    await Promise.resolve(); // Additional tick for error handling
    
    expect(mockMonitor.collectMetrics).toHaveBeenCalled();
  });

  test('should stop collection for specific platform', async () => {
    collector.startCollection('flutter', mockMonitor, 5000);
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    collector.stopCollection('flutter');
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    expect(mockMonitor.collectMetrics).toHaveBeenCalledTimes(1);
  });

  test('should stop all collections', async () => {
    collector.startCollection('flutter', mockMonitor, 5000);
    collector.startCollection('react-native', mockMonitor, 5000);
    
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    collector.stopAllCollections();
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    expect(mockMonitor.collectMetrics).toHaveBeenCalledTimes(2);
  });
});
