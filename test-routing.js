// Test Script - Run in Browser Console
// This will help you test the onboarding flow

console.log('=== Debtfly Routing Test ===\n');

// 1. Check current authentication status
const isAuth = !!localStorage.getItem('access_token');
console.log('1. Authenticated:', isAuth);

// 2. Check onboarding status
const onboardingComplete = localStorage.getItem('debtfly_onboarding_complete');
console.log('2. Onboarding Complete:', onboardingComplete === 'true');

// 3. Check onboarding data
const onboardingData = localStorage.getItem('debtfly_onboarding');
console.log('3. Onboarding Data:', onboardingData ? JSON.parse(onboardingData) : 'None');

// 4. Check user data
const userData = localStorage.getItem('debtfly_user');
console.log('4. User Data:', userData ? JSON.parse(userData) : 'None');

console.log('\n=== Test Scenarios ===\n');

// Test 1: Fresh Start
console.log('Test 1: Fresh Start (Clear All Data)');
console.log('Run: localStorage.clear(); location.href = "/";');
console.log('Expected: Redirect to /qualifying\n');

// Test 2: Mid-Onboarding
console.log('Test 2: Mid-Onboarding');
console.log('Run: Visit /identity after completing qualifying step');
console.log('Expected: Can access /identity\n');

// Test 3: Skip Ahead (Should Prevent)
console.log('Test 3: Try to Skip Ahead');
console.log('Run: Visit /plan without completing previous steps');
console.log('Expected: Redirect back to current step\n');

// Test 4: Completed Onboarding
console.log('Test 4: Completed Onboarding + Authenticated');
console.log('Run: Complete all steps, then visit /');
console.log('Expected: Redirect to /dashboard\n');

console.log('=== Current Page ===');
console.log('Path:', window.location.pathname);

