# Dashboard Testing Guide

## Issues Fixed

### 1. ✅ Hydration Error
**Problem:** Browser extension (Night Eye or similar) was modifying the HTML, causing React hydration mismatch.

**Fix:** Added `suppressHydrationWarning` to `<html>` and `<body>` tags in `app/layout.tsx`.

### 2. ✅ Dashboard Access
**Problem:** AuthGuard was redirecting unauthenticated users to login.

**Fix:** Created mock authentication helper script to simulate logged-in users.

## Testing the Dashboard

### Option 1: Quick Test with Mock Data (Recommended)

1. **Open your browser console** at `http://localhost:3000`

2. **Copy and paste the entire contents** of `setup-mock-auth.js` into the console and press Enter

3. **Navigate to the dashboard:**
   ```
   location.href = '/dashboard'
   ```

4. **You should see:**
   - ✅ Welcome message with your name
   - ✅ 4 KPI cards showing debt statistics
   - ✅ 3 mock debts displayed
   - ✅ Activity timeline
   - ✅ No hydration errors

### Option 2: Manual Setup

Run these commands in the browser console:

```javascript
// 1. Set tokens
localStorage.setItem('access_token', 'mock_token_' + Date.now());
localStorage.setItem('refresh_token', 'mock_refresh_' + Date.now());

// 2. Set user
localStorage.setItem('debtfly_user', JSON.stringify({
  id: 'test-user',
  email: 'test@test.com',
  first_name: 'John',
  last_name: 'Doe',
  onboarding_complete: true,
}));

// 3. Mark onboarding complete
localStorage.setItem('debtfly_onboarding_complete', 'true');

// 4. Go to dashboard
location.href = '/dashboard';
```

### Option 3: Complete Onboarding Flow

1. **Clear all data:**
   ```javascript
   localStorage.clear();
   location.href = '/';
   ```

2. **Go through the login flow:**
   - Visit `http://localhost:3000/login`
   - Enter any email
   - Click "Continue with Email"
   - Copy the magic link from the console (look for 🔗)
   - Paste the link in your browser

3. **Complete onboarding:**
   - Fill in all the onboarding steps
   - At the end, you'll be redirected to the dashboard

## Verifying Everything Works

### Dashboard Should Show:

1. **Header with:**
   - Debtfly logo
   - Navigation (Dashboard, Debts, Documents, Profile)
   - User avatar/menu

2. **Page content:**
   - Welcome message with user's first name
   - Welcome banner (dismissible)
   - Action required banner (if ID not uploaded)
   - 4 KPI cards
   - Debts list (or empty state)
   - Activity timeline (on the right)

3. **No errors:**
   - No hydration errors in console
   - No authentication errors
   - Proper styling and colors

## Common Issues

### "Redirecting to /login"
**Solution:** Make sure you've set the access token:
```javascript
localStorage.setItem('access_token', 'test_token');
location.reload();
```

### "No debts showing"
**Solution:** Run the full `setup-mock-auth.js` script to populate debts.

### "Hydration error"
**Solution:** 
- Already fixed with `suppressHydrationWarning`
- If still seeing it, disable browser extensions (Night Eye, Dark Reader, etc.)
- Or just ignore it - it won't affect functionality

## Cleaning Up

To reset everything:
```javascript
localStorage.clear();
location.href = '/';
```

## Next Steps

Once dashboard is working:
1. Test adding new debts
2. Test viewing debt details
3. Test uploading documents
4. Test profile settings
5. Test logout functionality

