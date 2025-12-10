import { AppError, deriveResponseError, handleError, safeParseJSON } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT = 10000; // 10 seconds

export interface AuthToken {
  token: string;
  expiresAt: number;
  user: {
    id: string;
  };
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message: string;
  data?: T;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginData {
  email: string;
  password: string;
  remember_me: boolean;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';

  async storeToken(token: string): Promise<void> {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      const handled = handleError(error, 'Failed to store authentication token');
      logger.error('Error storing authentication token:', handled.raw);
      throw new AppError(handled.message, handled.code);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      const handled = handleError(error, 'Failed to retrieve authentication token');
      logger.error('Error retrieving authentication token:', handled.raw);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      const handled = handleError(error, 'Failed to remove authentication token');
      logger.error('Error removing authentication token:', handled.raw);
    }
  }

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