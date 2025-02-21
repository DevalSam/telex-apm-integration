# Cross-Platform APM Integration for Telex

Application Performance Monitoring (APM) integration for Telex that supports Flutter, React Native, and .NET MAUI applications.

## Features

- Real-time performance monitoring
- Cross-platform crash reporting
- Automated alerts and notifications
- Platform-specific metrics collection
- Custom alerting thresholds

## Installation

1. Add the integration to your Telex organization:

```bash
# Using the Telex Dashboard
1. Navigate to Integrations > Add New
2. Select "Custom Integration"
3. Enter the JSON URL: [Your hosted JSON URL]
4. Configure the settings as needed
```

2. Configure your channels:
```json
{
  "metrics_channel": "your-metrics-channel-id",
  "alerts_channel": "your-alerts-channel-id"
}
```

3. Enable platforms:
```json
{
  "platforms": {
    "flutter": true,
    "react_native": true,
    "maui": true
  }
}
```

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/telex-integrations/telex-apm-integration.git
cd telex-apm-integration
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific tests
npm run test:platforms
npm run test:services
```

## Deployment

1. Host the integration JSON:
   - Copy `config/integration.json` to a publicly accessible URL
   - Update the URL in your Telex organization settings

2. Configure organization:
   - Create dedicated channels for metrics and alerts
   - Set up platform-specific configurations
   - Configure alerting thresholds

3. Enable monitoring:
   - Start the integration
   - Verify metrics collection
   - Test crash reporting

## Screenshots

[Add screenshots of the integration in action]

## Support

For support, please contact the Telex support team or open an issue in this repository.
