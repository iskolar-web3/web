import { logger } from './logger';

export type HandledError = {
  message: string;
  code: string;
  statusCode?: number;
  raw?: unknown;
};

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, 'NETWORK_ERROR', 0);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}

const DEFAULT_MESSAGE = 'An unexpected error occurred';

const mapStatusToCode = (statusCode?: number) => {
  if (!statusCode) return 'ERROR';
  if (statusCode === 401) return 'AUTH_ERROR';
  if (statusCode === 403) return 'FORBIDDEN';
  if (statusCode === 404) return 'NOT_FOUND';
  if (statusCode >= 500) return 'SERVER_ERROR';
  return 'BAD_REQUEST';
};

/**
 * Parse JSON responses without throwing when the body is empty or malformed.
 */
export const safeParseJSON = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

/**
 * Derive a consistent error shape from a fetch Response + optional parsed body.
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
 * Normalize any unknown error into a consistent, UI-friendly object.
 * Optionally provide a fallback message to keep UX messaging intentional.
 */
export function handleError(
  error: unknown,
  fallbackMessage: string = DEFAULT_MESSAGE
): HandledError {
  
  if (import.meta.env.DEV && !(error instanceof AppError)) {
    logger.error('Captured error in handleError:', error);
  }

  if (error instanceof AppError) {
    return { message: error.message, code: error.code, statusCode: error.statusCode, raw: error };
  }

  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    const networkError = new NetworkError();
    return { message: networkError.message, code: networkError.code, statusCode: networkError.statusCode, raw: error };
  }

  if (error instanceof Error) {
    return { message: error.message || fallbackMessage, code: 'ERROR', raw: error };
  }

  return { message: fallbackMessage, code: 'UNKNOWN_ERROR', raw: error };
}