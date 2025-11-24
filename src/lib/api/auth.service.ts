import axiosInstance from './axios';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'trainee';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    Cookies.set('auth_token', data.token, { expires: 7 });
    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    Cookies.set('auth_token', data.token, { expires: 7 });
    return data;
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      Cookies.remove('auth_token');
    }
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await axiosInstance.get<User>('/auth/me');
    return data;
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('auth_token');
  }
}

export default new AuthService();