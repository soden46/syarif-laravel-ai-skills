# Digital Product Order And Invoice Laravel Standards Final Proposal

## Consolidation Metadata

- Source proposals: `docs/standards-proposal.md` at source revision `c0f2240`
- Standards baseline: `syarif-laravel-standards` at revision `26b794d`, including accepted proposals and current canonical skills
- Verification reviewed: 30 PHPUnit tests with 102 assertions passed; Vite production build passed; Pint reported 7 existing failures and was not counted as positive evidence
- Consolidation date: 2026-07-17

## Findings

### STD-001 — Add an executable parity contract to fullstack orchestration

- Classification: UPDATE
- Target skill: laravel-specialist and testing
- Proposed rule: For application conversion work, inventory routes, roles, states, writes, side effects, and deliberate deviations, then verify critical vertical slices with feature and browser tests.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-001
- Verification: PHPUnit parity workflows and Vite build passed; browser scripts contain web-first assertions for the critical user flow.
- Existing coverage: The testing skill recommends parity tests, but the fullstack orchestrator does not define the cross-layer contract or deliberate-deviation record.
- Conflict resolution: Keep feature tests primary for server behavior and use browser tests only for browser-dependent states.
- Project-only remainder: Reference application identity, exact screens, labels, routes, data, and omitted fields.
- Recommendation: ACCEPT
- Proposed diff: Add a conversion/parity workflow to the fullstack orchestration testing reference.

### STD-002 — Validate submitted foreign IDs against authorized scope

- Classification: UPDATE
- Target skill: security, form-requests, eloquent, and database-transactions
- Proposed rule: Constrain submitted foreign IDs to the actor's authorized scope and recheck race-sensitive ownership or availability invariants inside the transaction.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-002
- Verification: Feature tests passed active-state, assigned-resource, multi-item, and unauthorized-owner scenarios.
- Existing coverage: Security requires authorization and Form Requests support scoped rules, while transactions cover locks; the cross-boundary rule is not stated as one fullstack invariant.
- Conflict resolution: Do not require row locks for ordinary CRUD; use them only for concurrency-sensitive state.
- Project-only remainder: Eligibility, status, assignment, amount, and resource rules.
- Recommendation: ACCEPT
- Proposed diff: Add the scoped-ID and in-transaction recheck rule to security and transaction coordination references.

### STD-003 — Keep named use-case boundaries conditional

- Classification: DUPLICATE
- Target skill: actions-and-services
- Proposed rule: Use a named Action or Service for a non-trivial reusable or multi-record workflow, not for every controller method.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-003
- Verification: The same action is exercised through user and administrator feature paths.
- Existing coverage: The canonical actions-and-services and architecture skills already state this rule directly.
- Conflict resolution: Preserve direct Eloquent/controller orchestration for small CRUD and avoid mandatory layering.
- Project-only remainder: Use-case name, history messages, notification copy, and statuses.
- Recommendation: ACCEPT
- Proposed diff: No new canonical rule; reference the existing rule from the fullstack skill.

### STD-004 — Preserve historical truth with minimal snapshots

- Classification: DUPLICATE
- Target skill: eloquent-patterns
- Proposed rule: Snapshot only mutable reference attributes required for historical correctness.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-004
- Verification: Invoice workflow tests render persisted line snapshots.
- Existing coverage: The canonical Eloquent skill already covers historical snapshots and sensitive-data restraint.
- Conflict resolution: Balance historical readability with privacy, retention, and deletion requirements per model.
- Project-only remainder: Invoice format, pricing, totals, and displayed snapshot fields.
- Recommendation: ACCEPT
- Proposed diff: No new canonical rule; include a concise cross-reference in the fullstack Eloquent reference.

### STD-005 — Refine the small-service integration boundary

- Classification: UPDATE
- Target skill: actions-and-services and security
- Proposed rule: Start a provider integration with a focused service that owns configuration, authentication, mapping, timeout/retry, and error translation; add a port/interface only for real provider substitution or domain isolation.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-005 and an accepted anonymized ecommerce integration proposal
- Verification: HTTP-faked tests assert authentication, payload shape, success, and authorization denial.
- Existing coverage: Actions-and-services covers integration services; this source supplies independent confirmation and a complete configuration-to-test example.
- Conflict resolution: Do not require one interface per integration and do not copy provider protocol into the core skill.
- Project-only remainder: Provider library, endpoint paths, QR protocol, tokens, ports, messages, and process management.
- Recommendation: ACCEPT
- Proposed diff: Add a generic provider-service example and escalation criteria to the fullstack actions-and-services reference.

### STD-006 — Test authorization invariants in both directions

- Classification: UPDATE
- Target skill: security and testing
- Proposed rule: For protected reads and side effects, test an allowed actor and at least one material denied actor or scope.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-006
- Verification: Feature tests prove administrator/customer separation and owner/non-owner behavior before outbound requests.
- Existing coverage: Security already requires allowed and denied paths; the fullstack skill should make the cross-layer verification explicit.
- Conflict resolution: Use Policies when rules grow; route middleware remains suitable for coarse role boundaries.
- Project-only remainder: Role names, permission names, and ownership semantics.
- Recommendation: ACCEPT
- Proposed diff: Add a positive/negative authorization matrix to security and testing references.

### STD-007 — Use fakes without mistaking them for real connectivity

- Classification: DUPLICATE
- Target skill: testing
- Proposed rule: Use Laravel fakes for deterministic side-effect contracts and reserve authorized smoke tests for real connectivity.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-007
- Verification: Mail, storage, and HTTP fake assertions passed.
- Existing coverage: The canonical testing skill already lists framework fakes and handoff smoke checks.
- Conflict resolution: Never claim a provider is operational solely because a fake-based test passed.
- Project-only remainder: Targets, filenames, paths, payload copy, and credentials.
- Recommendation: ACCEPT
- Proposed diff: No standalone rule; repeat the distinction concisely in the fullstack testing reference.

### STD-008 — Reject complex inline validation as a global default

- Classification: CONFLICT
- Target skill: form-requests and controllers
- Proposed rule: Prefer Form Requests for complex, sensitive, reused, or growing HTTP validation while allowing inline validation for genuinely tiny project-local inputs.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-008
- Verification: Current inline behavior passes feature tests, but it has no independent request-bound tests and broadens the controller.
- Existing coverage: Canonical Form Request guidance already prefers extraction for new or heavily edited workflows.
- Conflict resolution: Keep current code as tolerated project debt; do not promote it, and migrate when the endpoint is substantially edited.
- Project-only remainder: Existing controller rules and migration timing.
- Recommendation: REVISE
- Proposed diff: Preserve the canonical conditional Form Request rule and document inline validation as a limited exception.

### STD-009 — Resolve synchronous versus queued side effects by UX and reliability

- Classification: CONFLICT
- Target skill: queues-and-jobs and database-transactions
- Proposed rule: Keep an effect synchronous only when the current response requires a bounded provider result; otherwise dispatch retry-safe work after commit.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-009
- Verification: Fake-based synchronous tests pass; production retry, idempotency, and queue behavior are not proven by the source.
- Existing coverage: Queue and transaction skills prefer after-commit async work that need not block a request.
- Conflict resolution: Do not make either sync or queue universal; decide from response semantics, latency, retry safety, and operational requirements.
- Project-only remainder: Which actions need immediate provider feedback.
- Recommendation: REVISE
- Proposed diff: Add a sync-versus-queue decision table to the fullstack queues reference.

### STD-010 — Exclude provider operations and failing quality baselines

- Classification: PROJECT_ONLY
- Target skill: none
- Proposed rule: Keep concrete sidecar commands, runtime paths, provider details, local warnings, and existing quality failures in project documentation.
- Source evidence: digital-product-order-invoice-laravel@c0f2240:STD-010
- Verification: Tests and build pass, while Pint and the local PHP extension startup remain unresolved.
- Existing coverage: Standards governance and quality guidance already reject source-specific operational details and failing baselines.
- Conflict resolution: Promote only the generic requirement for supervised, observable, least-exposed services and clean supported quality gates.
- Project-only remainder: All service commands, paths, users, ports, runtime warnings, and provider setup.
- Recommendation: REJECT
- Proposed diff: No global skill change.

## Sanitization

- Removed source brand, company, user identity, domain, URLs, credentials, product vocabulary, invoice format, role labels, status values, exact routes, provider protocol, and customer-facing copy.
- Retained only generic Laravel boundaries, evidence categories, verification results, and anonymous provenance.
