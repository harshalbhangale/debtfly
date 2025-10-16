import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // For Next.js, use cookies or localStorage depending on your auth strategy
    // Using localStorage for now (similar to claimtech-multitenant)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refresh_token');
          
          if (!refreshToken) {
            // No refresh token, redirect to login
            // window.location.href = '/login';
            return Promise.reject(error);
          }
          
          // Call your token refresh endpoint
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          
          // Store the new tokens
          const { access_token, refresh_token } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Update Authorization header and retry request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    // If not a 401 error or already retried, just reject the error
    return Promise.reject(error);
  }
);



export default api;

