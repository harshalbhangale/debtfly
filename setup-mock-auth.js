// Mock Authentication Helper for Testing Dashboard
// Run this in your browser console to simulate a logged-in user

console.log('🔧 Setting up mock authentication...\n');

// 1. Create mock tokens
const mockAccessToken = 'mock_access_token_' + Date.now();
const mockRefreshToken = 'mock_refresh_token_' + Date.now();

localStorage.setItem('access_token', mockAccessToken);
localStorage.setItem('refresh_token', mockRefreshToken);

console.log('✅ Tokens set:', {
  access_token: mockAccessToken.substring(0, 30) + '...',
  refresh_token: mockRefreshToken.substring(0, 30) + '...',
});

// 2. Create mock user
const mockUser = {
  id: 'user-mock-test-123',
  email: 'test@debtfly.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+44 7700 900000',
  onboarding_complete: false,
  is_verified: true,
  tasks_complete: {
    uploadId: false,
    addressVerified: false,
    signatureComplete: false,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

localStorage.setItem('debtfly_user', JSON.stringify(mockUser));

console.log('✅ User created:', mockUser);

// 3. Create mock onboarding data with debts
const mockDebts = [
  {
    id: 'debt-1',
    user_id: 'user-mock-test-123',
    creditor_id: 'creditor-1',
    creditor_name: 'HSBC Credit Card',
    debt_type: 'credit_card',
    original_balance: 5000,
    current_balance: 4500,
    stage: 'reviewing_documentation',
    status: 'active',
    date_opened: '2020-05-15',
    date_defaulted: null,
    last_payment_date: '2024-09-01',
    account_number: '****1234',
    notes: '',
    documents: [],
    timeline: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'debt-2',
    user_id: 'user-mock-test-123',
    creditor_id: 'creditor-2',
    creditor_name: 'Barclaycard',
    debt_type: 'credit_card',
    original_balance: 3500,
    current_balance: 3500,
    stage: 'temporarily_unenforceable',
    status: 'active',
    date_opened: '2019-03-20',
    date_defaulted: '2023-08-10',
    last_payment_date: '2023-07-15',
    account_number: '****5678',
    notes: 'Statute barred - No documentation received',
    documents: [],
    timeline: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'debt-3',
    user_id: 'user-mock-test-123',
    creditor_id: 'creditor-3',
    creditor_name: 'Santander Personal Loan',
    debt_type: 'personal_loan',
    original_balance: 8000,
    current_balance: 6200,
    stage: 'permanently_unenforceable',
    status: 'active',
    date_opened: '2018-11-10',
    date_defaulted: null,
    last_payment_date: '2024-08-20',
    account_number: '****9012',
    notes: 'Agreement unenforceable - Missing required terms',
    documents: [],
    timeline: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

localStorage.setItem('debtfly_debts', JSON.stringify(mockDebts));

console.log('✅ Mock debts created:', mockDebts.length, 'debts');

// 4. Create mock onboarding data
const mockOnboarding = {
  qualifying: {
    totalDebt: 14200,
    monthlyPayments: 300,
    currentlyPaying: 'some',
    anyInDefault: 'yes',
  },
  identity: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    phone: '+44 7700 900000',
    addressLine1: '123 Main Street',
    city: 'London',
    postcode: 'SW1A 1AA',
  },
  signature: {
    signature: 'data:image/png;base64,...',
    signedAt: new Date().toISOString(),
  },
  debts: mockDebts,
  plan: {
    selectedPlan: 'standard',
    monthlyPayment: 50,
  },
  payment: {
    paymentMethod: 'card',
    cardLast4: '4242',
  },
};

localStorage.setItem('debtfly_onboarding', JSON.stringify(mockOnboarding));

console.log('✅ Onboarding data set');

// 5. Mark onboarding as complete
localStorage.setItem('debtfly_onboarding_complete', 'true');

console.log('✅ Onboarding marked as complete');

console.log('\n🎉 Mock authentication setup complete!');
console.log('\n📌 Next steps:');
console.log('1. Navigate to: http://localhost:3000/dashboard');
console.log('2. You should see the dashboard with mock data');
console.log('\n🧹 To clear everything:');
console.log('   localStorage.clear(); location.reload();');

