// Mock creditor data for development
// In production, this would come from the database

import type { Creditor } from '../types/flow';

export const mockCreditors: Creditor[] = [
  // Credit Cards
  {
    id: 'cred-001',
    name: 'Barclaycard',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-002',
    name: 'HSBC Credit Card',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-003',
    name: 'Lloyds Bank Credit Card',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-004',
    name: 'NatWest Credit Card',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-005',
    name: 'Santander Credit Card',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-006',
    name: 'Tesco Credit Card',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-007',
    name: 'Virgin Money Credit Card',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-008',
    name: 'Capital One',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-009',
    name: 'American Express',
    category: 'credit_card',
    active: true,
  },
  {
    id: 'cred-010',
    name: 'Aqua Card',
    category: 'credit_card',
    active: true,
  },

  // Personal Loans
  {
    id: 'cred-011',
    name: 'Barclays Personal Loan',
    category: 'personal_loan',
    active: true,
  },
  {
    id: 'cred-012',
    name: 'HSBC Personal Loan',
    category: 'personal_loan',
    active: true,
  },
  {
    id: 'cred-013',
    name: 'Lloyds Bank Personal Loan',
    category: 'personal_loan',
    active: true,
  },
  {
    id: 'cred-014',
    name: 'Santander Personal Loan',
    category: 'personal_loan',
    active: true,
  },
  {
    id: 'cred-015',
    name: 'TSB Personal Loan',
    category: 'personal_loan',
    active: true,
  },

  // Store Cards
  {
    id: 'cred-016',
    name: 'Argos Card',
    category: 'store_card',
    active: true,
  },
  {
    id: 'cred-017',
    name: 'John Lewis Partnership Card',
    category: 'store_card',
    active: true,
  },
  {
    id: 'cred-018',
    name: 'Marks & Spencer Card',
    category: 'store_card',
    active: true,
  },
  {
    id: 'cred-019',
    name: 'Next Card',
    category: 'store_card',
    active: true,
  },

  // Payday Loans
  {
    id: 'cred-020',
    name: 'QuickQuid (now closed)',
    category: 'payday_loan',
    active: true,
  },
  {
    id: 'cred-021',
    name: 'Wonga (now closed)',
    category: 'payday_loan',
    active: true,
  },
  {
    id: 'cred-022',
    name: 'Cash Euro Net',
    category: 'payday_loan',
    active: true,
  },

  // Overdrafts
  {
    id: 'cred-023',
    name: 'Barclays Overdraft',
    category: 'overdraft',
    active: true,
  },
  {
    id: 'cred-024',
    name: 'HSBC Overdraft',
    category: 'overdraft',
    active: true,
  },
  {
    id: 'cred-025',
    name: 'Lloyds Bank Overdraft',
    category: 'overdraft',
    active: true,
  },
  {
    id: 'cred-026',
    name: 'NatWest Overdraft',
    category: 'overdraft',
    active: true,
  },
];

// Get all creditors
export function getAllCreditors(): Creditor[] {
  return mockCreditors.filter(c => c.active);
}

// Get creditors by category
export function getCreditorsByCategory(category: Creditor['category']): Creditor[] {
  return mockCreditors.filter(c => c.active && c.category === category);
}

// Search creditors by name
export function searchCreditors(query: string): Creditor[] {
  const lowerQuery = query.toLowerCase();
  return mockCreditors.filter(
    c => c.active && c.name.toLowerCase().includes(lowerQuery)
  );
}

// Get creditor by ID
export function getCreditorById(id: string): Creditor | undefined {
  return mockCreditors.find(c => c.id === id);
}

// Get category display name
export function getCategoryName(category: Creditor['category']): string {
  const names: Record<Creditor['category'], string> = {
    credit_card: 'Credit Cards',
    personal_loan: 'Personal Loans',
    payday_loan: 'Payday Loans',
    store_card: 'Store Cards',
    overdraft: 'Overdrafts',
    mortgage: 'Mortgages',
    other: 'Other',
  };
  return names[category];
}

// Group creditors by category
export function groupCreditorsByCategory(): Record<Creditor['category'], Creditor[]> {
  const grouped: Partial<Record<Creditor['category'], Creditor[]>> = {};
  
  mockCreditors.forEach(creditor => {
    if (!creditor.active) return;
    if (!grouped[creditor.category]) {
      grouped[creditor.category] = [];
    }
    grouped[creditor.category]!.push(creditor);
  });
  
  return grouped as Record<Creditor['category'], Creditor[]>;
}

