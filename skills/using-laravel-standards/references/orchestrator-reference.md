# Orchestrator Reference

Combined reference for `using-laravel-standards`.

## Skill Selection

Load the smallest relevant skill set for the current task.

### Primary skills by domain

- Architecture and layer decisions: `architecture`
- Multi-menu/page app structure: `module-per-menu`
- Thin controllers and route boundaries: `controller-cleanup`
- HTTP validation and request authorization: `form-requests`
- Actions, Services, integrations, interfaces, and repositories: `actions-and-services`
- Atomic writes and side effects: `database-transactions`
- Eloquent models, relationships, and query shape: `eloquent-patterns`
- Broad Laravel feature work: `laravel-specialist`
- Laravel 11/12 app workflow: `laravel-11-12-app-guidelines`
- Database performance and query tuning: `laravel-database-optimization`
- UI/UX design, frontend implementation, agent-browser inspection, Playwright checks, and backend contract alignment: `ui-agent-browser`
- Livewire components, architecture, security, performance, and tests: `livewire-development`
- Responsive UI, mobile layout, overflow, modals, tables, and visual regression: `responsive-ui-testing`
- Queues, jobs, workers, schedules, and Horizon: `queues-and-jobs`
- WhatsApp integration through a Baileys sidecar with Windows/VPS setup docs: `integrate-whatsapp-baileys-laravel`
- Security review: `security`
- Feature, unit, render, document, browser, and handoff tests: `testing`
- Extract reusable standards from a completed project: `extract-laravel-standards`

### Conflict resolution

When multiple skills could apply:
1. Choose one primary skill that owns the main change.
2. Choose at most two supporting skills unless HIGH risk requires more.
3. Prefer the skill with the narrowest scope that still covers the task.
4. Do not load every related skill to feel thorough.

### Override hierarchy

When rules conflict, apply in this order:
1. User instruction
2. Repository rules (`AGENTS.md`, project-specific instructions)
3. Project skill
4. Framework skill
5. Generic coding skill

Safety/security rules remain non-negotiable regardless of hierarchy.

## Verification Depth

Match verification to risk level. Run the smallest meaningful check that proves the change.

- **LOW**: syntax/static check.
- **MEDIUM**: targeted feature/unit test + affected callers.
- **HIGH**: targeted verification + affected regression surface + failure paths + relevant data/security/concurrency checks.

For Laravel, prefer:
```bash
php artisan test --filter=SpecificTest
```
over full suite for small tasks.

Run the full test suite only when it is cheap or explicitly justified.

## Overengineering Control

### Decision gate

Before creating any new file, class, service, repository, DTO, Form Request, middleware, helper, trait, abstraction, or dependency:
- determine whether the existing execution path can solve the task safely
- if yes, reuse it
- if no, create only the smallest justified abstraction

Semantic necessity matters more than LOC.

### Ladder

Stop at the first rung that holds:

1. Does this need to exist at all? Speculative need = skip it.
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature covers it? Use it.
5. Already-installed dependency solves it? Use it.
6. Can this be one line? Make it one line.
7. Only then: minimum code that works.

### False reuse protection

Reuse only when semantics match, not merely because code looks similar.

### Boundaries

Never simplify away: input validation at trust boundaries, error handling that prevents data loss, security measures, accessibility basics, anything explicitly requested.

## Memory Details

### When to use memory

Run memory preflight only when at least one is true:
- the user references previous work or prior decisions
- the task depends on project history
- a known project convention is needed
- a relevant memory tool is actually available
- durable prior context materially affects the implementation

For self-contained local tasks, skip memory entirely.

### Source precedence

When memory and current evidence conflict, trust this order:
1. Current code
2. Current config
3. Project docs
4. Explicit project memory
5. Conversation memory
6. Inferred memory

### Checkpoint only reusable knowledge

Store only:
- architectural decision
- non-obvious constraint
- bug root cause that is reusable
- project convention
- environment quirk

Do not store:
- line-number changes
- temporary debug notes
- short-lived branches
- one-time grep results

### Decision memory

Prefer storing the decision, not just the fact.

Good:
- Chose session-persisted filters instead of query-string persistence because existing project convention uses session state.

Bad:
- Search filter uses session.
