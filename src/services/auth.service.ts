const API_URL = import.meta.env.VITE_API_URL;

export interface AuthToken {
  token: string;
  expiresAt: number;
  user: {
    id: string;
  };
}

export interface ApiResponse<T = any> {
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
      console.error('Error storing authentication token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving authentication token:', error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing authentication token:', error);
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

  async authenticatedRequest<T = any>(
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

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const result = await response.json();

      return {
        success: response.ok,
        data: result,
        message: result.message || (response.ok ? 'Request successful' : 'Request failed'),
        status: response.status
      };
    } catch (error) {
      console.error('Authenticated request error:', error);
      return {
        success: false,
        message: `Failed to connect to server at ${API_URL}`,
        status: 0
      };
    }
  }

  async register(registerData: RegisterData): Promise<{ success: boolean; message: string; }> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const result = await response.json();

      return {
        success: response.ok,
        message: result.message || (response.ok ? 'Registration successful' : 'Registration failed'),
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: `Failed to connect to server at ${API_URL}`,
      };
    }
  } 

  async login(loginData: LoginData): Promise<{ success: boolean; message: string; token?: string; }> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      return {
        success: response.ok,
        message: result.message || (response.ok ? 'Login successful' : 'Login failed'),
        token: result.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: `Failed to connect to server at ${API_URL}`,
      };
    }
  } 
}

export const authService = new AuthService();