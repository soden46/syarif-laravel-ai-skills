---
name: using-laravel-standards
description: Read first when working in a Laravel repository to select the smallest relevant personal Laravel standards skill set.
tags:
  - laravel
  - php
---

# Using Syarif Laravel Standards

Use this skill as the entrypoint for Laravel implementation, refactoring, review, testing, and audit work.

## Workflow

1. Detect the project stack before changing code: Laravel version, PHP version, Sail/container vs host runner, frontend stack, test framework, queue driver, and installed quality tools.
2. Choose the smallest relevant skill set for the current task.
3. Prefer Laravel-native APIs and project conventions before adding custom abstractions.
4. Keep client names, credentials, provider quirks, local workarounds, and project-specific business rules out of reusable standards.
5. Verify behavior before handoff with targeted tests and available quality checks.

## Skill Selection

- Architecture and layer decisions: `architecture`
- Thin controllers and route boundaries: `controller-cleanup`
- HTTP validation and request authorization: `form-requests`
- Actions, Services, integrations, interfaces, and repositories: `actions-and-services`
- Atomic writes and side effects: `database-transactions`
- Eloquent models, relationships, and query shape: `eloquent-patterns`
- Broad Laravel feature work: `laravel-specialist`
- Laravel 11/12 app workflow: `laravel-11-12-app-guidelines`
- Database performance and query tuning: `laravel-database-optimization`
- Livewire components and tests: `livewire-development`, `livewire-patterns`
- Queues, jobs, workers, schedules, and Horizon: `queues-and-jobs`
- Security review: `security`
- Feature, unit, render, document, browser, and handoff tests: `testing`
- Extract reusable standards from a completed project: `extract-laravel-standards`

Project-specific `AGENTS.md` rules override these defaults when explicitly documented.

## Completion

Before declaring work complete, run the smallest meaningful verification set the project supports. If a check cannot run, report the command and reason.
