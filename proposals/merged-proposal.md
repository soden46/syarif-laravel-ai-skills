# Merged Laravel Standards Proposal

Audit date: 2026-07-17

Status: approved for implementation by user request in Stage 6. This file remains the audit trail for the merge decision and does not copy upstream Superpowers Laravel content.

## Scope

- Audited every Markdown file currently in `proposals/pending`.
- Compared each pending rule against the existing accepted standards baseline in this repository.
- Grouped each rule as `NEW`, `UPDATE`, `DUPLICATE`, `CONFLICT`, `PROJECT_ONLY`, or `REJECT`.
- Removed project names, company names, client names, URLs, credentials, provider payload details, business-specific copy, concrete role names, permission strings, local setup details, and domain-specific model/table names from global rules.
- Did not edit, copy, or import upstream `superpowers-laravel` skills.

## Source Map

| Source | Description |
| --- | --- |
| P1 | Integration-heavy Laravel ecommerce/admin proposal with companion service, webhook, logging, seeding, and scheduling notes. |
| P2 | Scoped admin/rebuild Laravel proposal with route permission maps, scoped validation, numeric normalization, parity tests, transactions, and Eloquent conventions. |
| P3 | Digital product order/invoice Laravel proposal with fullstack parity, scoped foreign IDs, historical snapshots, provider tests, and sync-vs-queue side effect notes. |
| Baseline | Previously accepted repository standards and merged proposal used only to detect duplicates and repeated evidence. |

## Classification Summary

| Rule group | Sources | Classification | Recommendation |
| --- | --- | --- | --- |
| Evidence-first extraction checklist | P1, P2, Baseline | UPDATE | Add to extraction workflow and changelog as accepted format. |
| Integration services own provider mapping, auth, retries, parsing, errors, logs, and fakes | P1, Baseline | UPDATE | Accept in actions/services and security references. |
| Companion service behind Laravel proxy | P1 | NEW | Accept as conditional security/architecture guidance, not a dedicated skill yet. |
| Public webhook authentication and idempotency | P1, Baseline | UPDATE | Accept in security and actions/services references. |
| Generated dependency/runtime state hygiene | P1 | NEW | Accept as security/documentation hygiene guardrail. |
| Structured logs for provider-driven workflows | P1, Baseline | UPDATE | Accept in security/actions guidance. |
| Integration runbook template | P1, Baseline | UPDATE | Accept in architecture/documentation guidance. |
| Idempotent environment-gated seeders | P1, Baseline | UPDATE | Accept as data/reference setup rule. |
| Admin query shape and relation columns | P1, Baseline | UPDATE | Accept in Eloquent guidance. |
| Scheduled command dry-run/environment/overlap safety | P1, Baseline | UPDATE | Accept in queues/scheduling guidance. |
| Route-level permission map per resource action | P2, Baseline | UPDATE | Accept in controllers/security guidance. |
| Scoped access reused by query, validation, authorization, and transaction rechecks | P2, P3, Baseline | UPDATE | Accept as a cross-boundary invariant. |
| Human-formatted numeric input normalization | P2, Baseline | UPDATE | Accept via Form Request `prepareForValidation()` preference. |
| Transactional reverse/apply helpers for counters/balances | P2, Baseline | UPDATE | Accept with service/action and lock caveats. |
| Feature parity tests for converted/rebuilt apps | P2, P3, Baseline | UPDATE | Accept as a cross-layer conversion contract. |
| Positive and negative authorization invariant tests | P2, P3, Baseline | UPDATE | Accept in security/testing guidance. |
| Focused integration service with escalation criteria | P1, P3, Baseline | UPDATE | Accept provider-service example and interface caveats. |
| Historical snapshots with privacy restraint | P3, Baseline | DUPLICATE | Keep in Eloquent reference; no standalone new rule. |
| Explicit Eloquent fillable/casts/typed relations/eager loading | P2, Baseline | DUPLICATE | Keep in Eloquent reference; no standalone new rule. |
| HTTP/storage/mail fakes, transactions, locks, upload fakes | P1, P3, Baseline | DUPLICATE | Already covered; reinforce fake-vs-real-connectivity caveat. |
| Sync versus queued provider side effects | P3, Baseline | CONFLICT | Decide by response semantics, latency, retry safety, and operations. |
| Complex inline controller validation | P1, P2, P3, Baseline | CONFLICT | Reject as global default; allow only tiny/prototype/legacy cases. |
| Controller-held transaction workflows | P2, Baseline | CONFLICT | Prefer Action/Service for non-trivial workflows; tolerate small existing controllers. |
| Companion-service implementation details | P1 | PROJECT_ONLY | Do not standardize exact library, port, QR/connect flow, service folders, or local commands. |
| Provider payload/status/header names and customer copy | P1 | PROJECT_ONLY | Keep out of global standards. |
| Role slugs, permission strings, localized route names, labels, display ordering | P2 | PROJECT_ONLY | Keep in project docs or `AGENTS.md`. |
| Generated dependency folders and runtime auth/session files | P1 | REJECT | Never use as skill evidence or reusable examples. |
| Whole-repo formatting exceptions from dirty baselines | P2 | REJECT | Keep global quality-gate expectation; document local failures only. |

## Merged Standards To Implement

### 1. Evidence-First Standards Extraction

Classification: `UPDATE`

Every proposed standard must include rule name, category, evidence from the source project, tests or quality checks, a sanitized generic example, conflict notes, project-only exclusions, classification, and recommendation.

Do not promote one-off rules merely because one project used them. Promote only when they are repeated, align with Laravel best practices, or fill a clear gap without importing business logic.

### 2. Controller, Request, And Service Boundaries

Classification: `UPDATE`

Controllers should stay thin: receive route-bound models or requests, rely on middleware/policies/Form Requests for authorization and validation, call Actions or Services for non-trivial workflows, and return responses.

Use Form Requests for complex, reusable, sensitive, nested, or request-authorized validation. Inline controller validation remains acceptable only for tiny prototypes or legacy maintenance.

Use Actions or Services when the workflow coordinates multiple models, writes several records, calls providers, parses files, dispatches jobs/events, updates counters/balances, or would otherwise make a controller branch-heavy.

Do not require Repository Pattern or interfaces globally. Add them only for multiple implementations, provider swapping, stable domain ports, or real data-access complexity.

### 3. Route And Authorization Boundaries

Classification: `UPDATE`

Keep coarse access requirements visible on route groups, routes, or resource actions. Use route middleware or `can:*` for auditable route-level requirements, Policies for model-state rules, Gates for cross-cutting checks, and Form Request `authorize()` for request-input-dependent checks.

Test both allowed and denied paths, including read-only users, delegated permissions, privileged roles, and attempts to modify protected roles or records.

### 4. Scoped Access Reuse

Classification: `NEW`

In multi-tenant or scoped-access apps, centralize accessible IDs or constraints and reuse them for list queries, form option queries, validation rules, and explicit authorization checks. Re-check cross-field ownership when submitted IDs must belong to the same scoped parent. Recheck race-sensitive ownership, active-state, or availability invariants inside the transaction.

Keep the scope helper thin. Move complex ownership, state, or domain rules into Policies, Actions, or Services.

### 5. Request-Boundary Input Normalization

Classification: `UPDATE`

Normalize human-formatted numeric/date-like inputs before Laravel validation. Prefer `FormRequest::prepareForValidation()` for new or heavily edited endpoints. Keep locale assumptions explicit and put reusable parsing in small helpers or value objects with tests.

### 6. Integration And Companion Service Boundaries

Classification: `UPDATE`

Keep provider and companion-service calls behind Laravel-owned services, adapters, jobs, or proxies. The boundary should own request mapping, authentication/signing, timeouts, retries, response parsing, error translation, sanitized structured logs, and fake-driven tests.

Companion services should not be exposed directly to browsers or the public internet by default. Browser/admin access should go through Laravel auth/authorization; server-to-server calls should use internal tokens or private binding where appropriate.

Do not promote exact provider payloads, status maps, libraries, local ports, runtime auth folders, or customer-facing copy.

### 7. Webhooks And Provider-Driven Workflows

Classification: `UPDATE`

Public webhooks must be authenticated through provider signatures, shared secrets, IP rules, or equivalent verification. Handlers should be idempotent: repeated notifications must acknowledge success without duplicating writes, histories, notifications, or other side effects.

Use structured logs with safe correlation identifiers. Omit tokens, signatures, passwords, full provider payloads, card data, and unnecessary PII.

### 8. Database Transactions, Counters, And Side Effects

Classification: `UPDATE`

Use `DB::transaction()` for writes that must be atomic, including multi-record writes, derived counters/balances, audit/history records, and related child rows.

For update/delete workflows that affect counters or balances, use deterministic reverse/apply operations in a Service or Action when the workflow is non-trivial. Consider row locks for shared counters/balances in concurrent production paths.

Database rollbacks do not roll back files or external side effects. Track stored paths and clean them up when database writes fail; dispatch jobs/events after commit when they depend on committed state.

### 9. Eloquent And Data Shape

Classification: `UPDATE`

Models should declare mass-assignment boundaries, casts, and typed relationships. Query surfaces should eager load the relation graph they render or export, avoid unbounded production datasets, and select only needed columns for high-volume admin lists.

Use idempotent seeders for repeatable reference/dev data. Gate demo data to local/development environments and avoid overwriting edited admin/user data.

Use soft deletes and snapshots only when historical readability outweighs privacy or hard-delete requirements.

### 10. Testing And Verification

Classification: `UPDATE`

Use feature tests for routes, middleware, authorization, validation, redirects, sessions, database writes, and user-facing workflows. Use unit tests for pure helpers and complex services. Use Laravel fakes for HTTP, Storage, Mail, Notifications, Queue/Bus, and Events.

When porting or rebuilding an app, add a parity contract before coding: inventory routes, roles, states, writes, side effects, expected browser states, and deliberate deviations. Verify critical vertical slices with feature tests first and browser tests only where browser behavior matters.

Parity tests are a regression net. They do not replace focused validation, authorization, service, and failure-path tests.

Use browser E2E tests for JavaScript-dependent flows, uploads/previews, modals, drag/drop, SPA navigation, and critical browser state.

Before handoff, run the smallest meaningful verification set the project supports and report any failing legacy baseline.

### 11. Livewire, Queues, And Scheduling

Classification: `UPDATE`

For Livewire, keep components focused on UI state and delegate reusable workflows to Actions or Services. Validate and authorize Livewire actions, protect file uploads, and test important component behavior.

Queued jobs should be retry-safe, pass IDs or small scalar payloads when practical, reload models in `handle()`, define timeout/retry/backoff intentionally, and dispatch after commit when needed.

Keep an external side effect synchronous only when the current response genuinely requires a bounded provider result. Otherwise dispatch retry-safe work after commit.

Scheduled commands that mutate data or send external side effects should use overlap protection and include dry-run/environment guards when practical.

### 12. Security And Runtime Hygiene

Classification: `UPDATE`

Run a focused security pass when touching auth, authorization, uploads, webhooks, integrations, public APIs, payment-like flows, or sensitive data.

Validate all request input, escape output, avoid interpolated raw SQL, keep secrets out of source/logs/database-backed settings/frontend env, and ignore generated dependency folders, local service state, runtime auth sessions, and service `.env` files.

### 13. Documentation And Runbooks

Classification: `UPDATE`

Durable documentation should cover setup, operations, architecture decisions, reusable conventions, integration runbooks, verification, and troubleshooting. Temporary plans, stale generated notes, and business-specific copies should stay out of global standards.

Generic integration runbook structure:

```markdown
# Setup <Integration>

## Architecture
## Required Environment
## Local Verification
## Production Verification
## Security Notes
## Troubleshooting
## Relevant Files
```

## Conflicts And Resolutions

### Inline Controller Validation vs Form Requests

Resolution: Prefer Form Requests globally for complex, reusable, sensitive, nested, or request-authorized validation. Inline validation is tolerated only for tiny prototypes or legacy maintenance.

### Controller-Held Transactions vs Service/Action Boundaries

Resolution: Keep small existing controller transactions acceptable, but place non-trivial atomic workflows in Actions or Services.

### Synchronous vs Queued Side Effects

Resolution: Do not make either sync or queue universal. Decide from response semantics, latency, retry safety, idempotency, and operational requirements.

### Companion Service Generalization

Resolution: Accept the architecture/security principle, but do not create a dedicated companion-service skill until another unrelated project confirms the pattern.

### Soft Deletes vs Privacy/Hard Delete

Resolution: Decide per model. Use soft deletes and snapshots for historical correctness only when retention needs outweigh privacy or compliance constraints.

### Quality Gates vs Existing Failing Baselines

Resolution: Do not normalize failing Pint/build/test baselines as global standards. Report the failure and reason; keep the target standard clean.

## Project-Only Or Rejected Material

Keep out of global skills:

- project names, company names, client names, URLs, credentials, and exact local paths;
- concrete provider payloads, status names, endpoint paths, signature header names, process managers, local ports, and QR/connect flows;
- customer/admin message copy and product/business claims;
- concrete role names, role slugs, permission strings, seeded demo users, route names, and UI labels;
- account/category/display ordering and localized copy from one app;
- generated dependency folders, runtime auth/session files, nested `node_modules`, local service state, and service `.env` files;
- project-specific XAMPP/domain docs and local setup checklists;
- Repository Pattern or interface-per-service as universal defaults;
- upstream Superpowers Laravel text or installer metadata.

## Implementation Plan

Fold reusable rules into the existing canonical Laravel skills and keep `skills/using-laravel-standards` as the single catalog entrypoint:

- concise entrypoint updates only where they improve skill selection;
- focused topic updates in the relevant existing skills;
- root `CHANGELOG.md` entry with anonymous source notes;
- move processed pending proposals to `proposals/accepted`;
- do not modify upstream or third-party skills.
