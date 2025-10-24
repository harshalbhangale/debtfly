// Mock data types matching DB schema

export type DebtStage =
  | 'awaiting_signup'
  | 'disclosure_requested'
  | 'temporarily_unenforceable'
  | 'under_review'
  | 'enforceable'
  | 'permanently_unenforceable'
  | 'written_off';

export type DebtStatus = 'active' | 'default' | 'settled';

export type LikelihoodBand = 'low' | 'medium' | 'high';

export interface Debt {
  id: string;
  client_id: string;
  creditor_id: string;
  creditor_name: string;
  account_ref: string;
  original_balance: number;
  current_balance: number;
  status: DebtStatus;
  stage: DebtStage;
  date_opened?: Date | null;
  date_default?: Date | null;
  sla_due_date?: Date | null;
  is_enforceable: boolean;
  likelihood: LikelihoodBand;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentPlan {
  id: string;
  client_id: string;
  total_fee: number;
  monthly_amount: number;
  duration_months: number;
  cadence: 'monthly' | 'weekly';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  remaining_bal: number;
  next_due_date: Date;
  signed_at: Date;
  created_by_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  plan_id: string;
  payment_date: Date;
  actual_date?: Date | null;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway_ref?: string;
  gateway_status?: string;
  failure_reason?: string;
  refund_reason?: string;
  reconciled: boolean;
  notes?: string;
  created_at: Date;
}

export interface Document {
  id: string;
  client_id: string;
  debt_id?: string | null;
  request_id?: string | null;
  file_name: string;
  file_type: string;
  source: 'upload' | 'request' | 'generated';
  uploaded_by: string;
  is_verified: boolean;
  ocr_text?: string | null;
  hash?: string;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface Request {
  id: string;
  debt_id: string;
  type: 'LOA' | 'CCA' | 'DSAR';
  sent_at: Date;
  sent_via: 'email' | 'post';
  proof?: string | null;
  received_at?: Date | null;
  is_complete: boolean;
  chaser_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  id: string;
  debt_id?: string | null;
  client_id?: string;
  event_type: string;
  description: string;
  entity_id?: string | null;
  actor_type: string;
  action: string;
  before?: Record<string, unknown>;
  ip_address?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  date_of_birth?: Date | null;
  onboarding_complete: boolean;
  signed_at?: Date | null;
  is_verified: boolean;
  tasks_complete: {
    uploadId: boolean;
    addressVerified: boolean;
    signatureComplete: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Creditor {
  id: string;
  name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  postal_address?: string | null;
  sla_days?: number | null;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OnboardingData {
  qualifying?: {
    totalDebt: number;
    monthlyPayments: number;
    currentlyPaying: 'yes' | 'no' | 'some';
    anyInDefault: 'yes' | 'no' | 'not_sure';
  };
  identity?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: { day: string; month: string; year: string };
    currentAddress: {
      postcode: string;
      line1: string;
      line2?: string;
      city: string;
      formatted: string;
    };
    addressHistory?: Array<{
      postcode: string;
      formatted: string;
      from: Date;
      to: Date;
    }>;
  };
  signature?: {
    dataUrl: string;
    consentCRA: boolean;
    consentTerms: boolean;
    signedAt: Date;
  };
  debts?: Debt[];
  plan?: {
    totalFee: number;
    selectedDuration: number;
    monthlyAmount: number;
  };
  payment?: {
    method: 'direct_debit' | 'card';
    accountDetails?: Record<string, string>;
  };
}

