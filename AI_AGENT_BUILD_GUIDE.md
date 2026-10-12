# MASTER CONTROL — AI Agent Build Guide

This is the single reference file for the AI coding agent building this system. Follow the phases in order. Do not skip the security tasks embedded inside each phase — they are not a separate cleanup pass at the end, they are part of the definition of "done" for that phase. Do not start a phase until the previous phase's checklist is fully checked off.

**Design doc (product spec, modules, pricing, roadmap):** see the MASTER CONTROL business/product doc produced alongside this file for the *why*. This file is the *how* and *in what order*.

**Ground rules for every phase:**
- Every new feature ships with: input validation, authorization check, audit log entry, and a test. A feature without these four is not complete.
- Secrets (API keys, DB credentials, JWT signing keys) are never hardcoded or committed — always environment variables / a secrets manager, from the very first commit.
- Every table that holds tenant (business) data carries a `business_id` and every query is scoped by it at the ORM/query-builder level, not left to each handler to remember.
- Commit frequently with clear messages. Run the full test suite and the security checklist for the phase before marking it done.

---

## Phase 0 — Foundations & Security Baseline (before any feature code)

Security is cheapest to build in at the start and expensive to retrofit once modules depend on the data model — so this phase exists before Phase 1 on purpose.

1. **Repo & environment setup**
   - Monorepo structure: `/apps/web`, `/apps/mobile`, `/services/<domain>` (one folder per microservice: inventory, crm, hr, accounting, automation, ai-orchestration, gateway), `/packages/shared` (types, validation schemas shared across services).
   - `.env.example` committed; real `.env` files git-ignored. Document every required environment variable.
   - Pre-commit hook: block commits containing likely secrets (API key patterns, private keys) using a secret-scanning tool (e.g. gitleaks).
2. **Identity & auth foundation**
   - Choose the auth approach: short-lived JWT access tokens + rotating refresh tokens, or a managed identity provider (Auth0/Clerk/Firebase Auth/Keycloak) — a managed provider is strongly recommended for a solo/small team, since auth bugs are the single most common catastrophic security failure in new platforms.
   - Password hashing: argon2id (preferred) or bcrypt with a strong work factor — never a custom hash, never plain SHA.
   - Multi-factor authentication (TOTP at minimum) built into the auth flow from day one for the owner/admin role, even if optional for lower roles initially.
   - Account lockout / exponential backoff on repeated failed logins; CAPTCHA or equivalent after N failures.
3. **Multi-tenant data isolation model**
   - Decide and document: schema-per-business (stronger isolation, more operational overhead) vs. shared-schema with `business_id` row-level security (simpler ops, must be airtight in enforcement). Recommendation for MVP: shared-schema + Postgres Row-Level Security (RLS) policies enforced at the database level, not just the application level — this means even a bug in application code cannot leak another tenant's rows.
   - Write the RLS policy for every table as part of its migration, not as a later pass.
4. **API gateway skeleton**
   - Single entry point for all client traffic; terminates TLS, validates the JWT, attaches `business_id` + `user_id` + `role` to every downstream request, applies rate limiting here (see Phase 0 security checklist).
   - Reject any request without a valid, non-expired token except explicitly listed public routes (login, signup, health check).
5. **Logging & audit trail infrastructure**
   - Structured logging (JSON logs) from day one, shipped to a central log store.
   - A dedicated `audit_log` table/service: every write operation (create/update/delete) logs `who, what, when, before-value, after-value, business_id`. This is required infrastructure before Phase 1 features are built on top of it, not something added later — retrofitting audit logging into existing write paths is error-prone.
6. **CI/CD pipeline with security gates**
   - Every PR runs: unit tests, dependency vulnerability scan (e.g. `npm audit`/Snyk/Dependabot), static analysis / linting, and the secret scanner from step 1.
   - No direct pushes to `main`; all changes go through PR review (even solo-agent-authored PRs should go through a review step/checklist).

**Phase 0 security checklist (must pass before Phase 1 starts):**
- [ ] TLS enforced everywhere (no plain HTTP endpoint reachable externally)
- [ ] All secrets in environment variables / secrets manager, none in git history
- [ ] Password hashing uses argon2id or bcrypt with a vetted work factor
- [ ] MFA available for admin/owner role
- [ ] Rate limiting active on the gateway (per-IP and per-account)
- [ ] RLS (or equivalent tenant isolation) enforced at the database layer, tested with a cross-tenant access attempt that must fail
- [ ] Audit log captures create/update/delete on at least one real table end-to-end
- [ ] CI blocks merges on failed dependency scan or detected secret

---

## Phase 1 — MVP: Single-Business Core (Inventory, POS/Sales, Accounting, CRM, Dashboard)

Goal: one real business can run day-to-day operations on this system and nothing else.

1. **Inventory & warehouse service** — item master, stock levels, stock movements, barcode lookup, low-stock threshold, branch/warehouse model.
2. **POS / Sales service** — quotation → invoice flow, POS counter sale, returns tied back to inventory, multi-currency pricing.
3. **Accounting core** — chart of accounts, general ledger, auto-posting from sales/purchases, basic P&L and balance sheet reports.
4. **CRM basics** — customer record (360° profile foundation), lead capture, simple pipeline stages.
5. **Owner dashboard (web first, then mobile shell)** — today's sales, cash position, low-stock alerts, pending approvals list — wired to real data from the services above, no mock data.
6. **Role-based access control (RBAC) v1** — define the core roles (Owner, Branch Manager, Cashier, Accountant) and enforce them on every endpoint added so far; a role matrix is a required artifact of this phase, not optional documentation.
7. **Custom fields framework (minimum viable)** — one generic `custom_fields` JSONB column + a simple admin UI to add a text/number/date field to Product, Customer, and Invoice records. This seeds the Customization & Extensibility module described in the product doc; expand it in a later phase, but the data model decision has to be made now so it isn't a breaking migration later.

**Phase 1 security checklist:**
- [ ] Every new endpoint checked against the RBAC role matrix (no endpoint reachable by a role that shouldn't have it — verify with an automated test per role, not manual spot-checks)
- [ ] Input validation schema (e.g. Zod/Joi) on every request body; reject unknown fields rather than silently ignoring them
- [ ] SQL access goes through parameterized queries / the ORM only — zero string-concatenated SQL anywhere in the codebase (grep for this before closing the phase)
- [ ] File uploads (if any in this phase) validated by content-type + magic-byte check, size-limited, stored outside the web root or in object storage with signed URLs — never served directly from a user-writable path
- [ ] Audit log entries verified for every write path added in this phase
- [ ] Load test the inventory/POS write path for basic race conditions (two simultaneous sales of the last unit of stock must not both succeed)

---

## Phase 2 — AI Layer v1 (Gemini Integration) & Automation Engine

Goal: Gemini becomes a real part of daily workflows, with hard guardrails, not a demo feature.

1. **AI Orchestration Service** — the one service that holds the Gemini API key and brokers every AI call; no other service calls Gemini directly, ever (this is a security boundary, not just clean architecture).
   - Request scoping: build the prompt from only the data the specific use case needs (e.g. a reorder-draft prompt gets stock + sales history for that SKU, not the whole database).
   - Function calling: Gemini can *propose* an action (create PO, send reminder) but the orchestration service executes it only after the same permission check a human action would require, and only after it lands in an approval queue if it touches money, payroll, or stock above a configurable threshold.
   - Per-tenant rate limiting and usage metering on AI calls from day one (this is also the cost-control mechanism described in the product doc's pricing model).
2. **Concrete AI features to ship this phase:** AI-drafted purchase reorders, AI-drafted customer reply suggestions, AI daily briefing on the dashboard.
3. **Automation engine** — trigger/condition/action builder (no-code), wired first to the workflows already in the product doc (low-stock → draft PO, invoice overdue → reminder sequence).
4. **Notification pipeline** — one internal event → push/WhatsApp/SMS/email fan-out, used by both the automation engine and AI-drafted-action approvals.

**Phase 2 security checklist:**
- [ ] Gemini API key accessible only to the AI Orchestration Service's runtime (verify no other service's environment has it)
- [ ] Every AI-proposed action that moves money/stock/payroll is non-executing until explicit human approval, with no code path that bypasses this (write an automated test that tries to bypass it and confirms it's blocked)
- [ ] Prompts are logged (what was sent, what came back) for audit, with PII minimized in the prompt itself where possible
- [ ] Rate limits on AI calls prevent a single compromised account or script from running up unbounded API cost
- [ ] Automation engine actions are also subject to RBAC — an automation rule cannot perform an action its creator's role couldn't perform manually

---

## Phase 3 — HR & Multi-Business / Multi-Tenant Expansion

Goal: payroll/attendance live, and an owner can run more than one business from one account.

1. **HR & Payroll service** — attendance (clock-in/out), leave, shift scheduling, payroll run with statutory deduction rules per country, payslip generation.
2. **Multi-business holding layer** — the owner account can own multiple business workspaces; build the one-tap switch, the consolidated holding dashboard, and scoped role inheritance (a manager scoped to specific branches/businesses).
3. **Expand custom fields → custom forms/modules** (the fuller Customization & Extensibility framework from the product doc) now that the core data model has proven stable across two real tenant types.

**Phase 3 security checklist:**
- [ ] Payroll/salary data fields are field-level encrypted at rest (bank account numbers, national ID numbers, salary figures) — verify by inspecting raw DB storage, not just the application layer
- [ ] Cross-business access tested explicitly: a user scoped to Business A must get a 403, not a 404-that-leaks-existence, when probing Business B's resources
- [ ] Payroll run is a privileged, MFA-gated action for whichever role triggers it
- [ ] Re-run the Phase 0 cross-tenant isolation test against every new table added in this phase

---

## Phase 4 — Integrations, Mobile Polish, External Attack Surface Hardening

Goal: the system now talks to banks, WhatsApp, tax authorities, and the open internet in earnest — this is where external attack surface grows the most, so harden before and during, not after.

1. **WhatsApp Business API, bank-feed reconciliation, tax e-filing (market-dependent), e-commerce connectors.**
2. **Offline-tolerant branch app** — local queue + sync; make sure sync conflict resolution cannot be used to replay or forge transactions (sign queued transactions client-side where feasible, validate server-side on sync).
3. **Public-facing attack surface review** — anything now reachable without a login (webhooks, e-commerce storefront, password reset, public API docs) gets its own threat model.
4. **Web Application Firewall (WAF) + DDoS protection** in front of the gateway (e.g. Cloudflare, AWS WAF/Shield, or the cloud provider's equivalent) — this is the point at which "going viral" becomes a real traffic/attack risk, so it should be in place before, not reactively after, a traffic spike.
5. **Webhook security** — every inbound webhook (bank, WhatsApp, payment gateway) verifies a signature from the sender; never trust payload content without verifying it came from the claimed source.

**Phase 4 security checklist:**
- [ ] WAF + DDoS protection active in front of all public endpoints
- [ ] Every inbound webhook signature-verified; a forged webhook payload is rejected and logged
- [ ] Full OWASP Top 10 pass specifically on anything newly public-facing (injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfig, XSS, insecure deserialization, vulnerable components, insufficient logging)
- [ ] Automated dependency + container image vulnerability scanning running on a schedule, not just at PR time
- [ ] Incident response runbook written: who gets paged, how to rotate a leaked key, how to roll back a bad deploy, how to notify affected businesses if a breach occurs

---

## Phase 5 — Enterprise, Scale & Independent Security Validation

Goal: the platform can carry real financial/operational trust at scale, and that trust is externally verified, not just self-declared.

1. **Production/manufacturing module, advanced forecasting, private-cloud/on-premise deployment option** (product features — see product doc for scope).
2. **Independent third-party penetration test** before any large public launch or marketing push — this is non-negotiable for a system whose premise is "run your whole business from here." Fix all critical/high findings before launch; track medium/low findings with owners and dates.
3. **Formal security review against a recognized framework** (OWASP ASVS as a practical baseline; SOC 2 Type II if pursuing larger enterprise customers) — start the evidence-collection habits (access reviews, change logs, backup test records) early even if certification itself comes later.
4. **Bug bounty or responsible-disclosure program** once the pen test findings are resolved — gives security researchers a legitimate channel instead of first finding out about a flaw from an exploit.
5. **Chaos/scale testing** — simulate a traffic spike (the "going viral" scenario) against a staging environment sized like production, confirm autoscaling, rate limiting, and the WAF hold under load without falling back to an insecure degraded mode.
6. **Backup & disaster recovery drill** — actually restore from backup in a drill, don't just assume the backup job succeeding means recovery works.

**Phase 5 security checklist:**
- [ ] Penetration test completed, all critical/high findings remediated and re-verified
- [ ] OWASP ASVS (or chosen framework) checklist completed and gaps tracked to closure
- [ ] Disaster recovery drill performed with a documented recovery time
- [ ] Responsible-disclosure/bug-bounty channel published
- [ ] Load/chaos test confirms the system degrades safely (rate-limits, queues, or gracefully errors) rather than failing open or leaking data under extreme load

---

## Standing Security Practices (apply continuously, every phase, forever)

These are not a phase — they run in parallel with every phase above, starting in Phase 0 and never stopping:

- **Principle of least privilege everywhere** — a service account, an API key, a role: each gets the minimum access it needs, never broad/admin access "to be safe for later."
- **Dependency hygiene** — keep dependencies current; treat a high/critical CVE in a dependency as a same-week fix, not a backlog item.
- **No secrets in logs** — scrub tokens, passwords, and PII from log output; a logging bug that writes a password to a log file is itself a breach.
- **Encrypt in transit and at rest** — TLS everywhere, disk/volume encryption on all databases and object storage, field-level encryption for the most sensitive fields (payroll, national ID, bank details) as called out per-phase above.
- **Immutable audit trail** — the audit log itself should not be editable or deletable by the same roles whose actions it records; consider write-once storage or a separate, more restricted datastore for it.
- **Review every AI-touched write path for prompt-injection risk** — if a customer message, a scanned document, or any external/untrusted text reaches a Gemini prompt that can trigger an action, that path must be reviewed for an attacker trying to manipulate the model into proposing a malicious action (e.g. a crafted customer message trying to get the AI to draft a refund or price change). Treat all external text reaching the AI layer as untrusted input, the same as a SQL query parameter.
- **Revisit the role matrix every time a new module ships** — a new module with no explicit role matrix entry is a bug, not a detail to fill in later.
