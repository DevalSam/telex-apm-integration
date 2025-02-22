// File: src/services/types.ts
export interface Settings {
    // Basic settings properties
    enabled: boolean;
    environment?: 'development' | 'production' | 'staging';
    apiKey?: string;
    endpoint?: string;
    timeout?: number;
    retryAttempts?: number;
    debug?: boolean;
}

// APM specific settings extending base Settings
export interface APMSettings extends Settings {
    monitored_platforms?: string[] | string;
}

// Settings update payload type
export interface SettingsUpdatePayload {
    key: keyof Settings;
    value: any;
}

// Logger types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Logger interface
export interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}

// Logger implementation
class LoggerImplementation implements Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private formatMessage(level: LogLevel, message: string): string {
        return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}`;
    }

    debug(message: string, ...args: any[]): void {
        console.debug(this.formatMessage('debug', message), ...args);
    }

    info(message: string, ...args: any[]): void {
        console.info(this.formatMessage('info', message), ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(this.formatMessage('warn', message), ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(this.formatMessage('error', message), ...args);
    }
}

// Export a singleton instance
const logger = new LoggerImplementation();
export default logger;