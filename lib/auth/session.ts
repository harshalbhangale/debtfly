import { getUser, clearUser, isAuthenticated } from '../storage/user';
import { isOnboardingComplete } from '../storage/onboarding';

export interface Session {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
}

export function getSession(): Session {
  const user = getUser();
  const authenticated = isAuthenticated();
  const onboardingComplete = isOnboardingComplete();
  
  return {
    user: user ? {
      id: user.id || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
    } : null,
    isAuthenticated: authenticated,
    onboardingComplete,
  };
}

export function logout(): void {
  clearUser();
  
  // Redirect to home page
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

export function requireAuth(): boolean {
  const session = getSession();
  
  if (!session.isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }
  
  return true;
}

export function requireOnboarding(): boolean {
  const session = getSession();
  
  if (session.isAuthenticated && !session.onboardingComplete) {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Only redirect if not already on an onboarding page
      if (!currentPath.includes('/qualifying') && 
          !currentPath.includes('/identity') &&
          !currentPath.includes('/signature') &&
          !currentPath.includes('/debts') &&
          !currentPath.includes('/plan') &&
          !currentPath.includes('/payment')) {
        window.location.href = '/qualifying';
      }
    }
    return false;
  }
  
  return true;
}



