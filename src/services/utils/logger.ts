// File: src/services/utils/logger.ts
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