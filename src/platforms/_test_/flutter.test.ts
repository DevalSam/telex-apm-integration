
import { FlutterMonitor } from '../flutter';

describe('FlutterMonitor', () => {
  let monitor: FlutterMonitor;

  beforeEach(() => {
    monitor = new FlutterMonitor();
  });

  test('should collect metrics', async () => {
    const metrics = await monitor.collectMetrics();
    
    expect(metrics).toHaveProperty('platform', 'flutter');
    expect(metrics).toHaveProperty('timestamp');
    expect(metrics).toHaveProperty('metrics');
    expect(metrics.metrics).toHaveProperty('memory');
    expect(metrics.metrics).toHaveProperty('cpu');
    expect(metrics.metrics).toHaveProperty('fps');
  });

  test('should handle crashes', async () => {
    const error = new Error('Test error');
    const report = await monitor.handleCrash(error);
    
    expect(report).toHaveProperty('platform', 'flutter');
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('error');
    expect(report).toHaveProperty('stackTrace');
    expect(report).toHaveProperty('deviceInfo');
  });
});
