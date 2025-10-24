// Storage layer for public onboarding flow (Pages 1-8)
// This uses localStorage for now, can be easily migrated to API calls

import type {
  PublicOnboardingData,
  CreditorSelection,
  ContactInfo,
  DateOfBirth,
  AddressHistory,
  DebtDetails,
  DocumentAcknowledgement,
} from '../types/flow';

const PUBLIC_ONBOARDING_KEY = 'debtfly_public_onboarding';
const CURRENT_STEP_KEY = 'debtfly_public_step';

// ============================================
// STEP MANAGEMENT
// ============================================

const publicSteps = [
  'creditors',     // Page 1
  'info',          // Page 2
  'contact',       // Page 3
  'dob',           // Page 4
  'address',       // Page 5
  'debt-details',  // Page 6
  'review',        // Page 7
  'complete',      // Page 8
] as const;

export type PublicStep = typeof publicSteps[number];

export function getCurrentPublicStep(): PublicStep {
  if (typeof window === 'undefined') return 'creditors';
  
  try {
    const step = localStorage.getItem(CURRENT_STEP_KEY);
    return (step as PublicStep) || 'creditors';
  } catch (error) {
    console.error('Error getting current step:', error);
    return 'creditors';
  }
}

export function setCurrentPublicStep(step: PublicStep): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CURRENT_STEP_KEY, step);
  } catch (error) {
    console.error('Error setting current step:', error);
  }
}

export function getNextPublicStep(currentStep: PublicStep): PublicStep | null {
  const currentIndex = publicSteps.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === publicSteps.length - 1) return null;
  return publicSteps[currentIndex + 1];
}

export function getPreviousPublicStep(currentStep: PublicStep): PublicStep | null {
  const currentIndex = publicSteps.indexOf(currentStep);
  if (currentIndex <= 0) return null;
  return publicSteps[currentIndex - 1];
}

export function canAccessPublicStep(requestedStep: PublicStep): boolean {
  const currentStep = getCurrentPublicStep();
  const currentIndex = publicSteps.indexOf(currentStep);
  const requestedIndex = publicSteps.indexOf(requestedStep);
  
  // Can access current step or any previous step
  return requestedIndex <= currentIndex;
}

// ============================================
// DATA MANAGEMENT
// ============================================

export function getPublicOnboardingData(): PublicOnboardingData {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(PUBLIC_ONBOARDING_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading public onboarding data:', error);
    return {};
  }
}

export function savePublicOnboardingData(data: Partial<PublicOnboardingData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getPublicOnboardingData();
    const updated = { ...existing, ...data };
    localStorage.setItem(PUBLIC_ONBOARDING_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving public onboarding data:', error);
  }
}

export function clearPublicOnboardingData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(PUBLIC_ONBOARDING_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
  } catch (error) {
    console.error('Error clearing public onboarding data:', error);
  }
}

// ============================================
// SPECIFIC DATA HELPERS
// ============================================

// Page 1: Creditor Selection
export function saveCreditorSelection(selection: CreditorSelection): void {
  savePublicOnboardingData({ creditor_selection: selection });
  setCurrentPublicStep('info');
}

export function getCreditorSelection(): CreditorSelection | undefined {
  return getPublicOnboardingData().creditor_selection;
}

// Page 3: Contact Info
export function saveContactInfo(info: ContactInfo): void {
  savePublicOnboardingData({ contact_info: info });
  setCurrentPublicStep('dob');
}

export function getContactInfo(): ContactInfo | undefined {
  return getPublicOnboardingData().contact_info;
}

// Page 4: Date of Birth
export function saveDateOfBirth(dob: DateOfBirth): void {
  savePublicOnboardingData({ date_of_birth: dob });
  setCurrentPublicStep('address');
}

export function getDateOfBirth(): DateOfBirth | undefined {
  return getPublicOnboardingData().date_of_birth;
}

// Page 5: Address
export function saveAddressHistory(addresses: AddressHistory): void {
  savePublicOnboardingData({ address_history: addresses });
  setCurrentPublicStep('debt-details');
}

export function getAddressHistory(): AddressHistory | undefined {
  return getPublicOnboardingData().address_history;
}

// Page 6: Debt Details
export function saveDebtDetails(debts: DebtDetails[]): void {
  savePublicOnboardingData({ debts });
  setCurrentPublicStep('review');
}

export function getDebtDetails(): DebtDetails[] {
  return getPublicOnboardingData().debts || [];
}

export function addDebtDetail(debt: DebtDetails): void {
  const existing = getDebtDetails();
  saveDebtDetails([...existing, debt]);
}

export function updateDebtDetail(id: string, updates: Partial<DebtDetails>): void {
  const existing = getDebtDetails();
  const updated = existing.map(debt =>
    debt.id === id ? { ...debt, ...updates } : debt
  );
  saveDebtDetails(updated);
}

export function removeDebtDetail(id: string): void {
  const existing = getDebtDetails();
  const filtered = existing.filter(debt => debt.id !== id);
  saveDebtDetails(filtered);
}

// Page 7: Document Acknowledgements
export function saveDocumentAcknowledgements(acknowledgements: DocumentAcknowledgement[]): void {
  savePublicOnboardingData({ document_acknowledgements: acknowledgements });
}

export function getDocumentAcknowledgements(): DocumentAcknowledgement[] {
  return getPublicOnboardingData().document_acknowledgements || [];
}

export function acknowledgeDocument(documentCode: DocumentAcknowledgement['document_code']): void {
  const existing = getDocumentAcknowledgements();
  const existingIndex = existing.findIndex(doc => doc.document_code === documentCode);
  
  const acknowledgement: DocumentAcknowledgement = {
    document_code: documentCode,
    document_name: getDocumentName(documentCode),
    acknowledged: true,
    acknowledged_at: new Date(),
    // In production, capture real IP
    ip_address: 'localhost',
  };
  
  if (existingIndex >= 0) {
    existing[existingIndex] = acknowledgement;
  } else {
    existing.push(acknowledgement);
  }
  
  saveDocumentAcknowledgements(existing);
}

export function allDocumentsAcknowledged(): boolean {
  const acknowledgements = getDocumentAcknowledgements();
  const requiredDocs: DocumentAcknowledgement['document_code'][] = ['PRIV-001', 'SCOPE-001', 'STAT-001'];
  
  return requiredDocs.every(docCode =>
    acknowledgements.some(ack => ack.document_code === docCode && ack.acknowledged)
  );
}

// Page 8: Complete
export function markPublicOnboardingComplete(): void {
  savePublicOnboardingData({ completed_at: new Date() });
  setCurrentPublicStep('complete');
}

export function isPublicOnboardingComplete(): boolean {
  return !!getPublicOnboardingData().completed_at;
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateCreditorSelection(): boolean {
  const selection = getCreditorSelection();
  if (!selection) return false;
  return selection.selected_creditor_ids.length > 0 || !!(selection.other_creditors && selection.other_creditors.length > 0);
}

export function validateContactInfo(): boolean {
  const info = getContactInfo();
  if (!info) return false;
  return !!(
    info.first_name &&
    info.last_name &&
    info.email &&
    info.phone
  );
}

export function validateDateOfBirth(): boolean {
  const dob = getDateOfBirth();
  if (!dob) return false;
  return !!(dob.day && dob.month && dob.year);
}

export function validateAddressHistory(): boolean {
  const addresses = getAddressHistory();
  if (!addresses) return false;
  return !!(
    addresses.current_address &&
    addresses.current_address.line1 &&
    addresses.current_address.city &&
    addresses.current_address.postcode
  );
}

export function validateDebtDetails(): boolean {
  const debts = getDebtDetails();
  return debts.length > 0 && debts.every(debt =>
    debt.approximate_amount > 0 &&
    debt.debt_status &&
    debt.account_type
  );
}

export function validateReadyForReview(): boolean {
  return (
    validateCreditorSelection() &&
    validateContactInfo() &&
    validateDateOfBirth() &&
    validateAddressHistory() &&
    validateDebtDetails()
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getDocumentName(code: DocumentAcknowledgement['document_code']): string {
  const names: Record<DocumentAcknowledgement['document_code'], string> = {
    'PRIV-001': 'Privacy Notice',
    'SCOPE-001': 'Scope of Services',
    'STAT-001': 'Regulatory Status',
  };
  return names[code];
}

export function getTotalDebtAmount(): number {
  const debts = getDebtDetails();
  return debts.reduce((sum, debt) => sum + debt.approximate_amount, 0);
}

export function getDebtCount(): number {
  return getDebtDetails().length;
}

export function getCreditorCount(): number {
  const selection = getCreditorSelection();
  if (!selection) return 0;
  
  let count = selection.selected_creditor_ids.length;
  if (selection.other_creditors) {
    count += selection.other_creditors.length;
  }
  return count;
}

