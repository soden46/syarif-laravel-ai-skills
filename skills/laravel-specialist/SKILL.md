---
name: laravel-specialist
description: Coordinate full Laravel feature work across models, APIs, auth, queues, Livewire, tests, and quality checks by routing to focused skills.
tags:
  - laravel
  - php
---

# Laravel Specialist

Use this skill for broad Laravel implementation, refactoring, review, or bug-fixing tasks that touch several parts of an application.

This is an orchestration skill. Prefer loading the smallest focused skill once the task shape is clear.

## Workflow

1. Read project instructions first: `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and relevant docs when present.
2. Detect the stack before editing: Laravel version, PHP version, database, queue driver, auth package, frontend stack, test framework, formatter, static analysis, and runner.
3. Identify the primary workflow boundary: HTTP, console, queue, scheduled task, Livewire, API, integration, or data migration.
4. Select focused skills and apply existing project conventions before introducing new patterns.
5. Verify with the smallest meaningful tests and quality checks.

## Skill Routing

- New feature architecture: `architecture`, `actions-and-services`
- Controllers and routes: `controller-cleanup`, `routes-best-practices`
- Validation and authorization: `form-requests`, `policies-and-authorization`
- Models and queries: `eloquent-patterns`, `eloquent-relationships`
- API responses: `api-resources-and-pagination`, `api-surface-evolution`
- Database writes and consistency: `database-transactions`
- Database performance: `laravel-database-optimization`
- Queues, workers, and Horizon: `queues-and-jobs`
- Livewire implementation, architecture, and tests: `livewire-development`
- Security: `security`, `rate-limiting`, `request-forgery-protection`
- Tests and handoff: `testing`, `tdd-with-pest`, `quality-checks`

## Guardrails

- Keep controllers focused on HTTP orchestration.
- Put reusable workflows in Actions or Services only when they reduce real complexity.
- Use Eloquent relationships, scopes, casts, policies, resources, jobs, events, and framework fakes before custom infrastructure.
- Queue slow external calls, email, exports, imports, and other work that should not block the request.
- Never skip validation, authorization, transaction boundaries, or failure handling because a task is "small".
- Avoid raw SQL unless Eloquent or the query builder cannot express the needed shape clearly or efficiently.
- Keep secrets, client names, private URLs, and one-off business rules out of reusable guidance.

## Handoff

Report the files changed, checks run, and any checks that could not run. If the task touches data shape, include migration and rollback risk in the handoff.
