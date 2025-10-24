// Types for the restructured Debtfly flow

// ============================================
// PUBLIC FLOW (Pages 1-8) - No Authentication
// ============================================

export interface Creditor {
  id: string;
  name: string;
  category: 'credit_card' | 'personal_loan' | 'payday_loan' | 'store_card' | 'overdraft' | 'mortgage' | 'other';
  logo_url?: string;
  active: boolean;
}

// Page 1: Creditor Selection
export interface CreditorSelection {
  selected_creditor_ids: string[];
  other_creditors?: string[]; // For "Other/Not Listed"
}

// Page 3: Name & Contact Info
export interface ContactInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Page 4: Date of Birth
export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

// Page 5: Address
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  lived_3_years: boolean;
}

export interface AddressHistory {
  current_address: Address;
  previous_address?: Address; // If lived < 3 years at current
}

// Page 6: Debt Details (per creditor)
export interface DebtDetails {
  id: string;
  creditor_id: string;
  creditor_name: string;
  account_number?: string;
  approximate_amount: number;
  debt_status: 'active' | 'in_default' | 'ccj_issued' | 'other';
  account_type: 'credit_card' | 'personal_loan' | 'overdraft' | 'mortgage' | 'store_card' | 'payday_loan' | 'other';
}

// Page 7: Document Acknowledgements
export interface DocumentAcknowledgement {
  document_code: 'PRIV-001' | 'SCOPE-001' | 'STAT-001';
  document_name: string;
  acknowledged: boolean;
  acknowledged_at?: Date;
  ip_address?: string;
}

// Complete public onboarding data
export interface PublicOnboardingData {
  creditor_selection?: CreditorSelection;
  contact_info?: ContactInfo;
  date_of_birth?: DateOfBirth;
  address_history?: AddressHistory;
  debts?: DebtDetails[];
  document_acknowledgements?: DocumentAcknowledgement[];
  completed_at?: Date;
}

// ============================================
// PORTAL FLOW - "Select Your Plan"
// ============================================

// Step 1: Fee Presentation
export interface FeeCalculation {
  total_debt: number;
  fee_percentage: number;
  calculated_fee: number;
  final_fee: number; // After min/max caps
  min_capped: boolean;
  max_capped: boolean;
  fee_acknowledged: boolean;
  acknowledged_at?: Date;
}

// Step 2: Affordability Assessment
export interface BasicAffordability {
  // Income
  employment_income: number;
  benefits_income: number;
  other_income: number;
  total_monthly_income: number;

  // Expenses
  housing_costs: number;
  utilities: number;
  food_shopping: number;
  transport: number;
  insurance: number;
  other_expenses: number;
  existing_debt_payments: number;
  total_monthly_expenses: number;

  // Calculation
  disposable_income: number;
  affordable_payment: number;

  // Pathway decision
  pathway: '12_in_12' | 'regulated_credit' | 'fee_relief' | null;
}

// Step 2A: Detailed I&E (Regulated Credit only)
export interface DetailedAffordability extends BasicAffordability {
  // Detailed income breakdown
  income_details: {
    employment_status: 'employed' | 'self_employed' | 'unemployed' | 'retired';
    employer_name?: string;
    job_title?: string;
    employment_length?: string;
    salary_frequency: 'weekly' | 'monthly' | 'annual';
    benefits_breakdown: string[];
    other_income_sources: string[];
  };

  // Detailed expenses
  expense_details: {
    housing_type: 'rent' | 'mortgage' | 'owned' | 'living_with_family';
    num_dependents: number;
    household_size: number;
    council_tax: number;
    water: number;
    electricity: number;
    gas: number;
    phone_internet: number;
    tv_license: number;
    childcare_costs: number;
    school_costs: number;
    clothing: number;
    health_prescriptions: number;
    pet_costs: number;
  };

  // Existing commitments
  existing_commitments: {
    creditor: string;
    monthly_payment: number;
    balance: number;
    payment_current: boolean;
  }[];

  // Stress testing
  stress_test: {
    income_loss_impact: string;
    expense_increase_impact: string;
    emergency_fund: boolean;
  };

  // Verification
  information_accurate: boolean;
  verified_at?: Date;
}

// Step 3: Agreements & Signatures
export interface AgreementSignature {
  agreement_type: 'CCL' | '12_IN_12' | 'REGULATED_CREDIT' | 'SECCI' | 'ADEQUATE_EXPLANATIONS';
  document_code: string;
  full_name: string; // Text signature (name in calligraphy)
  signed_at: Date;
  ip_address: string;
  user_agent: string;
}

export interface ClientCareLetter {
  document_code: 'CCL-TOB-001';
  signature: AgreementSignature;
}

export interface TwelveInTwelveAgreement {
  document_code: 'AGR-12x12-001';
  total_fee: number;
  num_instalments: number; // Max 12
  instalment_amount: number;
  duration_months: number; // Max 12
  interest_rate: 0;
  signature: AgreementSignature;
}

export interface RegulatedCreditAgreement {
  document_code: 'AGR-RC-001';
  total_credit: number;
  num_instalments: number;
  instalment_amount: number;
  duration_months: number;
  apr: 0;
  pre_contract_info_code: 'PCI-RC-001';
  adequate_explanations_code: 'COB-AX-SCRIPT-001';
  signatures: AgreementSignature[]; // Multiple docs to sign
}

// Step 4: Payment Method
export type PaymentMethod = 'direct_debit' | 'bank_transfer' | 'debit_card';

export interface PaymentMethodDetails {
  method: PaymentMethod;
  
  // Direct Debit
  sort_code?: string;
  account_number?: string;
  account_holder_name?: string;
  
  // Bank Transfer (Standing Order)
  bank_name?: string;
  reference?: string;
  
  // Debit Card (per-payment authorization, NO CPA)
  card_last_4?: string;
  card_expiry?: string;
  
  mandate_signed: boolean;
  mandate_signed_at?: Date;
}

export interface PaymentSchedule {
  total_amount: number;
  num_instalments: number;
  instalment_amount: number;
  frequency: 'monthly';
  start_date: Date;
  end_date: Date;
  first_payment_date: Date;
  agreement_type: '12_in_12' | 'regulated_credit';
}

// Step 5: ID Verification
export interface IDVerification {
  // ID Document
  id_document_type: 'passport' | 'driving_licence' | 'national_id';
  id_document_url: string;
  id_document_uploaded_at: Date;
  
  // Proof of Address
  proof_type: 'utility_bill' | 'bank_statement' | 'council_tax' | 'government_letter';
  proof_document_url: string;
  proof_document_uploaded_at: Date;
  proof_date: Date; // Must be within 3 months
  
  // AML Record
  aml_check_status: 'pending' | 'verified' | 'failed';
  aml_checked_at?: Date;
  aml_checked_by?: string;
  aml_notes?: string;
}

// Complete plan selection data
export interface PlanSelectionData {
  fee_calculation?: FeeCalculation;
  affordability_assessment?: BasicAffordability | DetailedAffordability;
  pathway: '12_in_12' | 'regulated_credit' | 'fee_relief' | null;
  client_care_letter?: ClientCareLetter;
  credit_agreement?: TwelveInTwelveAgreement | RegulatedCreditAgreement;
  payment_method?: PaymentMethodDetails;
  payment_schedule?: PaymentSchedule;
  id_verification?: IDVerification;
  completed_at?: Date;
}

// ============================================
// CASE MANAGEMENT
// ============================================

export interface Case {
  id: string;
  reference_number: string;
  user_id: string;
  
  // Data from public flow
  public_onboarding: PublicOnboardingData;
  
  // Data from plan selection
  plan_selection?: PlanSelectionData;
  
  // Status
  status: 'pending' | 'plan_selection' | 'active' | 'complete' | 'closed';
  stage: 'onboarding' | 'requesting_documents' | 'reviewing' | 'negotiating' | 'complete';
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  activated_at?: Date;
  completed_at?: Date;
}

// ============================================
// USER
// ============================================

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth?: DateOfBirth;
  
  // Case association
  case_id?: string;
  
  // Status
  public_onboarding_complete: boolean;
  plan_selection_complete: boolean;
  is_verified: boolean;
  
  created_at: Date;
  updated_at: Date;
}

// ============================================
// DOCUMENT TEMPLATES
// ============================================

export interface DocumentTemplate {
  code: string;
  name: string;
  category: 'transparency' | 'fee' | 'agreement' | 'pre_contract' | 'identity';
  version: string;
  content: string; // HTML or Markdown
  requires_signature: boolean;
  requires_acknowledgement: boolean;
  active: boolean;
}

// Document codes
export type DocumentCode =
  | 'PRIV-001'           // Privacy Notice
  | 'SCOPE-001'          // Scope of Services
  | 'STAT-001'           // Regulatory Status
  | 'FEE-SUM-001'        // Fee Summary
  | 'AFF-GATE-001'       // Affordability Gate Form
  | 'CCL-TOB-001'        // Client Care Letter & Terms of Business
  | 'AGR-12x12-001'      // 12-in-12 Instalment Agreement
  | 'AGR-RC-001'         // Regulated Credit Agreement
  | 'PCI-RC-001'         // Pre-Contract Credit Information (SECCI)
  | 'COB-AX-SCRIPT-001'  // Adequate Explanations Summary
  | 'PMT-MTH-001'        // Payment Method Mandate
  | 'IDV-001'            // ID & Address Verification Pack
  | 'AML-SOF-001'        // AML Source of Funds
  | 'FEE-REL-001';       // Fee Relief Options

// ============================================
// UTILITY TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

