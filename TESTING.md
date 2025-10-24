# Testing Guide for Debtfly Onboarding

## 🚀 EASIEST METHOD: Use Test Page

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Go to: **`http://localhost:3000/test`**

3. Click **"Setup Mock Auth & Start Onboarding"**

4. You'll be redirected to the onboarding flow!

---

## Understanding Onboarding

**Yes, onboarding IS the signup process!** Users go through 7 steps:

1. `/qualifying` - Answer qualifying questions (debt amount, payments)
2. `/identity` - Provide personal details, DOB, email, address
3. `/signature` - Sign agreement with consents
4. `/debts` - Enter debt information
5. `/debts/display` - Review and confirm debts
6. `/plan` - Choose payment plan
7. `/payment` - Enter payment details

After completion → Dashboard (authenticated user)

---

## Quick Start: Bypass Auth for Testing

To quickly test the onboarding flow without going through authentication:

### Option 1: Use Browser Console

1. Open your browser's developer console (F12)
2. Go to `http://localhost:3000/login`
3. Paste this code in the console:

```javascript
// Set mock auth tokens
localStorage.setItem('access_token', 'mock_token_for_testing');
localStorage.setItem('debtfly_user', JSON.stringify({
  id: 'test-user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
}));

// Redirect to onboarding
window.location.href = '/qualifying';
```

4. Press Enter - You'll be redirected to the onboarding flow!

### Option 2: Use the Magic Link Flow

1. Go to `http://localhost:3000/login`
2. Enter any email (e.g., `test@example.com`)
3. Click "Continue with Email"
4. Check the **browser console** - you'll see a magic link logged
5. Copy that link and paste it in your browser

The magic link will look like:
```
http://localhost:3000/verify?token=mock_token_abc123&email=test@example.com
```

---

## Clear All Data (Reset)

If you need to start fresh:

```javascript
// Clear all localStorage
localStorage.clear();

// Or clear specific items
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('debtfly_user');
localStorage.removeItem('onboarding_qualifying');
localStorage.removeItem('onboarding_identity');
localStorage.removeItem('onboarding_signature');
localStorage.removeItem('onboarding_debts');
localStorage.removeItem('onboarding_complete');

// Then reload
window.location.reload();
```

---

## Onboarding Flow URLs

Once authenticated, you can directly navigate to:

1. http://localhost:3000/qualifying
2. http://localhost:3000/identity
3. http://localhost:3000/signature
4. http://localhost:3000/debts
5. http://localhost:3000/debts/display
6. http://localhost:3000/plan
7. http://localhost:3000/payment

---

## Check Current Auth Status

```javascript
// Check if authenticated
console.log('Authenticated:', !!localStorage.getItem('access_token'));

// Check user data
console.log('User:', JSON.parse(localStorage.getItem('debtfly_user') || 'null'));

// Check onboarding progress
console.log('Onboarding Complete:', localStorage.getItem('onboarding_complete'));
```

---

## Troubleshooting

**Problem:** Still redirected to `/login`
**Solution:** Make sure you've set BOTH `access_token` and `debtfly_user` in localStorage

**Problem:** Can't proceed past a step
**Solution:** Make sure previous steps are completed and saved in localStorage

**Problem:** Want to restart onboarding
**Solution:** Run the "Clear All Data" script above

