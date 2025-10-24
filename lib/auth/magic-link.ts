// Mock magic link authentication

import { setTokens } from '../storage/user';

const MAGIC_TOKEN_KEY = 'debtfly_magic_token';
const MAGIC_EMAIL_KEY = 'debtfly_magic_email';

export interface MagicLinkToken {
  token: string;
  email: string;
  expiresAt: Date;
}

// Generate a mock magic link token
export function generateMagicLink(email: string): string {
  if (typeof window === 'undefined') return '';
  
  const token = generateRandomToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour
  
  const magicToken: MagicLinkToken = {
    token,
    email,
    expiresAt,
  };
  
  // Store token for verification
  localStorage.setItem(MAGIC_TOKEN_KEY, JSON.stringify(magicToken));
  localStorage.setItem(MAGIC_EMAIL_KEY, email);
  
  // In a real app, this would be sent via email
  // For now, we return a URL that can be used in the browser
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/verify?token=${token}`;
}

// Verify magic link token
export function verifyMagicLinkToken(token: string): {
  valid: boolean;
  email?: string;
  error?: string;
} {
  if (typeof window === 'undefined') {
    return { valid: false, error: 'Not in browser environment' };
  }
  
  try {
    const storedData = localStorage.getItem(MAGIC_TOKEN_KEY);
    if (!storedData) {
      return { valid: false, error: 'No token found' };
    }
    
    const magicToken: MagicLinkToken = JSON.parse(storedData);
    
    // Check if token matches
    if (magicToken.token !== token) {
      return { valid: false, error: 'Invalid token' };
    }
    
    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(magicToken.expiresAt);
    if (now > expiresAt) {
      localStorage.removeItem(MAGIC_TOKEN_KEY);
      localStorage.removeItem(MAGIC_EMAIL_KEY);
      return { valid: false, error: 'Token expired' };
    }
    
    // Token is valid - create mock access/refresh tokens
    const accessToken = generateRandomToken();
    const refreshToken = generateRandomToken();
    setTokens(accessToken, refreshToken);
    
    // Clear magic token (one-time use)
    localStorage.removeItem(MAGIC_TOKEN_KEY);
    localStorage.removeItem(MAGIC_EMAIL_KEY);
    
    return {
      valid: true,
      email: magicToken.email,
    };
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return { valid: false, error: 'Verification failed' };
  }
}

// Check if there's a pending magic link email
export function getPendingMagicLinkEmail(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(MAGIC_EMAIL_KEY);
  } catch (error) {
    console.error('Error getting pending email:', error);
    return null;
  }
}

// Generate a random token
function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Mock function to simulate sending email
export async function sendMagicLinkEmail(email: string): Promise<{
  success: boolean;
  magicLink?: string;
  error?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const magicLink = generateMagicLink(email);
    
    // In a real app, this would send an email
    console.log('🔗 Magic Link (for testing):', magicLink);
    console.log('📧 Email would be sent to:', email);
    
    return {
      success: true,
      magicLink, // Only for testing - don't return this in production!
    };
  } catch (error) {
    console.error('Error sending magic link:', error);
    return {
      success: false,
      error: 'Failed to send magic link',
    };
  }
}



