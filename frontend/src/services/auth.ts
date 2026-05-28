import api from './api';
import type { User } from '../stores/userStore';

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export const authService = {
  // Login
  login: (data: LoginRequest) => {
    return api.post<AuthResponse>('/auth/login/', data);
  },

  // Register
  register: (data: RegisterRequest) => {
    return api.post<AuthResponse>('/auth/register/', data);
  },

  // Refresh token
  refreshToken: (refresh: string) => {
    return api.post<TokenResponse>('/auth/refresh/', { refresh });
  },

  // Get current user profile
  getProfile: () => {
    return api.get<User>('/users/me/');
  },

  // Update profile
  updateProfile: (data: Partial<User>) => {
    return api.put<User>('/users/me/', data);
  },

  // Change password
  changePassword: (data: { old_password: string; new_password: string }) => {
    return api.post('/users/me/change-password/', data);
  },

  // Request password reset
  requestPasswordReset: (email: string) => {
    return api.post('/auth/password/reset/', { email });
  },

  // Confirm password reset
  confirmPasswordReset: (data: { token: string; new_password: string }) => {
    return api.post('/auth/password/reset/confirm/', data);
  },

  // Verify email
  verifyEmail: (key: string) => {
    return api.post('/auth/email/verify/', { key });
  },
};

export default authService;
