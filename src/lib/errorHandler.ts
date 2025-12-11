import { logger } from './logger';

/**
 * Standardized error object shape for consistent error handling across the application
 */
export type HandledError = {
  /** Human-readable error message */
  message: string;
  /** Machine-readable error code for programmatic handling */
  code: string;
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Original error object for debugging purposes */
  raw?: unknown;
};

/**
 * Base application error class with structured error information
 * Extends the native Error class with additional properties for better error handling
 */
export class AppError extends Error {
  /**
   * Creates a new AppError instance
   * @param message - Human-readable error description
   * @param code - Machine-readable error code
   * @param statusCode - HTTP status code (optional)
   */
  constructor(
    public message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error class for validation failures (400 Bad Request)
 * Used when user input fails validation rules
 */
export class ValidationError extends AppError {
  /**
   * Creates a new ValidationError instance
   * @param message - Description of the validation failure
   */
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

/**
 * Error class for network-related failures
 * Used when network requests fail due to connectivity issues
 */
export class NetworkError extends AppError {
  /**
   * Creates a new NetworkError instance
   * @param message - Network error description (defaults to generic network error message)
   */
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, 'NETWORK_ERROR', 0);
  }
}

/**
 * Error class for authentication failures (401 Unauthorized)
 * Used when user authentication is required or has failed
 */
export class AuthenticationError extends AppError {
  /**
   * Creates a new AuthenticationError instance
   * @param message - Authentication error description (defaults to generic auth message)
   */
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}

/** Default error message used when no specific message is available */
const DEFAULT_MESSAGE = 'An unexpected error occurred';

/**
 * Maps HTTP status codes to machine-readable error codes
 * @param statusCode - HTTP status code to map
 * @returns Corresponding error code string
 */
const mapStatusToCode = (statusCode?: number) => {
  if (!statusCode) return 'ERROR';
  if (statusCode === 401) return 'AUTH_ERROR';
  if (statusCode === 403) return 'FORBIDDEN';
  if (statusCode === 404) return 'NOT_FOUND';
  if (statusCode >= 500) return 'SERVER_ERROR';
  return 'BAD_REQUEST';
};

/**
 * Safely parses JSON from a Response object without throwing errors
 * Returns null if the response body is empty or contains invalid JSON
 * @param response - Fetch API Response object to parse
 * @returns Parsed JSON data or null if parsing fails
 */
export const safeParseJSON = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

/**
 * Derives a consistent error object from a fetch Response and optional parsed body
 * Extracts status code, message, and error code from the response
 * @param response - Fetch API Response object
 * @param payload - Optional parsed response body containing error details
 * @returns Standardized HandledError object
 */
export const deriveResponseError = (
  response: Response,
  payload?: { message?: string; code?: string }
): HandledError => {
  const statusCode = response.status;
  const message =
    payload?.message ||
    response.statusText ||
    (response.ok ? 'Request failed' : DEFAULT_MESSAGE);

  return {
    message,
    code: payload?.code || mapStatusToCode(statusCode),
    statusCode,
    raw: payload,
  };
};

/**
 * Normalizes any unknown error into a consistent, UI-friendly HandledError object
 * Handles AppError instances, network errors, generic Error objects, and unknown types
 * Logs errors to console in development mode for debugging
 * @param error - Any error value to normalize
 * @param fallbackMessage - Message to use when error has no message (defaults to generic error message)
 * @returns Standardized HandledError object safe for UI display
 */
export function handleError(
  error: unknown,
  fallbackMessage: string = DEFAULT_MESSAGE
): HandledError {
  
  // Log non-AppError exceptions in development for debugging
  if (import.meta.env.DEV && !(error instanceof AppError)) {
    logger.error('Captured error in handleError:', error);
  }

  // Return structured AppError as-is
  if (error instanceof AppError) {
    return { message: error.message, code: error.code, statusCode: error.statusCode, raw: error };
  }

  // Detect and handle network/fetch errors
  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    const networkError = new NetworkError();
    return { message: networkError.message, code: networkError.code, statusCode: networkError.statusCode, raw: error };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return { message: error.message || fallbackMessage, code: 'ERROR', raw: error };
  }

  // Handle unknown error types
  return { message: fallbackMessage, code: 'UNKNOWN_ERROR', raw: error };
}