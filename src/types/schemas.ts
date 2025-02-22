import { z } from 'zod';

// Base configuration schema
export const APMConfigSchema = z.object({
  serviceName: z.string(),
  environment: z.enum(['development', 'staging', 'production']),
  version: z.string(),
  enabled: z.boolean().default(true),
  samplingRate: z.number().min(0).max(1).default(1),
});

// Metrics data schema
export const MetricsDataSchema = z.object({
  timestamp: z.number(),
  name: z.string(),
  value: z.number(),
  tags: z.record(z.string()).optional(),
  unit: z.string().optional(),
});

// Crash report schema
export const CrashReportSchema = z.object({
  timestamp: z.number(),
  error: z.object({
    name: z.string(),
    message: z.string(),
    stack: z.string().optional(),
  }),
  metadata: z.record(z.unknown()).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});

// Export types
export type APMConfig = z.infer<typeof APMConfigSchema>;
export type MetricsData = z.infer<typeof MetricsDataSchema>;
export type CrashReport = z.infer<typeof CrashReportSchema>;