// lib/api/services/auth.ts
import api from '../index';
import type { LoginData, LoginResponse } from '@/lib/types';

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    console.log('Logging in user:', loginData.email);
    
    const response = await api.post('/api/v1/auth/login/', loginData);
    
    const { access, refresh, user_id } = response.data;
    
    // Store tokens in localStorage (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_id', user_id);
    }
    
    console.log('User logged in successfully:', { user_id });

    return response.data;
  } catch (error) {
    console.error('Failed to login user:', error);
    throw error;
  }
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  }
};

