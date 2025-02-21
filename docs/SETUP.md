# Setup Guide

## Prerequisites

- Node.js 16.x or later
- Access to a Telex organization
- Channel creation permissions
- Integration management permissions

## Installation Steps

1. **Create Required Channels**

Create two dedicated channels in your Telex organization:
- Metrics Channel: For performance metrics
- Alerts Channel: For crash reports and alerts

2. **Host Integration JSON**

The integration.json file needs to be hosted at a publicly accessible URL. Options include:
- GitHub Pages
- AWS S3
- Any static file hosting service

3. **Configure Integration**

In your Telex organization:
1. Go to Integrations > Add New
2. Select "Custom Integration"
3. Enter the hosted JSON URL
4. Configure the settings:
   ```json
   {
     "organization_id": "your-org-id",
     "metrics_channel": "your-metrics-channel-id",
     "alerts_channel": "your-alerts-channel-id",
     "platforms": {
       "flutter": true,
       "react_native": true,
       "maui": true
     }
   }
   ```

4. **Verify Installation**

After installation:
1. Check metrics channel for incoming data
2. Verify crash reporting by triggering a test crash
3. Confirm alert notifications are working

## Troubleshooting

Common issues and solutions:

1. **No Metrics Data**
   - Verify channel IDs
   - Check platform configurations
   - Ensure correct permissions

2. **Missing Crash Reports**
   - Verify error handling setup
   - Check alert channel configuration
   - Confirm crash detection is working

3. **Integration Not Working**
   - Verify JSON URL is accessible
   - Check organization permissions
   - Validate configuration settings
