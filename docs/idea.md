# Debt Contention — Product & Tech Brief

## 0) Purpose & Success Criteria

**Purpose:**  
- Help clients with unaffordable or disputed consumer debts to qualify, sign, and manage the resolution process.  
- Manage creditor communications to achieve best compliant outcomes (unenforceability, settlement, write-off, or affordable plans).

**Key Success Metrics:**  
- Onboarding conversion (Start → Signed %)
- % of clients with credit report matched to at least one debt
- Split of Direct vs Affordability route
- Median times: start→signed; signed→first creditor action
- Outcome mix: unenforceable/enforceable/written off
- Fee collection: realized vs planned, % delinquency
- Client NPS, complaints rate

**Out of scope:**  
- Providing regulated “debt advice” (beyond SRA scope)
- Guaranteed outcomes or promises

---

## 1) Onboarding

### 1.1 Flow Overview

**1. Qualifying Questions**  
- Gather: total debts, total monthly payments, whether paying now, and any in default.
- Short screen with progressive disclosure.  
- Proceed even with approximate answers.

**2. Identity Basics**  
- Name, address history (last 3–6 years), DOB, email, phone.
- Must meet CRA (Credit Reference Agency) validation for credit check consent.
- GDPR & soft search notices.

**3. Signature**  
- Present: Privacy Notice, Engagement/Scope Summary, Fee Summary (no payment yet), CRA notice, Terms (for data requests/checks).
- Capture e-signature, store consents & audit trail.

**4. Debt Capture (Manual & Automated)**  
- Default: manual add (creditor, ref, balance, status).
- Optionally: CRA soft search (with explicit consent) to pre-populate debts; fallback supported for “thin files”.
- Store audit trail and provenance (manual or CRA).

**5. Display Debts**  
- UI: debt tiles per creditor showing status, balance, and likelihood band (“Low/Med/High” with caveats).
- Let clients add missing debts or details.

**6. Direct Route (Self-Declared Affordability)**  
- Show potential outcomes, fee calculator, social proof.
- Offer standard plan: e.g., £X/month for 12 months; extended up to 60 if needed.
- Option to book a callback.

**7. Affordability Route (Evidence-Based)**  
- Trigger if declared unaffordable, or client opts in.
- Collect income/expenditure via Open Banking or bank statement upload.
- Compute disposable income to derive plan length (12–60mo).
- If not affordable over 60mo, decline as not suitable.

**8. If Agreed:**  
- Final sign and payment setup (mandate or card on file).
- Present cooling-off and complaint info.

**9. Portal Handoff:**  
- On signup: create portal user, surface “Upload ID” as earliest task (for creditor compliance).

### 1.2 Decision Logic (Key Algorithms)

- **Fee model:** `fee = clamp(total_debt * percent, min_fee, max_fee)`
- **Direct Route:** `monthly_12 = ceil(fee / 12)`
- **Affordability Route:**
    1. `MDI = income – essentials`
    2. `aff_cap = floor(MDI * factor)` (e.g. 0.6)
    3. Find smallest n in [12,60] where `n * min(monthly_12, aff_cap) ≥ fee`
    4. If none, mark as unsuitable

- **Outcome Probability (optional):**  
  Heuristic bands with clear disclaimers; rough estimate based on documentation gaps, CCA timings, etc.

### 1.3 Onboarding MVP Criteria

- ≤ 7 screens from start to completion
- CRA returns ≥1 debt for ≥60% of users (fallback for “thin file”)
- E-sign & explicit consents timestamped, with IP
- Payment method registered; plan (12–60mo) generated
- Audit log for all key steps

---

## 2) Client Portal

### 2.1 Core UX

- Home dashboard:  
  - Debt tiles with color/icon status badges  
  - KPIs: total debts, # unenforceable, next creditor deadline, next payment  
  - Activity timeline (filterable)
  - “What’s Next” explainer for each debt
  - Task panel: required uploads, missing debt detail, signatures
- Debt detail view:  
  - Tabs: Overview, Documents, Comms (email/SMS/calls), Timeline, Outcomes, Notes  
  - Controls for info/doc uploads, acknowledgments, notes
- Document center:  
  - Client-accessible archive (sent/received docs, signatures, receipts, tags)
- Chatbot:  
  - Context-aware help, uploads, callback booking, can escalate to human
- Accessibility:  
  - Larger text, slower comms cadence, option to pause updates

### 2.2 Stages (State Machine)

- Awaiting sign-up → signed_at set
- Initial disclosure requested (LOA/CCA/DSAR sent, SLA/due dates, auto chasers)
- Debt temporarily unenforceable (timers, notifications)
- Documents being reviewed
- Debt enforceable (portal shows plan/dispute options)
- Debt permanently unenforceable (close out, record rationale)
- Debt written off (archive, impact info)

- **All transitions are event-driven** and have guard rails for required process steps.

### 2.3 Notifications

- Automated email/SMS/app banners: docs needed, deadlines, outcomes, reminders, missed payments

### 2.4 Portal MVP

- Every debt: current stage, last/next action visible.
- Client: upload ID, edit debts, view sent/received docs.
- Chatbot: answers “What’s happening?” “What’s next?” “What do you need from me?”

---

## 3) CRM

### 3.1 Key Entities

- Clients/Users (profile, KYC, consents/audit)
- Debts (linked to client/creditor, balance, stage, timers)
- Creditors (name, communication channels, SLA rules)
- Comms (direction, channel, content, threading, recordings)
- PaymentPlans (full details: terms, cadence, overrides, status)
- Payments (history, reconciliation refs, refunds, chargebacks)
- Documents (storage/versioning, templates, e-sign, hashes)
- Requests (LOA/CCA/DSAR dates/outcomes)
- Tasks (work items, SLAs, ownership)
- Events/AuditLog (immutable)
- RiskFlags (e.g. vulnerability, complaints)
- Consents (CRA, OB, e-sign hashes)
- OpenBanking (account/transaction snapshot)

### 3.2 Features

- 360° client view (debts, stages, blockers)
- Timers per debt (e.g. CCA “12 days”), queues for actions/chasing
- Queues: new sign-ups, evidence review, overdue, vulnerable, complaints
- Bulk actions (send chasers, letters, move cases, all with audit)
- Click-to-call, record/transcribe, comms templates
- Omnichannel comms (email/SMS/phone) with tracking & opt-in/out
- AI assist: propose/summarize replies, task conversion, intent detection
- Payments: plan setup, arrears handling, export/reconciliation
- Documents: storage, versioning, mail-merge/generation, search/tags
- Creditors: directory, request gen, mapped responses, SLAs/dashboards
- Tasks/workflows: types, ownership, dependencies, auto-close on events
- Auditing: full immutable log, QA sampling, override PINs

### 3.3 CRM MVP

- Agents find clients in ≤2 clicks; contact (call/SMS/email) from record
- Generate/log creditor requests, chasers, deadlines
- Full payment plan & history ledger, reconciliation visible
- Complete, filterable audit log

---

## 4) Data & Integrations

### 4.1 External

- Credit checks: Equifax, soft search, with fair processing notices
- Open Banking (GoCardless), E-Sign (built-in)
- Payments (GoCardless: card/DD, webhooks)
- Telephony/SMS: Twilio (recordings, transcripts)
- Email: Resend/SES; Gmail webhook for inbound

### 4.2 Internal Services

- Debt normalizer: map & dedupe CRA/manual/creditor data
- Decision engine: direct vs affordability routing, plan computation
- Letter service: templates, merge, multi-channel, proofs (PDF+hash)
- Scheduler/jobs: reminders, chasers, payments, timers, idempotent
- Doc parser: ingest, classify, OCR, extract, task push
- Chatbot runtime: secure case retrieval, escalation
- Reconciliation engine: match payouts/webhooks to ledger, queue exceptions
- Reporting ETL: pre-aggregate ops/finance metrics for dashboards

---

## 5) Compliance & Governance

- GDPR: Lawful bases (contract/legitimate interest), clear notices
- DSAR: discovery, export, redaction tools, retention schedules
- SRA: transparent wording, probability bands “indicative” only
- Fees clear/fixed, not success-based; clear scripts before payment
- Vulnerability flags, slow cadence, complaints surfaced
- CCA: store affordability evidence, cooling-off, plain-English terms, audits
- Full audit trail: e-sign, proof of sending/receipt, OCR archived
- Payments: interest-free, min/max caps, fair arrears handling

---

## 6) Calculations & Rules (Spec)

- **Client fee:** `fee = clamp(TSD * pct, min_fee, max_fee)`
- **Direct route monthly:** `monthly_12 = ceil(fee / 12)`
- **Affordability route:**  
    1. `MDI = Income - (Fixed + Variable essentials)`
    2. `aff_cap = floor(MDI * factor)` (e.g. 0.6)
    3. Smallest `n ∈ [12,60]` where `n * min(monthly_12, aff_cap) ≥ fee`
    4. If not possible, mark as unsuitable
- **Dunning:** 1, 3, 7 day reminders, auto re-spread plan, pause, manual follow-up

---

## 7) Roles & Permissions

- Client: own portal only
- Agent/Case handler: assigned cases, comms/docs write
- Supervisor: reassign, plan overrides (within limits)
- Compliance: all data read/export, redact, close complaints
- Finance: payment exports, reconciliation, write payments only
- System: integration accounts, least privileged

---

## 8) Security, Privacy, Reliability

- SSO for staff, MFA, RBAC, session/device controls
- PII encryption at rest & transit; field-level encryption for sensitive data
- Full audit logging (who/when/what), tamper-evident hashes
- Health checks, retries, idempotent jobs, third-party circuit breakers
- WAF, rate limiting, bot detection, vulnerability scanning
- Backup/DR: point-in-time, RPO ≤24h, RTO ≤4h
- Data minimization, consent registry

---

## 9) Analytics & Reporting

- Funnels: Start→Signed→First action→Outcome; step drop-offs
- Affordability: MDI spread, route & plan splits, % unsuitable
- Ops: SLA adherence, timers breached, average times/action & queue aging
- Finance: planned vs realized fees, arrears, recovery, chargebacks
- Compliance: complaints/vulnerabilities, QA pass rate, impact of wording variance
- Dashboards: live ops, exec/weekly, outcomes cohorts, creditor league tables

---

## 10) Events & Automations

- Example events: `client.created`, `signature.captured`, `creditcheck.completed`, `debt.stage.changed`, `request.sent`, `document.received.parsed`, `payment.plan.created`, `payment.failed`, `comms.inbound.created`, `task.created`, `task.due`, `complaint.opened`
- Background workers consume events to progress state, schedule reminders, update portal, ping chatbot, notify parties.

---

## 11) Error & Edge Cases

- CRA no-hit/partial: prompt manual add, “low confidence” flag
- Name/address mismatch: ask for more evidence
- OB fails: support file upload fallback
- Creditors refuse email: switch to post/track delivery channel
- Client affordability failure (>60mo): mark as unsuitable, signpost alternatives
- Missed payments: dunning, auto-adjust plan within policy, pause, then manual
- Vulnerable flags: escalate, adjust comms

---

## 12) MVP vs Phase 2

**MVP (first 6–8 weeks aim):**
- Direct route (manual affordability fallback)
- CRA integration & debt normalization
- E-sign, core consents, payment setup (card/DD)
- Portal: debt tiles, stages, key tasks (ID/upload), activity feed
- CRM: 360 view, comms (email/SMS), basic letter generation

---

