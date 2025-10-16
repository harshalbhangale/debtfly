# Axios Setup for Debtfly

This document describes the axios configuration setup for the Debtfly Next.js application, mirroring the structure used in claimtech-multitenant.

## Overview

The axios setup provides:
- Centralized API configuration
- Automatic authentication token handling
- Token refresh logic on 401 errors
- Type-safe API service functions

## Files Created

```
debtfly/
├── lib/
│   └── api/
│       ├── index.ts                    # Main axios instance
│       ├── services/
│       │   └── auth.ts                # Authentication service example
│       └── README.md                  # API documentation
└── AXIOS_SETUP.md                    # This file
```

## Configuration Details

### 1. Axios Instance (`lib/api/index.ts`)

**Key Features:**
- Base URL from environment variable: `NEXT_PUBLIC_API_BASE_URL`
- Default `Content-Type: application/json` header
- SSR-safe with `typeof window !== 'undefined'` checks

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header
- Retrieves token from localStorage
- Only runs in browser context

**Response Interceptor:**
- Catches 401 (Unauthorized) errors
- Attempts token refresh using refresh_token
- Retries original request with new token
- Cleans up tokens on refresh failure

### 2. Authentication Service (`lib/api/services/auth.ts`)

**Functions:**
- `loginUser(loginData)`: Authenticates user and stores tokens
- `logoutUser()`: Clears authentication tokens

**Response Structure:**
```typescript
{
  access: string;      // JWT access token
  refresh: string;     // JWT refresh token
  user_id: string;     // User identifier
}
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> **Note**: The `.env.local` file is gitignored. A `.env.local.example` template is provided.

## Usage Examples

### 1. Using Authentication Service

```typescript
'use client';

import { loginUser, logoutUser } from '@/lib/api/services/auth';

export default function LoginForm() {
  const handleSubmit = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });
      console.log('User ID:', response.user_id);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
      // Show error message
    }
  };

  return (
    // Your form JSX
  );
}
```

### 2. Creating a New Service

```typescript
// lib/api/services/debts.ts
import api from '../index';

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  status: string;
}

export const getDebts = async (): Promise<Debt[]> => {
  try {
    const response = await api.get('/api/v1/debts/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch debts:', error);
    throw error;
  }
};

export const createDebt = async (debt: Omit<Debt, 'id'>): Promise<Debt> => {
  try {
    const response = await api.post('/api/v1/debts/', debt);
    return response.data;
  } catch (error) {
    console.error('Failed to create debt:', error);
    throw error;
  }
};

export const updateDebt = async (id: string, debt: Partial<Debt>): Promise<Debt> => {
  try {
    const response = await api.patch(`/api/v1/debts/${id}/`, debt);
    return response.data;
  } catch (error) {
    console.error('Failed to update debt:', error);
    throw error;
  }
};

export const deleteDebt = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/debts/${id}/`);
  } catch (error) {
    console.error('Failed to delete debt:', error);
    throw error;
  }
};
```

### 3. Making Protected API Calls

The interceptor automatically adds the token:

```typescript
// No need to manually add Authorization header
const response = await api.get('/api/v1/protected/data/');
```

### 4. Handling Errors in Components

```typescript
'use client';

import { getDebts } from '@/lib/api/services/debts';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

export default function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts();
        setDebts(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || 'Failed to load debts');
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    fetchDebts();
  }, []);

  if (error) return <div>Error: {error}</div>;
  
  return (
    // Your component JSX
  );
}
```

## Key Differences from claimtech-multitenant

1. **Environment Variables**: Uses `NEXT_PUBLIC_` prefix for client-side access
2. **SSR Safety**: Added `typeof window !== 'undefined'` checks for localStorage
3. **Import Syntax**: Uses Next.js `@/` path alias for cleaner imports

## Token Refresh Flow

1. User makes authenticated request
2. Server responds with 401 Unauthorized
3. Interceptor catches error
4. Attempts to refresh token using `refresh_token`
5. If successful:
   - Updates tokens in localStorage
   - Retries original request with new token
6. If failed:
   - Clears all tokens
   - User needs to login again

## Security Considerations

### Current Implementation (localStorage)
- ✅ Simple to implement
- ✅ Works well for SPAs
- ❌ Vulnerable to XSS attacks
- ❌ Not accessible server-side

### Recommended for Production (httpOnly Cookies)
- ✅ Not accessible to JavaScript (XSS protection)
- ✅ Works with server-side rendering
- ✅ More secure
- ❌ Requires server configuration

To implement httpOnly cookies, you'll need to:
1. Store tokens in httpOnly cookies on the server
2. Use Next.js middleware to handle token refresh
3. Remove localStorage usage

## Next Steps

1. **Set Environment Variables**: Create `.env.local` with your API URL
2. **Create More Services**: Add service files for your API endpoints
3. **Implement Error Handling**: Create error boundary components
4. **Add React Query** (Optional): For better data fetching and caching
5. **Security**: Consider migrating to httpOnly cookies for production

## Testing the Setup

```typescript
// Test in a page or component
'use client';

import { useEffect } from 'react';
import api from '@/lib/api';

export default function TestPage() {
  useEffect(() => {
    // Test API connection
    api.get('/health-check')
      .then(response => console.log('API Connected:', response.data))
      .catch(error => console.error('API Error:', error));
  }, []);

  return <div>Check console for API test results</div>;
}
```

## Dependencies Added

```json
{
  "dependencies": {
    "axios": "^1.7.9"
  }
}
```

## Support

For questions or issues related to the API setup, refer to:
- `lib/api/README.md` - Detailed API documentation
- claimtech-multitenant repository - Reference implementation

