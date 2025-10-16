# API Configuration

This directory contains the axios configuration and API service functions for the Debtfly application.

## Structure

```
lib/
├── api/
│   ├── index.ts              # Main axios instance with interceptors
│   ├── services/             # API service functions organized by domain
│   │   └── auth.ts          # Authentication services
│   └── README.md            # This file
└── types/
    ├── api.ts               # Common API types
    ├── auth.ts              # Authentication types
    └── index.ts             # Central type exports
```

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Axios Instance

The main axios instance is configured in `lib/api/index.ts` with:

- **Base URL**: Set via `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Default Headers**: `Content-Type: application/json`
- **Request Interceptor**: Automatically adds Bearer token from localStorage
- **Response Interceptor**: Handles 401 errors and token refresh logic

### 3. Authentication Flow

The interceptors handle:

1. **Request**: Adds `Authorization: Bearer <token>` header if token exists
2. **Response**: 
   - On 401 error, attempts to refresh token using refresh_token
   - If refresh succeeds, retries the original request
   - If refresh fails, clears tokens (redirect to login can be enabled)

## Usage

### Creating a New Service

```typescript
// lib/api/services/example.ts
import api from '../index';

export interface ExampleData {
  id: string;
  name: string;
}

export const getExamples = async (): Promise<ExampleData[]> => {
  try {
    const response = await api.get('/api/v1/examples/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch examples:', error);
    throw error;
  }
};

export const createExample = async (data: ExampleData): Promise<ExampleData> => {
  try {
    const response = await api.post('/api/v1/examples/', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create example:', error);
    throw error;
  }
};
```

### Using Services in Components

```typescript
'use client';

import { loginUser } from '@/lib/api/services/auth';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      console.log('Logged in:', response.user_id);
      // Redirect or update state
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your component JSX
  );
}
```

### Protected API Calls

The axios instance automatically includes the Bearer token for authenticated requests:

```typescript
// No need to manually add token, the interceptor handles it
const response = await api.get('/api/v1/protected/resource/');
```

## Token Storage

Tokens are stored in `localStorage`:

- `access_token`: JWT access token
- `refresh_token`: JWT refresh token
- `user_id`: User identifier

**Note**: For server-side rendering, consider using httpOnly cookies instead of localStorage for better security.

## Error Handling

All service functions should:

1. Wrap API calls in try-catch blocks
2. Log errors appropriately
3. Re-throw errors for component-level handling

```typescript
try {
  const data = await someApiCall();
  // Handle success
} catch (error) {
  // Handle error in component
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data);
  }
}
```

## Next Steps

1. Create additional service files in `lib/api/services/` for different domains
2. Set up proper error boundaries in your Next.js app
3. Consider implementing React Query for data fetching and caching
4. Add TypeScript types for all API responses
5. Implement proper error handling UI components

