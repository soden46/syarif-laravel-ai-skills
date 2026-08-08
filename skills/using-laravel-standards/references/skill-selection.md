# Skill Selection Reference

Load the smallest relevant skill set for the current task.

## Primary skills by domain

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

## Conflict resolution

When multiple skills could apply:
1. Choose one primary skill that owns the main change.
2. Choose at most two supporting skills unless HIGH risk requires more.
3. Prefer the skill with the narrowest scope that still covers the task.
4. Do not load every related skill to feel thorough.

## Override hierarchy

When rules conflict, apply in this order:
1. User instruction
2. Repository rules (`AGENTS.md`, project-specific instructions)
3. Project skill
4. Framework skill
5. Generic coding skill

Safety/security rules remain non-negotiable regardless of hierarchy.
