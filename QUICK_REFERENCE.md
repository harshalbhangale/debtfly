# Debtfly Quick Reference Card

## 🚀 Quick Start

### Make an API Call
```typescript
import api from '@/lib/api';

// GET
const data = await api.get('/api/v1/endpoint');

// POST
const result = await api.post('/api/v1/endpoint', { data });

// Token is automatically added! ✨
```

### Use a Service
```typescript
import { loginUser } from '@/lib/api/services/auth';

const response = await loginUser({ 
  email: 'user@example.com', 
  password: 'password' 
});
// Tokens stored automatically
```

### Use Types
```typescript
import type { LoginData, ApiResponse } from '@/lib/types';
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| Axios config | `lib/api/index.ts` |
| Services | `lib/api/services/` |
| Types | `lib/types/` |
| Utils | `lib/utils.ts` |

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `CLAIMTECH_ANALYSIS.md` | Complete analysis of claimtech architecture |
| `ONBOARDING_FLOW_DIAGRAM.md` | Visual user journey diagrams |
| `AXIOS_SETUP.md` | Axios configuration details |
| `API_COMPARISON.md` | Claimtech vs Debtfly comparison |
| `SETUP_SUMMARY.md` | What's been set up |
| `QUICK_REFERENCE.md` | This file |

---

## 🎯 Key Patterns

### Onboarding Flow
```
Step 1 → Step 2 → Step 3 → Step 4 → Complete
  ↓        ↓        ↓        ↓          ↓
Save   Validate  API     Review    Dashboard
```

### Dashboard Structure
```
Header
  ↓
Action Banners (if needed)
  ↓
Status Summary
  ↓
Claim Cards
  ├─ Progress
  ├─ Agreements
  ├─ Evidence
  └─ Actions
```

### Data Flow
```
User Input → Validation → State → localStorage
                 ↓
            API Call → Response → Update UI
```

---

## 🛠️ Common Patterns

### Form with Validation
```typescript
const [value, setValue] = useState('');
const [error, setError] = useState('');

const validate = () => {
  if (!value) {
    setError('Required');
    return false;
  }
  return true;
};

const handleSubmit = () => {
  if (!validate()) return;
  // Submit
};
```

### API Call with Loading
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    const data = await api.get('/endpoint');
    // Use data
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Auto-save Pattern
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('key', value);
  }, 2000); // 2s debounce
  
  return () => clearTimeout(timer);
}, [value]);
```

---

## 🎨 UI Patterns

### Loading State
```typescript
{loading ? <Spinner /> : <Content />}
```

### Error State
```typescript
{error && (
  <div className="text-red-500">
    {error}
  </div>
)}
```

### Empty State
```typescript
{items.length === 0 ? (
  <div>No items found</div>
) : (
  <ItemList items={items} />
)}
```

---

## 🔐 Authentication

### Login
```typescript
const { access, refresh, user_id } = await loginUser({
  email, 
  password
});
// Tokens stored in localStorage automatically
```

### Logout
```typescript
logoutUser(); // Clears tokens
```

### Check Auth
```typescript
const isAuthenticated = !!localStorage.getItem('access_token');
```

---

## 🧩 Component Structure

```typescript
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { YourType } from '@/lib/types';

export default function Component() {
  const [state, setState] = useState<YourType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const data = await api.get('/endpoint');
      setState(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{/* Your JSX */}</div>;
}
```

---

## 🎯 Next.js App Router

### Page
```typescript
// app/page.tsx
export default function Page() {
  return <div>Page</div>;
}
```

### Layout
```typescript
// app/layout.tsx
export default function Layout({ children }) {
  return <div>{children}</div>;
}
```

### Client Component
```typescript
'use client'; // Add this for interactivity
```

### Server Component
```typescript
// Default - no 'use client'
```

---

## 🔄 React Query (Recommended)

### Setup
```typescript
// app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Usage
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['claims'],
  queryFn: () => api.get('/api/v1/claims/'),
  refetchInterval: 30000, // 30s
});
```

---

## 🐛 Debugging

### Check Token
```typescript
console.log(localStorage.getItem('access_token'));
```

### Test API
```typescript
api.get('/health-check')
  .then(console.log)
  .catch(console.error);
```

### Check Network
```
DevTools → Network tab → Look for failed requests
```

---

## ⚡ Performance Tips

1. **Debounce auto-save** (2-3 seconds)
2. **Use React Query** for caching
3. **Lazy load modals** (dynamic imports)
4. **Optimize images** (Next.js Image component)
5. **Paginate lists** (don't load everything)

---

## 🎨 Styling (Tailwind)

### Responsive
```typescript
className="text-sm md:text-base lg:text-lg"
```

### Common Classes
```typescript
// Flex
"flex items-center justify-between"

// Grid
"grid grid-cols-1 md:grid-cols-2 gap-4"

// Button
"bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"

// Input
"border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
```

---

## 📱 Mobile-First

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Example
```typescript
className="p-4 md:p-6 lg:p-8"
```

---

## 🚦 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/expired token)
- `403`: Forbidden (no permission)
- `404`: Not Found
- `500`: Server Error

---

## 💾 localStorage Keys

- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user_id` - User identifier
- (Add your onboarding keys here)

---

## 🎯 Implementation Checklist

### Phase 1: Setup
- [x] Axios configuration
- [x] Type system
- [x] Documentation
- [ ] React Query setup
- [ ] Auth context

### Phase 2: Auth
- [ ] Login page
- [ ] Protected routes
- [ ] Token refresh
- [ ] Logout

### Phase 3: Onboarding
- [ ] Multi-step form
- [ ] Progress indicator
- [ ] Validation
- [ ] Auto-save

### Phase 4: Dashboard
- [ ] Layout
- [ ] Claim cards
- [ ] Modals
- [ ] Real-time updates

---

## 🆘 Troubleshooting

### API not working
1. Check `.env.local` exists
2. Restart dev server after env changes
3. Verify `NEXT_PUBLIC_API_BASE_URL` is set
4. Check network tab in DevTools

### Token expired
- Automatic refresh should handle this
- Check console for errors
- Manually clear localStorage and re-login

### Types not working
- Check import path: `@/lib/types`
- Restart TypeScript server in VSCode
- Check `tsconfig.json` paths

---

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Install axios (already done)
npm install axios

# Install React Query (recommended)
npm install @tanstack/react-query
```

---

## 🎓 Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Axios**: https://axios-http.com/docs

---

**Keep this handy while building! 📌**



