import { AppError, deriveResponseError, handleError, safeParseJSON } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Authentication token structure
 */
export interface AuthToken {
  /** JWT token string */
  token: string;
  /** Token expiration timestamp in milliseconds */
  expiresAt: number;
  /** User information */
  user: {
    /** User ID */
    id: string;
  };
}

/**
 * Generic API response structure
 * @template T - Type of the response data
 */
export interface ApiResponse<T = unknown> {
  /** Indicates if the request was successful */
  success?: boolean;
  /** Response message */
  message: string;
  /** Optional response data */
  data?: T;
}

/**
 * User registration data structure
 */
export interface RegisterData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Password confirmation */
  confirm_password: string;
}

/**
 * User login data structure
 */
export interface LoginData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Whether to remember the user's session */
  remember_me: boolean;
}

/**
 * Service for handling authentication operations
 * Manages token storage, retrieval, and authenticated API requests
 */
class AuthService {
  /** Local storage key for authentication token */
  private readonly TOKEN_KEY = 'authToken';

  /**
   * Stores the authentication token in local storage
   * @param token - JWT token to store
   * @throws {AppError} If token storage fails
   */
  async storeToken(token: string): Promise<void> {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      const handled = handleError(error, 'Failed to store authentication token');
      logger.error('Error storing authentication token:', handled.raw);
      throw new AppError(handled.message, handled.code);
    }
  }

  /**
   * Retrieves the authentication token from local storage
   * @returns The stored token or null if not found or error occurs
   */
  async getToken(): Promise<string | null> {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      const handled = handleError(error, 'Failed to retrieve authentication token');
      logger.error('Error retrieving authentication token:', handled.raw);
      return null;
    }
  }

  /**
   * Removes the authentication token from local storage
   */
  async removeToken(): Promise<void> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      const handled = handleError(error, 'Failed to remove authentication token');
      logger.error('Error removing authentication token:', handled.raw);
    }
  }

  /**
   * Checks if a valid, non-expired token exists
   * @returns True if a valid token exists, false otherwise
   */
  async hasValidToken(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000; 
      return Date.now() < expiration;
    } catch {
      return false;
    }
  }

  /**
   * Makes an authenticated API request with the stored token
   * @template T - Type of the expected response data
   * @param endpoint - API endpoint path (e.g., '/users/profile')
   * @param options - Fetch request options
   * @returns Promise resolving to response with success status, data, message, and HTTP status
   */
  async authenticatedRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message: string; status: number }> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found',
          status: 401
        };
      }

      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetchWithTimeout(
        `${API_URL}${endpoint}`,
        {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
        },
        DEFAULT_TIMEOUT
      );

      const result = await safeParseJSON<T & { message?: string; code?: string }>(response);

      if (!response.ok) {
        const derived = deriveResponseError(response, result || undefined);
        return {
          success: false,
          data: (result === null ? undefined : result) as T | undefined,
          message: derived.message,
          status: derived.statusCode ?? response.status,
        };
      }

      return {
        success: response.ok,
        data: (result === null ? undefined : result) as T | undefined,
        message: result?.message || 'Request successful',
        status: response.status
      };
    } catch (error) {
      const handled = handleError(error, `Failed to connect to server at ${API_URL}`);
      logger.error('Authenticated request error:', handled.raw);
      return {
        success: false,
        message: handled.message,
        status: handled.statusCode ?? 0
      };
    }
  }

  /**
   * Registers a new user account
   * @param registerData - User registration information
   * @returns Promise resolving to success status and message
   */
  async register(registerData: RegisterData): Promise<{ success: boolean; message: string; }> {
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        },
        DEFAULT_TIMEOUT
      );

      const result = await safeParseJSON<{ message?: string; code?: string }>(response);

      if (!response.ok) {
        const derived = deriveResponseError(response, result || undefined);
        return {
          success: false,
          message: derived.message,
        };
      }

      return {
        success: response.ok,
        message: result?.message || 'Registration successful',
      };
    } catch (error) {
      const handled = handleError(error, `Failed to connect to server at ${API_URL}`);
      logger.error('Registration error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  } 

  /**
   * Authenticates a user and returns a JWT token
   * @param loginData - User login credentials
   * @returns Promise resolving to success status, message, and optional token
   */
  async login(loginData: LoginData): Promise<{ success: boolean; message: string; token?: string; }> {
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        },
        DEFAULT_TIMEOUT
      );

      const result = await safeParseJSON<{ message?: string; code?: string; token?: string }>(response);

      if (!response.ok) {
        const derived = deriveResponseError(response, result || undefined);
        return {
          success: false,
          message: derived.message,
        };
      }

      return {
        success: response.ok,
        message: result?.message || 'Login successful',
        token: result?.token,
      };
    } catch (error) {
      const handled = handleError(error, `Failed to connect to server at ${API_URL}`);
      logger.error('Login error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  } 
}

export const authService = new AuthService();