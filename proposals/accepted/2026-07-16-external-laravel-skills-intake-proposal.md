# External Laravel Skills Intake Proposal

Audit date: 2026-07-16

Status: proposal only. Do not install, copy, or modify external/global skills.

External sources:
- `AsyrafHussin/agent-skills`
- `jpcaparas/superpowers-laravel`

Purpose:
- Extract reusable Laravel skill rules from external skill repositories.
- Merge the useful parts into the custom Laravel standards proposal.
- Avoid copying upstream skill files or long upstream text.
- Keep this as proposal material under `proposals/pending`.

## Intake Rules

Promote only generic, reusable rules that improve Laravel implementation, review, testing, security, performance, operations, or maintainability.

Do not promote:
- upstream skill files verbatim;
- installer instructions;
- external repository layout;
- agent-specific command wrappers;
- generic Git workflow not specific to Laravel;
- product/business-specific examples;
- rules already covered well enough by the merged proposal unless they sharpen scope.

## Source Skill Inventory

### AsyrafHussin/agent-skills

Relevant skill families reviewed:
- `laravel-best-practices`
- `laravel-testing`
- `laravel-database-optimization`
- `laravel-owasp-security`
- `laravel-inertia-react`
- `laravel-queues`
- `api-design-patterns`
- `php-best-practices`
- `clean-code-principles`
- `testing-best-practices`
- `technical-debt`
- `code-slop`
- `project-docs`
- `web-design-guidelines`
- `tailwind-best-practices`
- `seo-best-practices`
- `react-vite-best-practices`
- `e2e-playwright-testing`

Less central or specialized:
- `laravel-ai-sdk`
- `laravel-mcp`
- `state-management`
- `typescript-react-patterns`
- `prd-writing`
- `git-workflow`

### jpcaparas/superpowers-laravel

Relevant skill families reviewed:
- `using-laravel-superpowers`
- `runner-selection`
- `bootstrap-check`
- `quality-checks`
- `controller-cleanup`
- `form-requests-and-validation`
- `policies-and-authorization`
- `routes-best-practices`
- `api-resources-and-pagination`
- `api-surface-evolution`
- `blade-components-and-layouts`
- `eloquent-relationships-and-loading`
- `migrations-and-factories`
- `performance-caching`
- `performance-eager-loading`
- `performance-select-columns`
- `data-chunking-large-datasets`
- `transactions-and-consistency`
- `queues-and-horizon`
- `task-scheduling`
- `rate-limiting-and-throttle`
- `request-forgery-protection`
- `http-client-resilience`
- `exception-handling-and-logging`
- `filesystem-uploads-and-urls`
- `config-env-storage`
- `constants-and-configuration`
- `complexity-guardrails`
- `interfaces-and-di`
- `ports-and-adapters`
- `strategy-pattern`
- `template-method-and-plugins`
- `custom-helpers`
- `tdd-with-pest`
- `controller-tests`
- `e2e-playwright`
- `documentation-best-practices`
- `dependencies-trim-packages`
- `internationalization-and-translation`

Specialized optional skill families:
- `ai-sdk-essentials`
- `vector-semantic-search`
- `horizon-metrics-and-dashboards`
- `nova-resource-patterns`
- `upgrade-to-laravel-13`
- `php-attributes`

## Classification Matrix

| Skill/rule group | Sources | Classification | Recommendation |
| --- | --- | --- | --- |
| Controller, Form Request, service/action architecture | Both | DUPLICATE | Already merged; keep as core architecture. |
| Avoid premature interfaces/repositories and wrappers | Both | UPDATE | Strengthen anti-overengineering guardrails. |
| API resources, pagination, stable response shape | Both | NEW | Add an API standards section. |
| API surface evolution, versioning, deprecations, compatibility tests | Both | NEW | Add as API lifecycle guidance. |
| Consistent API errors with no stack traces | Agent skills | NEW | Add to API/security guidance. |
| Rate limiting and throttle headers | Both | NEW | Add as security/API boundary guidance. |
| CSRF/request forgery protection and webhook exclusions | Superpowers | NEW | Add as web security guidance. |
| OWASP-style security audit checklist | Agent skills | NEW | Add as security review mode. |
| Secrets, sensitive data, and frontend exposure checks | Both | UPDATE | Add to security and integration logging guidance. |
| File upload validation and storage safety | Both | UPDATE | Merge with filesystem/uploads and security guidance. |
| Query optimization: N+1, select columns, counts, indexes | Both | DUPLICATE | Already covered; keep as performance baseline. |
| Large dataset processing with chunk/lazy/cursor | Both | UPDATE | Add explicit data-volume rule. |
| Cursor pagination for large datasets | Both | UPDATE | Add to API/listing performance guidance. |
| Cache TTL, tags, key scoping, explicit invalidation | Both | DUPLICATE | Already merged in settings/performance; keep as baseline. |
| Safe migrations and zero-downtime awareness | Agent skills | NEW | Add migration safety guidance. |
| Queue job design: idempotency, pass IDs, retries, backoff, failures | Both | NEW | Add async operations section. |
| Queue/Horizon operations and worker lifecycle | Both | UPDATE | Add operational checks without forcing Horizon. |
| Task scheduling safety with overlap locks and environment visibility | Superpowers | NEW | Add operations section. |
| Blade components and pure templates | Superpowers | UPDATE | Add to UI/template quality guidance. |
| Inertia/React page props, forms, shared data, validation errors | Agent skills | NEW | Add optional stack-specific frontend reference. |
| Tailwind responsive/dark/component conventions | Agent skills | NEW | Add optional UI quality reference. |
| Accessibility and form UX | Agent skills | NEW | Promote as frontend quality standard. |
| SEO and Core Web Vitals | Agent skills | NEW | Add as optional public-site quality reference. |
| React/Vite assets, env, code splitting, bundle checks | Agent skills | UPDATE | Add only when the stack uses Vite/React. |
| Playwright E2E: role locators, web-first assertions, storage state | Both | UPDATE | Add browser-test guidance for critical flows. |
| PHP 8 type safety, strict types, modern features by version | Agent skills | UPDATE | Add version-aware PHP quality guidance. |
| Specific exception handling and no error suppression | Agent skills | UPDATE | Add to exception/logging guidance. |
| Clean code: DRY, KISS, SRP, fail fast, composition | Agent skills | DUPLICATE | Already present indirectly; keep as review rubric. |
| Technical debt ledger with priority and category | Agent skills | NEW | Add audit output mode. |
| Code-slop detection for AI-generated patterns | Agent skills | NEW | Add review quality mode. |
| Documentation lifecycle and cleanup of stale/AI-junk docs | Both | NEW | Add docs hygiene mode. |
| Runner detection: Sail vs host commands | Superpowers | UPDATE | Add to implementation workflow. |
| Quality checks: tests, Pint, static analysis, frontend build | Superpowers | DUPLICATE | Already present; keep as handoff baseline. |
| Dependency trimming and security surface reduction | Superpowers | NEW | Add maintenance guidance. |
| Internationalization from the start | Superpowers | NEW | Add optional user-facing product guidance. |
| AI SDK, vector search, MCP, Nova, Laravel upgrade | Both | PROJECT_ONLY | Keep as specialized references, not core global standard. |
| External install commands and repository-specific scaffolding | Both | REJECT | Do not include in custom Laravel skill. |
| Upstream wording or whole rule files | Both | REJECT | Extract ideas only. |

## Proposed Additions To Merged Proposal

### 1. API Contracts And Evolution

Classification: NEW

Add a global API rule covering:
- API Resources for stable response shapes;
- pagination metadata and links;
- conditional fields for expensive or permission-sensitive data;
- consistent error envelopes;
- validation error details;
- no stack traces in API responses;
- versioning or compatibility policy for public APIs;
- deprecation notes and compatibility tests when response shapes evolve.

Recommended wording:

```md
For JSON APIs, keep response shapes stable through API Resources or dedicated transformers. Include pagination metadata consistently. Use conditional fields for expensive, optional, or permission-sensitive data.

When evolving public or consumed APIs, preserve backward compatibility where practical. Add compatibility tests for response shape, status codes, validation errors, and deprecation behavior.
```

### 2. Laravel Security Review Baseline

Classification: NEW

Add a security review mode covering:
- broken access control;
- authentication and rate limiting;
- CSRF/request forgery;
- injection prevention;
- output escaping;
- file upload validation;
- secrets and credentials;
- sensitive data exposure in frontend props or API responses;
- security headers and misconfiguration;
- dependency advisories.

Recommended wording:

```md
For security-sensitive Laravel work, run a focused security pass before handoff. Check authorization on every route/action, request forgery protection for browser forms, explicit webhook exclusions, rate limits on abuse-prone routes, validated uploads, escaped output, redacted logs, and absence of secrets in code or frontend payloads.
```

### 3. Large Data And Query Volume Rules

Classification: UPDATE

Add explicit guidance for large datasets:
- use pagination for user-facing lists;
- use cursor pagination for large append-only lists;
- use `chunkById()`, `lazyById()`, `cursor()`, or raw bulk updates for background processing;
- select only needed columns;
- ensure relevant indexes;
- avoid unbounded `all()` or `get()` in large-data paths.

Recommended wording:

```md
Do not process unbounded production datasets with `all()` or broad `get()` calls. Use pagination for UI/API lists and chunk/lazy/cursor iteration for background processing. Prefer `chunkById()` or `lazyById()` when records are updated during iteration.
```

### 4. Async Jobs, Queues, And Schedules

Classification: NEW

Add operational guidance for async work:
- jobs should be idempotent;
- pass IDs or scalar payloads when possible;
- configure retries, backoff, timeout, and failure behavior intentionally;
- use after-commit dispatching when jobs depend on committed records;
- do not force Horizon, but use it when queue visibility and operations need it;
- scheduled tasks should use overlap protection and environment-aware visibility.

Recommended wording:

```md
Queued jobs should be safe to retry. Pass IDs or small scalar payloads, reload models in `handle()`, define retry/backoff/timeout behavior, and make permanent failures explicit. Dispatch after commit when the job depends on database writes.

Scheduled tasks should use overlap protection for long-running work and should be testable or observable enough that missed runs are detectable.
```

### 5. Frontend Stack Quality For Laravel Apps

Classification: NEW

Add optional stack-specific references for:
- Blade components and layout purity;
- Inertia/React typed page props, shared data, form errors, upload progress, and head management;
- Tailwind mobile-first responsive conventions and reusable component classes;
- accessibility checks for semantic HTML, labels, focus state, keyboard navigation, error messages, and reduced motion;
- SEO checks for public pages: canonical URLs, metadata, structured data, Open Graph, sitemap, robots, image performance, Core Web Vitals;
- Vite/React asset and environment safety.

Recommended wording:

```md
When a Laravel task touches UI, detect the frontend stack before editing. For Blade, keep templates focused on rendering and move reusable UI into components. For Inertia/React, type page props, use framework form helpers, handle validation errors, and manage document head metadata.

All user-facing UI should preserve labels, visible validation errors, keyboard focus, responsive layout, and loading/disabled states.
```

### 6. Browser E2E Tests For Critical Flows

Classification: UPDATE

Add Playwright guidance for flows not fully covered by PHP feature tests:
- prefer role/label locators;
- use web-first assertions;
- avoid fixed sleeps;
- use storage state for auth setup when appropriate;
- cover critical browser-only behavior such as JS forms, upload previews, modals, navigation, and accessibility-sensitive interactions.

Recommended wording:

```md
Use browser E2E tests for critical behavior that depends on JavaScript, browser state, or real user interaction. Prefer role and label locators, web-first assertions, and deterministic auth setup. Avoid fixed sleeps.
```

### 7. PHP And Code Quality Review Rubric

Classification: UPDATE

Add review guidance:
- detect PHP/Laravel version before recommending modern syntax;
- prefer explicit parameter, property, and return types;
- use enums/value objects where they reduce ambiguity;
- catch specific exceptions and avoid suppressing errors;
- reject generic naming, narration comments, debug artifacts, useless wrappers, premature interfaces, and tests that mirror implementation.

Recommended wording:

```md
Before adding PHP patterns, detect the project's PHP and Laravel versions. Prefer explicit types and modern syntax supported by the project. In reviews, flag generic names, narration comments, debug leftovers, useless wrapper classes, premature interfaces, excessive defensive branches, and tests that assert implementation instead of behavior.
```

### 8. Audit Output Modes

Classification: NEW

Add audit modes for:
- technical debt ledger;
- code quality/slop ledger;
- security checklist;
- docs hygiene review;
- Laravel implementation readiness.

Recommended wording:

```md
For audits, lead with findings ordered by severity and include file references, risk, recommendation, and verification. Use concise classifications such as `FIX_NOW`, `STANDARDIZE`, `PROJECT_ONLY`, `DUPLICATE`, or `IGNORE`.
```

### 9. Documentation Hygiene

Classification: NEW

Add docs guidance:
- avoid stale implementation summaries;
- archive or delete temporary plans after merge;
- keep durable docs focused on decisions, setup, operations, and domain rules;
- use ADRs for meaningful architectural decisions;
- clean duplicate or AI-generated filler docs.

Recommended wording:

```md
Keep project documentation durable. Preserve setup, operations, architecture decisions, and project-specific conventions. Remove or archive temporary plans, duplicate summaries, stale generated notes, and filler documentation after implementation.
```

### 10. Specialized Skill Boundaries

Classification: PROJECT_ONLY

Do not merge into the core custom Laravel skill by default:
- AI SDK workflows;
- vector search;
- MCP server development;
- Nova resource design;
- Laravel major-version upgrade playbooks;
- Horizon dashboard tuning;
- PRD writing;
- general Git workflow.

Recommendation:
- Keep these as optional future dedicated skills or references loaded only when the task explicitly needs them.

## Conflicts Introduced By External Skills

### Laravel Version Specificity

Classification: CONFLICT

Conflict:
- Some external skills assume Laravel 13 or newer PHP features.
- Existing source projects may use Laravel 12 or mixed versions.

Recommendation:
- Detect Laravel/PHP versions from `composer.json` before applying version-specific syntax, middleware, attributes, JSON:API helpers, AI SDK, or vector search patterns.

### Clean Architecture vs Laravel Pragmatism

Classification: CONFLICT

Conflict:
- External clean-code skills include repository, interface, SOLID, and design-pattern guidance.
- Laravel applications often stay cleaner with Eloquent, Form Requests, Policies, Services, and Actions before adding extra layers.

Recommendation:
- Keep architecture pragmatic. Add abstractions only when variation, complexity, or testing boundaries justify them.

### Generic Frontend Rules vs Laravel Stack Detection

Classification: CONFLICT

Conflict:
- External frontend skills include React, Vite, Tailwind, state management, SEO, and accessibility rules.
- Not every Laravel app uses those stacks.

Recommendation:
- Detect Blade, Livewire, Inertia, React, Vue, Tailwind, and Vite before applying stack-specific rules.
- Promote accessibility and form feedback as universal UI standards.

### API Formality vs Internal Admin Apps

Classification: CONFLICT

Conflict:
- API design skills encourage versioning, formal error envelopes, OpenAPI, and strict compatibility.
- Internal admin apps may only expose Blade/HTML or private JSON endpoints.

Recommendation:
- Apply full API lifecycle rules to public, partner, mobile, or consumed APIs.
- Keep private endpoints simpler but still stable, tested, and authorization-safe.

## Do Not Move

### PROJECT_ONLY

Keep these outside the core custom Laravel skill unless a future task explicitly needs them:
- AI SDK;
- vector search;
- MCP;
- Nova;
- Laravel major upgrade procedures;
- Horizon dashboard tuning;
- PRD writing;
- generic Git workflow;
- React state-management patterns not tied to Inertia pages;
- third-party repository installation commands.

### REJECT

Do not move:
- upstream skill files verbatim;
- upstream `README.md`, `AGENTS.md`, metadata, or installer content;
- agent-specific command wrappers;
- rules that require a frontend stack before stack detection;
- design patterns as mandatory defaults;
- broad "use every skill" behavior that would bloat `SKILL.md`.

## Suggested Merge Into `merged-proposal.md`

1. Add external sources to the source map.
2. Add accepted external rule groups to the classification summary.
3. Add new proposed standards:
   - API Contracts And Evolution
   - Security Review Baseline
   - Large Data And Query Volume
   - Async Jobs, Queues, And Schedules
   - Frontend Stack Quality
   - Browser E2E Tests
   - PHP And Code Quality Review Rubric
   - Audit Output Modes
   - Documentation Hygiene
4. Update recommended skill shape with new reference files:
   - `api-contracts.md`
   - `security.md`
   - `large-data-performance.md`
   - `async-operations.md`
   - `frontend-ui-seo.md`
   - `review-audit.md`
   - `documentation-hygiene.md`

