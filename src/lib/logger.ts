const isDev = import.meta.env.DEV;

/**
 * Centralized logging utility for the application
 * Provides conditional logging based on environment (development vs production)
 * In production, only errors are logged and can be sent to external services like Sentry
 */
export const logger = {
  /**
   * Logs general information messages (development only)
   * @param args - Values to log
   */
  log: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  /**
   * Logs warning messages (development only)
   * @param args - Values to log as warnings
   */
  warn: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  /**
   * Logs error messages (always logged, even in production)
   * In production, errors can be sent to external monitoring services
   * @param args - Error values to log
   */
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
    
    // Add production logging service (Sentry)
    if (!isDev) {
      // captureException(args[0]);
    }
  },
  /**
   * Logs informational messages (development only)
   * @param args - Values to log as info
   */
  info: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  }
};
