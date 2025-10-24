# API Setup Comparison: claimtech-multitenant vs debtfly

## Side-by-Side Comparison

| Feature | claimtech-multitenant (Vite + React) | debtfly (Next.js) |
|---------|--------------------------------------|-------------------|
| **Framework** | Vite + React | Next.js 15 |
| **Axios Version** | ^1.10.0 | ^1.7.9 |
| **Base URL Config** | `import.meta.env.VITE_API_BASE_URL` | `process.env.NEXT_PUBLIC_API_BASE_URL` |
| **Token Storage** | localStorage | localStorage (with SSR checks) |
| **Import Path** | `import api from '../../index'` | `import api from '@/lib/api'` |
| **Directory Structure** | `src/api/` | `lib/api/` |
| **SSR Checks** | Not needed | Required (`typeof window !== 'undefined'`) |

## File Structure Comparison

### claimtech-multitenant
```
src/
└── api/
    ├── index.ts                 # Axios instance
    └── services/
        ├── dashboard/
        │   ├── getClaims.ts
        │   ├── profile.ts
        │   └── ...
        └── onboarding/
            ├── login.ts
            ├── registerUser.ts
            └── ...
```

### debtfly
```
lib/
└── api/
    ├── index.ts                 # Axios instance
    ├── services/
    │   └── auth.ts             # Example service
    └── README.md               # Documentation
```

## Code Comparison

### Axios Instance Configuration

#### claimtech-multitenant
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

#### debtfly
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (with SSR check)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {  // SSR-safe
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }
);
```

### Service Function Comparison

#### claimtech-multitenant
```typescript
// src/api/services/onboarding/login.ts
import api from '../../index';

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/v1/auth/login/', loginData);
    const { access, refresh, user_id } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_id', user_id);
    
    return response.data;
  } catch (error) {
    console.error('Failed to login user:', error);
    throw error;
  }
};
```

#### debtfly
```typescript
// lib/api/services/auth.ts
import api from '../index';

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/v1/auth/login/', loginData);
    const { access, refresh, user_id } = response.data;
    
    // SSR-safe localStorage access
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_id', user_id);
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to login user:', error);
    throw error;
  }
};
```

## Environment Variables

### claimtech-multitenant
```env
# .env
VITE_API_BASE_URL=http://localhost:8000
```

### debtfly
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Key Implementation Details

### Both Projects Share:
1. ✅ Same interceptor logic for request/response handling
2. ✅ Automatic Bearer token injection
3. ✅ 401 error handling with token refresh
4. ✅ Similar service function patterns
5. ✅ TypeScript interfaces for type safety

### debtfly Specific Additions:
1. ✅ SSR-safe checks (`typeof window !== 'undefined'`)
2. ✅ Next.js environment variable naming (`NEXT_PUBLIC_`)
3. ✅ Located in `lib/` instead of `src/`
4. ✅ Uses Next.js path aliases (`@/lib/api`)

## Migration Notes

When creating services in debtfly based on claimtech-multitenant:

1. **Update imports:**
   ```typescript
   // Old (claimtech-multitenant)
   import api from '../../index';
   
   // New (debtfly)
   import api from '@/lib/api';
   ```

2. **Add SSR checks for localStorage:**
   ```typescript
   // Wrap localStorage calls
   if (typeof window !== 'undefined') {
     localStorage.setItem('key', value);
   }
   ```

3. **Keep the same API patterns:**
   - Service functions structure
   - Error handling
   - Type definitions
   - Response handling

## Example Migration

If you want to migrate a service from claimtech-multitenant to debtfly:

```typescript
// Original: src/api/services/dashboard/getClaims.ts
import api from '../../index';

export const getClaims = async (): Promise<Claim[]> => {
  const response = await api.get('/api/v1/claims/');
  return response.data;
};
```

Becomes:

```typescript
// New: lib/api/services/claims.ts
import api from '@/lib/api';

export const getClaims = async (): Promise<Claim[]> => {
  const response = await api.get('/api/v1/claims/');
  return response.data;
};
```

No other changes needed! 🎉

## Summary

The debtfly axios setup is essentially identical to claimtech-multitenant with these adaptations:
- Next.js environment variables
- SSR-safe localStorage access
- Next.js directory conventions
- Cleaner import paths with aliases

All the core axios functionality, interceptors, and patterns remain the same!

