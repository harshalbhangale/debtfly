# Debtfly Flow Analysis: Current vs Desired

## Executive Summary

**Current Status**: ❌ **Significant Misalignment**

Your current implementation has good foundations (components, UI, auth) but the **user flow is completely different** from your specification. Major restructuring is needed.

---

## Flow Comparison

### 🎯 DESIRED FLOW (From Spec)

```
PUBLIC WEB (No Login Required - Pages 1-8)
1. Creditor Selection → Select creditors from list
2. Information Page → Transition/reassurance page
3. Name & Contact → Name, email, phone
4. Date of Birth → DOB verification (18+)
5. Address → Postcode lookup + address
6. Debt Details Loop → Per-creditor: amount, status, type
7. Review + Documents → Review all debts + acknowledge docs
8. Account Creation → Magic link sent, redirect to portal

PORTAL (Login Required - After Magic Link)
9. Portal Dashboard → Shows debts, case status
10. "Select Your Plan" Flow → Multi-step:
    - Fee presentation
    - Affordability assessment
    - Credit agreement signing
    - Payment method setup
    - ID verification upload
    - Onboarding complete
```

### 🔴 CURRENT FLOW (What Exists)

```
1. / → Redirects to /qualifying
2. /qualifying → Qualifying questions (debt amount, payments, default status)
3. /identity → Name, email, phone, DOB, address (ALL IN ONE)
4. /signature → E-signature capture
5. /debts → Add debts manually or CRA search
6. /debts/display → Review debts
7. /plan → Choose payment plan (6/12/24 months)
8. /payment → Payment method setup
9. /dashboard → Dashboard (requires auth but guards disabled)
```

---

## ❌ What's WRONG

### 1. **Flow Order is Backwards**
- **Current**: Qualifying questions → Identity → Signature → Debts
- **Desired**: Creditors first → Personal info → Debts details → Documents → Account creation
- **Issue**: You're asking for signature BEFORE collecting debts, which doesn't match the spec

### 2. **Missing Critical Pages**
| Missing Page | Purpose |
|--------------|---------|
| Creditor Selection | Multi-select creditors before anything else |
| Information/Success Page | Transition page after creditor selection |
| Separate DOB Page | DOB should be separate from identity (Page 4) |
| Debt Details Loop | One page per creditor with specific fields |
| Review + Documents Page | Review ALL debts + acknowledge transparency docs |
| Account Creation Confirmation | Confirmation page with magic link email |

### 3. **Wrong Page Content**
| Page | Current | Should Be |
|------|---------|-----------|
| Qualifying | Debt amount, payments, default questions | **Should NOT exist** - These questions don't appear in spec |
| Identity | Everything combined (name, email, DOB, address) | **Should be split**: Name/Contact (P3), DOB (P4), Address (P5) |
| Signature | E-signature capture early | **Wrong place** - Signature should be in Portal "Select Your Plan" flow (Step 3) |

### 4. **Authentication Timing is Wrong**
- **Current**: Can access dashboard without completing onboarding (guards disabled)
- **Desired**: 
  - Pages 1-8 = PUBLIC (no auth needed)
  - Portal Dashboard = SECURED (only after magic link from Page 8)
  - Magic link sent AFTER Page 8 completion

### 5. **"Select Your Plan" Flow Missing**
The entire portal flow is missing:
- ❌ Fee presentation with FEE-SUM-001
- ❌ Affordability assessment (AFF-GATE-001)
- ❌ 12-in-12 vs Regulated Credit pathway logic
- ❌ Detailed I&E for regulated credit
- ❌ Multiple agreement types (CCL, 12-in-12, Regulated Credit)
- ❌ ID verification upload

### 6. **Document Management Missing**
- ❌ No transparency document acknowledgements (PRIV-001, SCOPE-001, STAT-001)
- ❌ No document tracking system
- ❌ No signature audit trail
- ❌ No pre-contract credit info (SECCI)

### 7. **Database Structure Missing**
Current storage uses localStorage. Spec requires:
- ❌ `creditors` table (reference data)
- ❌ `cases` table (case management)
- ❌ `signature_audit` table (audit trail)
- ❌ `affordability` table (assessment data)
- ❌ `document_acknowledgements` table
- ❌ `aml_records` table (AML/CDD)
- ❌ `payment_schedules` table

---

## ✅ What's CORRECT

### Good Foundations

1. **✅ UI Components**
   - Button, Card, Input, Form components are solid
   - Design system with Tailwind configured correctly
   - Responsive layouts work well

2. **✅ Magic Link Authentication**
   - `/app/(auth)/login/` - Magic link email sending
   - `/app/(auth)/verify/` - Magic link verification
   - `/lib/auth/magic-link.ts` - Auth logic works

3. **✅ Component Architecture**
   - NextButton, ProgressBar components
   - AddressSearch with GetAddress integration
   - SignatureCanvas component
   - DebtCard components

4. **✅ Storage Pattern**
   - localStorage abstraction in `/lib/storage/`
   - Can be easily migrated to API calls

5. **✅ Styling**
   - Tailwind v3 configured correctly
   - Color scheme working
   - Design tokens in place

6. **✅ TypeScript Setup**
   - Type definitions exist
   - Good type safety throughout

---

## 🔧 What Needs to CHANGE

### Priority 1: Restructure Pages (CRITICAL)

#### DELETE These Pages:
```
❌ /app/(onboarding)/qualifying/page.tsx - Not in spec
❌ /app/(onboarding)/signature/page.tsx - Wrong place (should be in portal)
❌ /app/(onboarding)/plan/page.tsx - Wrong place (should be in portal)
❌ /app/(onboarding)/payment/page.tsx - Wrong place (should be in portal)
```

#### CREATE These Pages:
```
✅ /app/(public)/creditors/page.tsx - Page 1: Creditor Selection
✅ /app/(public)/info/page.tsx - Page 2: Information/Success Page
✅ /app/(public)/contact/page.tsx - Page 3: Name & Contact Info
✅ /app/(public)/dob/page.tsx - Page 4: Date of Birth
✅ /app/(public)/address/page.tsx - Page 5: Address
✅ /app/(public)/debt-details/page.tsx - Page 6: Debt Details Loop
✅ /app/(public)/review/page.tsx - Page 7: Review + Documents
✅ /app/(public)/complete/page.tsx - Page 8: Account Creation
```

#### MODIFY These Pages:
```
📝 /app/(onboarding)/identity/page.tsx → Split into 3 pages (contact, dob, address)
📝 /app/(onboarding)/debts/page.tsx → Becomes debt details loop page
📝 /app/(onboarding)/debts/display/page.tsx → Merge into review page
```

#### CREATE Portal Flow Pages:
```
✅ /app/(portal)/plan/step-1-fee/page.tsx - Fee Presentation
✅ /app/(portal)/plan/step-2-affordability/page.tsx - Affordability Assessment
✅ /app/(portal)/plan/step-2a-detailed-ie/page.tsx - Detailed I&E (conditional)
✅ /app/(portal)/plan/step-3-agreements/page.tsx - Terms & Signing
✅ /app/(portal)/plan/step-4-payment/page.tsx - Payment Method Setup
✅ /app/(portal)/plan/step-5-id-verification/page.tsx - ID Upload
✅ /app/(portal)/plan/step-6-complete/page.tsx - Complete
```

---

### Priority 2: Reorganize Folder Structure

#### Current Structure Problems:
- Everything is in `(onboarding)` route group
- No separation between public web and portal
- No clear distinction between authenticated/unauthenticated

#### Proposed New Structure:

```
/app
├── (public)                    # Pages 1-8 (NO AUTH)
│   ├── layout.tsx             # Public layout (no auth required)
│   ├── page.tsx               # Redirect to /creditors
│   ├── creditors/
│   │   └── page.tsx           # Page 1: Creditor Selection
│   ├── info/
│   │   └── page.tsx           # Page 2: Success/Information
│   ├── contact/
│   │   └── page.tsx           # Page 3: Name & Contact
│   ├── dob/
│   │   └── page.tsx           # Page 4: Date of Birth
│   ├── address/
│   │   └── page.tsx           # Page 5: Address
│   ├── debt-details/
│   │   └── page.tsx           # Page 6: Debt Details Loop
│   ├── review/
│   │   └── page.tsx           # Page 7: Review + Documents
│   └── complete/
│       └── page.tsx           # Page 8: Account Creation
│
├── (auth)                      # Auth pages (CURRENT - KEEP)
│   ├── login/
│   └── verify/
│
├── (portal)                    # PORTAL (AUTH REQUIRED)
│   ├── layout.tsx             # Portal layout with AuthGuard
│   ├── dashboard/
│   │   └── page.tsx           # Portal Dashboard
│   ├── debts/
│   │   ├── page.tsx           # Manage debts
│   │   ├── [id]/
│   │   └── add/
│   ├── documents/
│   │   └── page.tsx           # View documents
│   ├── profile/
│   │   └── page.tsx           # Profile settings
│   └── plan/                  # "SELECT YOUR PLAN" FLOW
│       ├── step-1-fee/
│       │   └── page.tsx       # Fee Presentation (FEE-SUM-001)
│       ├── step-2-affordability/
│       │   └── page.tsx       # Affordability Assessment (AFF-GATE-001)
│       ├── step-2a-detailed-ie/
│       │   └── page.tsx       # Detailed I&E (Regulated Credit only)
│       ├── step-3-agreements/
│       │   └── page.tsx       # Agreements & Signatures
│       ├── step-4-payment/
│       │   └── page.tsx       # Payment Method Setup
│       ├── step-5-id-verification/
│       │   └── page.tsx       # ID Upload (IDV-001, AML-SOF-001)
│       └── step-6-complete/
│           └── page.tsx       # Onboarding Complete
│
├── layout.tsx                  # Root layout
├── page.tsx                   # Root redirect to /creditors
└── globals.css

/components
├── public/                     # Components for public pages 1-8
│   ├── CreditorList.tsx
│   ├── ContactForm.tsx
│   ├── DOBForm.tsx
│   ├── AddressLookup.tsx
│   ├── DebtDetailsForm.tsx
│   ├── DebtReviewCard.tsx
│   └── DocumentAcknowledgement.tsx
│
├── portal/                     # Components for portal
│   ├── dashboard/
│   │   ├── Header.tsx         # KEEP (already exists)
│   │   ├── DebtCard.tsx
│   │   ├── KPICard.tsx        # KEEP
│   │   └── ActivityTimeline.tsx # KEEP
│   ├── plan/
│   │   ├── FeeBreakdown.tsx
│   │   ├── AffordabilityForm.tsx
│   │   ├── IEForm.tsx
│   │   ├── AgreementViewer.tsx
│   │   ├── SignatureCapture.tsx
│   │   ├── PaymentMethodForm.tsx
│   │   └── IDUpload.tsx
│
├── shared/                     # Shared components (both public & portal)
│   ├── ProgressIndicator.tsx
│   ├── BackButton.tsx
│   └── ContinueButton.tsx
│
└── ui/                         # UI primitives (KEEP - already good)
    ├── button.tsx
    ├── card.tsx
    └── ...

/lib
├── api/                        # API integration (when ready)
│   ├── public/                # Public API endpoints
│   │   ├── creditors.ts
│   │   ├── users.ts
│   │   └── onboarding.ts
│   └── portal/                # Portal API endpoints
│       ├── cases.ts
│       ├── debts.ts
│       ├── documents.ts
│       └── plan.ts
│
├── storage/                    # localStorage abstractions (temporary)
│   ├── onboarding.ts
│   ├── debts.ts
│   ├── users.ts
│   ├── cases.ts
│   ├── documents.ts
│   └── affordability.ts
│
├── auth/
│   ├── magic-link.ts          # KEEP
│   └── session.ts             # KEEP
│
├── calculations/
│   ├── fee.ts                 # KEEP & ENHANCE
│   └── affordability.ts       # NEW - Affordability calculations
│
├── documents/                  # NEW - Document management
│   ├── templates.ts           # Document templates (FEE-SUM-001, etc.)
│   ├── acknowledgements.ts    # Track acknowledgements
│   └── signatures.ts          # Signature audit trail
│
├── validation/                 # NEW - Form validation
│   ├── contact.ts
│   ├── dob.ts
│   ├── address.ts
│   ├── debt.ts
│   └── affordability.ts
│
└── types/
    ├── onboarding.ts
    ├── portal.ts
    ├── documents.ts
    ├── affordability.ts
    └── index.ts
```

---

### Priority 3: Database/Storage Layer

Create proper data models for:

```typescript
// /lib/types/database.ts

interface Creditor {
  id: string;
  name: string;
  category: 'credit_card' | 'personal_loan' | 'payday_loan' | 'mortgage' | 'other';
  active: boolean;
}

interface Case {
  id: string;
  user_id: string;
  reference_number: string;
  status: 'pending' | 'active' | 'complete' | 'closed';
  created_at: Date;
  updated_at: Date;
}

interface Debt {
  id: string;
  case_id: string;
  creditor_id: string;
  creditor_name: string;
  account_number?: string;
  amount_owed: number;
  debt_status: 'active' | 'in_default' | 'ccj_issued' | 'other';
  account_type: string;
  created_at: Date;
  updated_at: Date;
}

interface SignatureAudit {
  id: string;
  user_id: string;
  document_id: string;
  document_type: string; // 'CCL', '12-IN-12', 'REGULATED_CREDIT'
  signature_data: string; // Base64 signature
  ip_address: string;
  timestamp: Date;
}

interface DocumentAcknowledgement {
  id: string;
  user_id: string;
  document_code: string; // 'PRIV-001', 'SCOPE-001', 'STAT-001'
  acknowledged_at: Date;
  ip_address: string;
}

interface AffordabilityAssessment {
  id: string;
  user_id: string;
  case_id: string;
  assessment_type: 'basic' | 'detailed'; // 'basic' for 12-in-12, 'detailed' for regulated
  monthly_income: number;
  monthly_expenses: number;
  disposable_income: number;
  pathway: '12_in_12' | 'regulated_credit' | 'fee_relief';
  data: Record<string, any>; // Full I&E data
  created_at: Date;
}

interface PaymentSchedule {
  id: string;
  user_id: string;
  case_id: string;
  total_amount: number;
  num_instalments: number;
  instalment_amount: number;
  frequency: 'monthly';
  start_date: Date;
  end_date: Date;
  agreement_type: '12_in_12' | 'regulated_credit';
  apr: number; // 0% for your case
}

interface AMLRecord {
  id: string;
  user_id: string;
  verification_status: 'pending' | 'verified' | 'failed';
  id_document_type: 'passport' | 'driving_licence' | 'national_id';
  id_document_url: string;
  proof_of_address_url: string;
  verified_at?: Date;
  verified_by?: string;
}
```

---

### Priority 4: Flow Logic

#### Public Flow (Pages 1-8) - OnboardingGuard

```typescript
// lib/guards/public-flow-guard.ts
const publicSteps = [
  'creditors',    // Page 1
  'info',         // Page 2
  'contact',      // Page 3
  'dob',          // Page 4
  'address',      // Page 5
  'debt-details', // Page 6
  'review',       // Page 7
  'complete',     // Page 8
];

// Prevent skipping ahead
// Store progress in localStorage
// Allow going back
```

#### Portal Flow (Plan Selection) - PlanFlowGuard

```typescript
// lib/guards/plan-flow-guard.ts
const planSteps = [
  'step-1-fee',
  'step-2-affordability',
  'step-2a-detailed-ie', // Conditional
  'step-3-agreements',
  'step-4-payment',
  'step-5-id-verification',
  'step-6-complete',
];

// Logic for 12-in-12 vs Regulated Credit pathway
// Skip step-2a if 12-in-12 pathway
```

---

## 📋 Action Plan

### Phase 1: Restructure (Week 1-2)

1. **Create new folder structure**
   - Create `(public)` route group
   - Rename `(onboarding)` to `(portal)`
   - Create `plan/` subdirectories

2. **Build Page 1-8 (Public Flow)**
   - Page 1: Creditor Selection
   - Page 2: Information Page
   - Page 3: Contact Info
   - Page 4: DOB
   - Page 5: Address
   - Page 6: Debt Details Loop
   - Page 7: Review + Documents
   - Page 8: Account Creation + Magic Link

3. **Update routing**
   - Root `/` → `/creditors`
   - Remove old onboarding routes
   - Set up proper redirects

### Phase 2: Portal Dashboard (Week 2-3)

1. **Portal Dashboard**
   - Show debts added in Pages 1-8
   - Edit/Delete debts
   - "Select Your Plan" CTA button

2. **Guards**
   - Re-enable AuthGuard for portal
   - Implement PlanFlowGuard
   - Implement PublicFlowGuard

### Phase 3: Plan Flow (Week 3-5)

1. **Step 1: Fee Presentation**
   - FEE-SUM-001 template
   - Fee calculation display
   - Acknowledgement checkbox

2. **Step 2: Affordability Assessment**
   - Basic I&E form
   - Pathway logic (12-in-12 vs Regulated)
   - Decision routing

3. **Step 2A: Detailed I&E** (Conditional)
   - Full I&E form
   - Creditworthiness assessment
   - CONC 5.2A compliance

4. **Step 3: Agreements & Signatures**
   - CCL-TOB-001 display & signature
   - AGR-12x12-001 OR AGR-RC-001 (conditional)
   - PCI-RC-001 & COB-AX-SCRIPT-001 (if regulated)
   - Signature audit trail

5. **Step 4: Payment Method**
   - Direct Debit setup
   - Bank transfer instructions
   - No CPA tokens

6. **Step 5: ID Verification**
   - ID document upload
   - Proof of address upload
   - AML record creation

7. **Step 6: Complete**
   - Confirmation page
   - Case activated
   - Email sent

### Phase 4: Document Management (Week 5-6)

1. **Document Templates**
   - Create all document templates
   - Store in database/storage
   - Version control

2. **Signature Audit Trail**
   - Store all signatures
   - Timestamp, IP, document ID
   - Compliance logging

3. **Acknowledgement Tracking**
   - Track all document acknowledgements
   - Timestamps and IP addresses

### Phase 5: Database Migration (Week 6-8)

1. **Set up proper database**
   - PostgreSQL or similar
   - Migration from localStorage
   - API endpoints

2. **API layer**
   - Public API endpoints
   - Portal API endpoints
   - Authentication middleware

---

## 🎯 Immediate Next Steps (Today)

1. **Accept the situation**: Current implementation doesn't match spec
2. **Make a decision**: 
   - Option A: Full restructure (recommended)
   - Option B: Adjust spec to match current flow
3. **If Option A**: Start Phase 1
   - Create new folder structure
   - Build Page 1 (Creditor Selection)
   - Test the flow

---

## 💡 Recommendations

### 1. **Follow the Spec**
Your spec is well-thought-out and compliance-focused. It's worth following it properly rather than adjusting it to match the current code.

### 2. **Iterative Migration**
- Keep current code as reference
- Build new pages alongside
- Migrate components (reuse what works)
- Switch over when ready

### 3. **Component Reuse**
Good news: Many components can be reused!
- ✅ UI components (button, card, input) - All good
- ✅ AddressSearch - Reuse in Page 5
- ✅ SignatureCanvas - Move to portal Step 3
- ✅ DebtCard - Reuse in Page 7 and portal
- ✅ Magic link auth - Already working

### 4. **Database Early**
Consider setting up a proper database ASAP rather than localStorage. The spec clearly requires:
- Audit trails
- Document tracking
- Compliance records
- These are hard to retrofit later

---

## Questions to Answer

1. **Do you want to follow the spec exactly or adjust it?**
2. **Timeline: How quickly do you need this complete?**
3. **Database: When do you want to move off localStorage?**
4. **Do you have backend API endpoints ready or need to build them?**
5. **Compliance documents: Do you have the actual document templates?**

---

Let me know your decision and I can start implementing the restructure immediately.

