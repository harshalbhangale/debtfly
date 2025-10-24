import type { Debt, Creditor, DebtStage, LikelihoodBand } from './types';

// Mock creditors
export const mockCreditors: Creditor[] = [
  { id: '1', name: 'Barclaycard', contact_email: 'info@barclaycard.co.uk', contact_phone: '0800 151 0900', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '2', name: 'Capital One', contact_email: 'customer.service@capitalone.co.uk', contact_phone: '0800 952 5555', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '3', name: 'American Express', contact_email: 'customerservice@aexp.com', contact_phone: '0800 917 8047', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '4', name: 'MBNA', contact_email: 'service@mbna.co.uk', contact_phone: '0800 068 7678', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '5', name: 'Santander', contact_email: 'service@santander.co.uk', contact_phone: '0800 9 123 123', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '6', name: 'Lloyds Bank', contact_email: 'customer.services@lloydsbanking.com', contact_phone: '0800 056 0056', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '7', name: 'HSBC', contact_email: 'customer.service@hsbc.co.uk', contact_phone: '0800 234 5678', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
  { id: '8', name: 'Tesco Bank', contact_email: 'help@tescobank.com', contact_phone: '0800 800 9282', postal_address: undefined, sla_days: 40, notes: undefined, created_at: new Date(), updated_at: new Date() },
];

// Generate a random debt
function generateRandomDebt(clientId: string, creditor: Creditor, stage?: DebtStage): Debt {
  const stages: DebtStage[] = [
    'awaiting_signup',
    'disclosure_requested',
    'temporarily_unenforceable',
    'under_review',
    'enforceable',
    'permanently_unenforceable',
    'written_off',
  ];
  
  const likelihoods: LikelihoodBand[] = ['low', 'medium', 'high'];
  
  const originalBalance = Math.floor(Math.random() * 15000) + 2000; // £2k - £17k
  const currentBalance = Math.floor(originalBalance * (0.7 + Math.random() * 0.3)); // 70-100% of original
  
  const randomStage = stage || stages[Math.floor(Math.random() * stages.length)];
  const isEnforceable = randomStage === 'enforceable' || randomStage === 'under_review';
  
  const dateOpened = new Date();
  dateOpened.setFullYear(dateOpened.getFullYear() - Math.floor(Math.random() * 15)); // 0-15 years ago
  
  const dateDefault = Math.random() > 0.5 ? new Date(dateOpened.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000) : null;
  
  return {
    id: `debt-${Math.random().toString(36).substr(2, 9)}`,
    client_id: clientId,
    creditor_id: creditor.id,
    creditor_name: creditor.name,
    account_ref: `${creditor.name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    original_balance: originalBalance,
    current_balance: currentBalance,
    status: dateDefault ? 'default' : 'active',
    stage: randomStage,
    date_opened: dateOpened,
    date_default: dateDefault,
    sla_due_date: randomStage === 'disclosure_requested' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
    is_enforceable: isEnforceable,
    likelihood: likelihoods[Math.floor(Math.random() * likelihoods.length)],
    notes: undefined,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

// Generate mock debts from CRA search
export function generateMockCRAResults(clientId: string, count: number = 3): Debt[] {
  const selectedCreditors = mockCreditors
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  return selectedCreditors.map(creditor => 
    generateRandomDebt(clientId, creditor, 'disclosure_requested')
  );
}

// Generate mock debts with various stages
export function generateMockDebts(clientId: string, count: number = 4): Debt[] {
  const selectedCreditors = mockCreditors
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  const stages: DebtStage[] = [
    'disclosure_requested',
    'temporarily_unenforceable',
    'under_review',
    'permanently_unenforceable',
  ];
  
  return selectedCreditors.map((creditor, index) => 
    generateRandomDebt(clientId, creditor, stages[index % stages.length])
  );
}

// Create a manual debt entry
export function createManualDebt(
  clientId: string,
  creditorName: string,
  accountRef: string,
  balance: number,
  status: 'active' | 'default' | 'settled'
): Debt {
  // Find or create creditor
  let creditor = mockCreditors.find(c => 
    c.name.toLowerCase() === creditorName.toLowerCase()
  );
  
  if (!creditor) {
    creditor = {
      id: `creditor-${Math.random().toString(36).substr(2, 9)}`,
      name: creditorName,
      contact_email: undefined,
      contact_phone: undefined,
      postal_address: undefined,
      sla_days: 40,
      notes: undefined,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
  
  return {
    id: `debt-${Math.random().toString(36).substr(2, 9)}`,
    client_id: clientId,
    creditor_id: creditor.id,
    creditor_name: creditor.name,
    account_ref: accountRef,
    original_balance: balance,
    current_balance: balance,
    status,
    stage: 'awaiting_signup',
    date_opened: null,
    date_default: status === 'default' ? new Date() : null,
    sla_due_date: null,
    is_enforceable: false,
    likelihood: 'medium',
    notes: 'Manually added by client',
    created_at: new Date(),
    updated_at: new Date(),
  };
}

// Get creditor by name
export function getCreditorByName(name: string): Creditor | undefined {
  return mockCreditors.find(c => 
    c.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Calculate total debt amount
export function calculateTotalDebt(debts: Debt[]): number {
  return debts.reduce((total, debt) => total + debt.current_balance, 0);
}

