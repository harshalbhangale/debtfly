# Claimtech Onboarding Flow - Visual Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ONBOARDING FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────────────────────────┐
│  STEP 1: Lender Selection           │
│  Route: /                           │
│  Progress: 1/4                      │
│                                     │
│  • Select lenders (2007-2021)       │
│  • Main lenders (priority 10)       │
│  • More lenders (expandable)        │
│  • Can SKIP                         │
│  • Saves to localStorage            │
│                                     │
│  Actions:                           │
│  ├─ [Skip] ──────────────┐          │
│  └─ [Next Step] ─────────┤          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 2: User Details               │
│  Route: /auth/userdetails           │
│  Progress: 2/4                      │
│                                     │
│  • First Name (required)            │
│  • Last Name (required)             │
│  • Date of Birth (DD/MM/YYYY)       │
│    - Must be 18+                    │
│    - Auto-focus between fields      │
│  • Auto-save (2s debounce)          │
│                                     │
│  Validation:                        │
│  ├─ Name: not empty                 │
│  ├─ DOB: valid date                 │
│  └─ Age: >= 18 years                │
│                                     │
│  Actions:                           │
│  └─ [Next Step] ─────────┐          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 3: Address Search             │
│  Route: /auth/addresssearch         │
│  Progress: 3/4                      │
│                                     │
│  Flow:                              │
│  1. Enter UK Postcode               │
│  2. Click [Find] / Press Enter      │
│  3. API Call (CheckIO)              │
│  4. Display Address Dropdown        │
│  5. Select Address                  │
│  6. Preview Selected                │
│                                     │
│  Validation:                        │
│  └─ UK Postcode format              │
│                                     │
│  Actions:                           │
│  └─ [Next Step] ─────────┐          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 4: Contact Details            │
│  Route: /auth/contactdetails        │
│  Progress: 4/4                      │
│                                     │
│  • Email Address (required)         │
│  • Phone Number (UK format)         │
│  • Marketing preferences (opt)      │
│  • Terms & Conditions checkbox      │
│                                     │
│  Validation:                        │
│  ├─ Email: valid format             │
│  ├─ Phone: UK format                │
│  └─ Terms: must accept              │
│                                     │
│  Actions:                           │
│  └─ [Submit] ────────────┐          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 5: Signature                  │
│  Route: /auth/signature             │
│                                     │
│  • Canvas signature pad             │
│  • Clear/Redo button                │
│  • Must draw signature              │
│  • Preview before submit            │
│                                     │
│  Actions:                           │
│  ├─ [Clear]                         │
│  └─ [Submit Signature] ──┐          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 6: Searching Agreements       │
│  Route: /auth/searching             │
│                                     │
│  • Loading animation                │
│  • "Searching for agreements..."    │
│  • Progress indicators              │
│  • Auto-redirect when complete      │
│                                     │
│  Backend Process:                   │
│  ├─ Search credit file              │
│  ├─ Match lender records            │
│  ├─ Verify agreements               │
│  └─ Generate claims                 │
│                                     │
│  Outcomes:                          │
│  ├─ Agreements Found ────┐          │
│  └─ No Agreements ───────┤          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 7: OTP Verification           │
│  Route: /auth/otpverify             │
│                                     │
│  • 6-digit OTP code                 │
│  • Auto-focus between inputs        │
│  • Resend code option               │
│  • Countdown timer (60s)            │
│                                     │
│  Actions:                           │
│  ├─ [Resend Code]                   │
│  └─ [Verify] ────────────┐          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  STEP 8: Missing Agreements         │
│  Route: /auth/missingagreements     │
│  (Optional - only if no agreements) │
│                                     │
│  • List of missing lenders          │
│  • Add agreement manually           │
│  • Can skip                         │
│                                     │
│  Actions:                           │
│  ├─ [Add Agreement]                 │
│  ├─ [Skip] ──────────────┐          │
│  └─ [Continue] ──────────┤          │
└──────────────────────────┼──────────┘
                           │
                           ▼
┌─────────────────────────────────────┐
│  ONBOARDING COMPLETE                │
│  Redirect to: /dashboard            │
│                                     │
│  • Create user account              │
│  • Generate JWT tokens              │
│  • Store in localStorage            │
│  • Clear onboarding data            │
└─────────────────────────────────────┘
                           │
                           ▼
┌═════════════════════════════════════┐
║           DASHBOARD                 ║
└═════════════════════════════════════┘
```

---

## Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD VIEW                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  HEADER                                                               │
│  ┌────────┐  Navigation               User Menu ▼                    │
│  │  LOGO  │  • How it Works           • Profile                      │
│  └────────┘  • Refer Friend           • Logout                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  YOUR DASHBOARD                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  HOW IT WORKS BANNER                                                  │
│  ► Learn about the claim process                   [Learn More →]    │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  ⚠️  ACTION REQUIRED                                                  │
│  Please upload your ID document                    [Upload ID →]     │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  EVERYTHING WE NEED                                                   │
│  ✓ Profile Information                                                │
│  ✓ Address Verification                                               │
│  ✗ ID Document Upload                    [Complete →]                │
│  ✓ Signature                                                          │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  OPEN CLAIMS                                                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  CLAIM CARD #1                      [Action Required] Badge     │ │
│  │  ┌────────────────────────────────────────────────┐             │ │
│  │  │  Santander Consumer UK    [Claim Submitted ⚪]  │             │ │
│  │  └────────────────────────────────────────────────┘             │ │
│  │                                                                  │ │
│  │  Progress: ████████████░░░░░░░░░░ 60%                           │ │
│  │                                                                  │ │
│  │  Agreements Found:                                               │ │
│  │  ┌──────────────────────────────────────────┐                   │ │
│  │  │  #AGR12345        Reg: ABC123  [Active]  │                   │ │
│  │  └──────────────────────────────────────────┘                   │ │
│  │  ┌──────────────────────────────────────────┐                   │ │
│  │  │  #AGR67890        Reg: XYZ789  [Active]  │                   │ │
│  │  └──────────────────────────────────────────┘                   │ │
│  │                                                                  │ │
│  │  ⚠️  Additional requirements needed          [+ Add another]    │ │
│  │                                                                  │ │
│  │  ► Evidence Documents (2)                    [▼ View]           │ │
│  │                                                                  │ │
│  │  [View Details]  [Upload Evidence]                              │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  CLAIM CARD #2                                                  │ │
│  │  ┌────────────────────────────────────────────────┐             │ │
│  │  │  Black Horse Finance    [Under Review 🔵]      │             │ │
│  │  └────────────────────────────────────────────────┘             │ │
│  │                                                                  │ │
│  │  Progress: ███████░░░░░░░░░░░░░░░░ 35%                          │ │
│  │                                                                  │ │
│  │  ⚠️  No agreements found - Add your agreements                  │ │
│  │     We couldn't find any agreements automatically.              │ │
│  │                                                                  │ │
│  │  [Add Agreement Details →]                                      │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Claim Card States

### State 1: No Agreements Found
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️  ATTENTION - No agreements found                    │
│                                                         │
│  We couldn't find any agreements automatically.         │
│  You must add your agreement details to proceed.        │
│                                                         │
│  [Add Agreement Details →]                              │
└─────────────────────────────────────────────────────────┘
```

### State 2: Agreements Found (Non-Credit)
```
┌─────────────────────────────────────────────────────────┐
│  Agreements Found: 2                                    │
│                                                         │
│  #AGR12345    Reg: ABC123    [Active]                  │
│  #AGR67890    Reg: XYZ789    [Pending]                 │
│                                                         │
│  We couldn't find any agreements automatically          │
│  on your credit file. If there's any other              │
│  agreements, you can add them here.                     │
│                                                         │
│                                      [+ Add another]    │
└─────────────────────────────────────────────────────────┘
```

### State 3: Additional Requirements
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️  Additional requirements                             │
│                                                         │
│  • Previous address details                             │
│  • Proof of income                                      │
│  • Bank statements (last 3 months)                      │
│                                                         │
│  [Provide Information →]                                │
└─────────────────────────────────────────────────────────┘
```

### State 4: Evidence Section (Collapsed)
```
┌─────────────────────────────────────────────────────────┐
│  ► Evidence Documents (3)                  [▼ Expand]   │
└─────────────────────────────────────────────────────────┘
```

### State 5: Evidence Section (Expanded)
```
┌─────────────────────────────────────────────────────────┐
│  ▼ Evidence Documents (3)                  [▲ Collapse] │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📄  Bank Statement.pdf                         │   │
│  │      Uploaded: 2024-01-15                       │   │
│  │                           [View] [Delete]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📷  ID_Document.jpg                            │   │
│  │      Uploaded: 2024-01-14                       │   │
│  │                           [View] [Delete]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📝  Proof_Address.pdf                          │   │
│  │      Uploaded: 2024-01-13                       │   │
│  │                           [View] [Delete]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [+ Upload Evidence]                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Modal Flows

### 1. Agreement Details Modal
```
┌─────────────────────────────────────────────┐
│  Add Agreement Details              [X]     │
├─────────────────────────────────────────────┤
│                                             │
│  Agreement Number:                          │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Vehicle Registration:                      │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Start Date:                                │
│  ┌───────┬───────┬───────────┐             │
│  │  DD   │  MM   │   YYYY    │             │
│  └───────┴───────┴───────────┘             │
│                                             │
│  Monthly Payment (optional):                │
│  ┌─────────────────────────────────────┐   │
│  │  £                                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│         [Cancel]       [Submit →]           │
└─────────────────────────────────────────────┘
```

### 2. Evidence Upload Modal
```
┌─────────────────────────────────────────────┐
│  Upload Evidence                    [X]     │
├─────────────────────────────────────────────┤
│                                             │
│  Evidence Type:                             │
│  ┌─────────────────────────────────────┐   │
│  │  Select type               ▼        │   │
│  └─────────────────────────────────────┘   │
│    • Bank Statement                         │
│    • Proof of Address                       │
│    • ID Document                            │
│    • Other                                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │      📁  Drag & Drop Files          │   │
│  │           or Click to Browse        │   │
│  │                                     │   │
│  │  Supported: PDF, JPG, PNG           │   │
│  │  Max size: 10MB                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Description (optional):                    │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│         [Cancel]       [Upload →]           │
└─────────────────────────────────────────────┘
```

### 3. ID Document Modal
```
┌─────────────────────────────────────────────┐
│  Upload ID Document                 [X]     │
├─────────────────────────────────────────────┤
│                                             │
│  We need a valid photo ID to verify         │
│  your identity.                             │
│                                             │
│  Accepted documents:                        │
│  ✓ Passport                                 │
│  ✓ Driving License                          │
│  ✓ National ID Card                         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │      📁  Drag & Drop Files          │   │
│  │           or Click to Browse        │   │
│  │                                     │   │
│  │  Supported: JPG, PNG, PDF           │   │
│  │  Max size: 10MB                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⓘ Your ID will be securely encrypted       │
│     and only used for verification.         │
│                                             │
│         [Cancel]       [Upload →]           │
└─────────────────────────────────────────────┘
```

---

## Navigation Flow

```
Landing Page (/)
├─ Start Claim → Lender Selection
└─ Sign In → Login Page

Login Page (/auth/login)
├─ Success → Dashboard
└─ Magic Link → Email Sent

Onboarding Steps
├─ Step 1 (/) → Step 2 (/auth/userdetails)
├─ Step 2 → Step 3 (/auth/addresssearch)
├─ Step 3 → Step 4 (/auth/contactdetails)
├─ Step 4 → Step 5 (/auth/signature)
├─ Step 5 → Step 6 (/auth/searching)
├─ Step 6 → Step 7 (/auth/otpverify)
├─ Step 7 → Complete → Dashboard
└─ Step 8 (optional) → Missing Agreements

Dashboard (/dashboard)
├─ Profile → /dashboard/profile
├─ Document Upload → /dashboard/documentupload
├─ Refer Friend → /dashboard/refer
├─ How It Works → /dashboard/howitworks
└─ Logout → / (Landing)
```

---

## Data Flow

```
User Input → Form State → Validation → Local Storage → API Call → Database

Example: User Details Step

1. User enters First Name
   ↓
2. Update firstName state
   ↓
3. Trigger auto-save (2s debounce)
   ↓
4. Save to localStorage
   ↓
5. User clicks Next
   ↓
6. Validate all fields
   ↓
7. If valid, proceed to next step
   ↓
8. On completion, send all data to API
   ↓
9. API creates user account
   ↓
10. Return JWT tokens
    ↓
11. Store tokens in localStorage
    ↓
12. Clear onboarding localStorage
    ↓
13. Redirect to Dashboard
```

---

## Real-time Updates Flow

```
Dashboard Loaded
  │
  ▼
Initialize React Query
  │
  ▼
Fetch Claims (GET /api/v1/claims/)
  │
  ├─ Success → Display Claims
  │    │
  │    ▼
  │  Set Refetch Interval (30s)
  │    │
  │    ▼
  │  Every 30 seconds:
  │    ├─ Refetch Claims
  │    ├─ Check for updates
  │    └─ Update UI if changes
  │
  └─ Error → Show Error State
       └─ Retry Button

User Actions:
  │
  ├─ Upload Evidence
  │    ├─ POST /api/v1/evidence/
  │    └─ Invalidate ['claims'] query
  │         └─ Triggers immediate refetch
  │
  ├─ Add Agreement
  │    ├─ POST /api/v1/agreements/
  │    └─ Invalidate ['claims'] query
  │         └─ Triggers immediate refetch
  │
  └─ Delete Evidence
       ├─ DELETE /api/v1/evidence/{id}/
       └─ Invalidate ['claims'] query
            └─ Triggers immediate refetch
```

---

*This visual diagram provides a complete overview of the user journey through the claimtech application.*

