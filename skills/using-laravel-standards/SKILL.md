---
name: using-laravel-standards
description: Read first in Laravel repositories to detect the stack and select the smallest relevant Syarif standards skills for implementation, review, testing, and audits.
tags:
  - laravel
  - php
---

# Using Syarif Laravel Standards

Use this skill as the entrypoint for Laravel implementation, refactoring, review, testing, and audit work.

This is the only catalog entrypoint for the Syarif Laravel standards. It consolidates the former `using-laravel-superpowers` wrapper while keeping compatibility with Superpowers-derived topic coverage.

## Workflow

1. Run the `memory-management` automatic preflight when the skill is available: `node <memory-skill-dir>/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>"`. Use its compact output as orientation only.
2. Detect the project stack before changing code: Laravel version, PHP version, Sail/container vs host runner, frontend stack, test framework, queue driver, and installed quality tools.
3. Choose the smallest relevant skill set for the current task.
4. Prefer Laravel-native APIs and project conventions before adding custom abstractions.
5. Keep client names, credentials, provider quirks, local workarounds, and project-specific business rules out of reusable standards.
6. Verify behavior before handoff with targeted tests and available quality checks.
7. At handoff, use `memory-management` to checkpoint durable decisions, touched files, and pending work when the task changed project knowledge.

## Skill Selection

- Architecture and layer decisions: `architecture`
- Multi-menu/page app structure: `module-per-menu`
- Thin controllers and route boundaries: `controller-cleanup`
- HTTP validation and request authorization: `form-requests`
- Actions, Services, integrations, interfaces, and repositories: `actions-and-services`
- Atomic writes and side effects: `database-transactions`
- Eloquent models, relationships, and query shape: `eloquent-patterns`
- Broad Laravel feature work: `laravel-specialist`
- Persistent conversation, project, user, workflow, and codebase context: `memory-management`
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

Project-specific `AGENTS.md` rules override these defaults when explicitly documented.

## Completion

Before declaring work complete, run the smallest meaningful verification set the project supports. If a check cannot run, report the command and reason.
