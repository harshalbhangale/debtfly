import type { User } from '../mock-data/types';

const USER_KEY = 'debtfly_user';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function saveUser(user: Partial<User>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getUser();
    const updated = { ...existing, ...user };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

export function getUser(): Partial<User> | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
}

export function updateUser(updates: Partial<User>): void {
  saveUser(updates);
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const user = getUser();
    return !!(token && user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error setting tokens:', error);
  }
}



