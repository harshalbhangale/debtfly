// lib/types/auth.ts
// Authentication related types

/**
 * Token pair
 */
export interface TokenPair {
  access: string;
  refresh: string;
}

/**
 * Login credentials
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: string;
}

/**
 * User basic info
 */
export interface UserInfo {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Auth state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  access_token: string | null;
  refresh_token: string | null;
}

