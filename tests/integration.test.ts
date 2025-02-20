// tests/integration.test.ts
describe('APM Integration', () => {
  let integration: APMIntegration;

  beforeEach(() => {
    integration = new APMIntegration(mockConfig);
  });

  test('metrics collection', async () => {
    const metrics = await integration.collectMetrics();
    expect(metrics).toBeDefined();
    expect(metrics.platforms.length).toBeGreaterThan(0);
  });

  test('crash handling', async () => {
    const crash = mockCrashReport();
    await integration.handleCrash(crash);
    expect(alertManager.lastAlert).toBeDefined();
  });
});
