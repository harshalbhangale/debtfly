import type { Debt } from '../mock-data/types';

const DEBTS_KEY = 'debtfly_debts';

export function saveDebts(debts: Debt[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DEBTS_KEY, JSON.stringify(debts));
  } catch (error) {
    console.error('Error saving debts:', error);
  }
}

export function getDebts(): Debt[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(DEBTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading debts:', error);
    return [];
  }
}

export function addDebt(debt: Debt): void {
  const debts = getDebts();
  saveDebts([...debts, debt]);
}

export function updateDebt(id: string, updates: Partial<Debt>): void {
  const debts = getDebts();
  const updated = debts.map(debt =>
    debt.id === id ? { ...debt, ...updates, updated_at: new Date() } : debt
  );
  saveDebts(updated);
}

export function removeDebt(id: string): void {
  const debts = getDebts();
  const filtered = debts.filter(debt => debt.id !== id);
  saveDebts(filtered);
}

export function getDebtById(id: string): Debt | undefined {
  const debts = getDebts();
  return debts.find(debt => debt.id === id);
}

export function clearDebts(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(DEBTS_KEY);
  } catch (error) {
    console.error('Error clearing debts:', error);
  }
}



