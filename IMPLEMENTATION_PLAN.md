# Debtfly Full Restructure - Implementation Plan

## Timeline: 2-3 Weeks

---

## Week 1: Public Flow (Pages 1-8)

### Days 1-2: Setup & Page 1-2
- ✅ Create new folder structure
- ✅ Set up types and storage layer
- ✅ Page 1: Creditor Selection
- ✅ Page 2: Information/Success Page

### Days 3-4: Pages 3-5
- ⏳ Page 3: Name & Contact Info
- ⏳ Page 4: Date of Birth
- ⏳ Page 5: Address (reuse AddressSearch)

### Day 5: Pages 6-7
- ⏳ Page 6: Debt Details Loop
- ⏳ Page 7: Review + Document Acknowledgements

### Weekend: Page 8 & Testing
- ⏳ Page 8: Account Creation Confirmation
- ⏳ Test complete public flow
- ⏳ Magic link integration

---

## Week 2: Portal Dashboard & Plan Flow (Steps 1-3)

### Days 1-2: Portal Dashboard
- ⏳ Update dashboard to show data from Pages 1-8
- ⏳ Edit/Delete debts functionality
- ⏳ "Select Your Plan" CTA button
- ⏳ Re-enable AuthGuard

### Days 3-4: Plan Flow Steps 1-2
- ⏳ Step 1: Fee Presentation (FEE-SUM-001)
- ⏳ Step 2: Affordability Assessment (basic I&E)
- ⏳ Pathway logic (12-in-12 vs Regulated Credit)

### Day 5: Step 2A & Step 3
- ⏳ Step 2A: Detailed I&E (conditional - regulated credit only)
- ⏳ Step 3A: Client Care Letter + Signature (text input styled)

### Weekend: Agreements
- ⏳ Step 3B: Credit agreements (12-in-12 vs Regulated)
- ⏳ Signature audit trail
- ⏳ Document templates

---

## Week 3: Plan Flow (Steps 4-6) & Polish

### Days 1-2: Payment & ID Verification
- ⏳ Step 4: Payment Method Setup
- ⏳ Step 5: ID Verification Upload
- ⏳ AML record creation

### Days 3-4: Complete & Testing
- ⏳ Step 6: Onboarding Complete
- ⏳ Case activation workflow
- ⏳ Email notifications
- ⏳ End-to-end testing

### Day 5: Polish & Documentation
- ⏳ Error handling
- ⏳ Loading states
- ⏳ Accessibility review
- ⏳ Documentation
- ⏳ Code cleanup

---

## Key Changes

### Signature Approach
- ❌ Remove complex SignatureCanvas component
- ✅ Use styled text input with handwriting font
- ✅ Store as text + metadata (timestamp, IP)
- ✅ Simpler and legally sufficient

### Document Management
- Create document template system
- Track all acknowledgements
- Signature audit trail
- Compliance logging

### Database Preparation
- Design schema for future migration
- Keep localStorage for now
- Easy migration path to API

---

## Starting Now...

