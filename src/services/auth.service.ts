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
  confirm_password: string
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
    return token !== null;
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
    const response = await this.authenticatedRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });

    return {
      success: response.success,
      message: response.message,
    };
  } 

  async login(loginData: LoginData): Promise<{ success: boolean; message: string; token?: string; }> {
    const response = await this.authenticatedRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });

    return {
      success: response.success,
      message: response.message,
      token: response.data?.token,
    };
  } 
}

export const authService = new AuthService();