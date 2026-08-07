---
name: using-laravel-standards
description: Read first in Laravel repositories to detect the stack and select the smallest relevant Syarif standards skills for implementation, review, testing, and audits.
tags:
  - laravel
  - php
---

# Using Syarif Laravel Standards

Layer: 2 (Orchestrator)

Use this skill as the mandatory entrypoint for all Laravel work. It enforces the layered protocol that keeps token usage low and output quality high.

## Mandatory Layered Protocol

Every task MUST pass through these layers in order. Do not skip a layer.

### Layer 0: Memory Preflight

Run `memory-management` automatic preflight before anything else:

```bash
node <memory-skill-dir>/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5
```

If `memory-graph.json` exists, run one graph query instead of loading all memory:

```bash
node <memory-skill-dir>/scripts/memory.mjs graph query "<task intent>" --limit 5
```

Use the compact output as orientation only. Do not dump full memory files into context.

### Layer 1: least-code Minimization

Activate `least-code` before any code change. Apply the ladder:

1. Does this need to exist? (YAGNI)
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature covers it? Use it.
5. Installed dependency solves it? Use it.
6. Can this be one line? Make it one line.
7. Only then: minimum code that works.

The ladder runs after you understand the problem. Read the task and the code it touches first, then climb. Bug fix = root cause, not symptom. Grep every caller before editing.

### Layer 2: Risk Classification and Skill Selection

Before implementation, classify the task risk:

- **LOW**: typo, Blade text, CSS kecil, rename lokal.
  - Inspect affected file only.
  - Syntax/static check is enough.

- **MEDIUM**: validation, query, Livewire state, controller/service refactor, non-destructive action.
  - Trace affected flow.
  - Targeted test + affected callers.
  - Check authorization boundary and regression surface.

- **HIGH**: migration, auth, permission, payroll, financial calculation, concurrency, destructive action, data-shape change.
  - Full trace required.
  - Architecture/data/security review before patch.
  - Affected regression surface + failure-path verification required.
  - Explicit behavior preservation check mandatory.

Risk level determines verification depth and exploration breadth.

### Layer 3: Focused Implementation

Apply the selected focused skills. Each skill governs its own domain:

- Architecture and layer decisions: `architecture`
- Thin controllers: `controller-cleanup`
- HTTP validation and auth: `form-requests`
- Actions and Services: `actions-and-services`
- Atomic writes: `database-transactions`
- Eloquent models and queries: `eloquent-patterns`
- Broad Laravel feature work: `laravel-specialist`

### Layer 4: Verification and Handoff

Verify with the smallest meaningful tests and quality checks the project supports.

Match verification to risk level:
- **LOW**: syntax/static check.
- **MEDIUM**: targeted feature/unit test + affected callers.
- **HIGH**: targeted verification + affected regression surface + failure paths + relevant data/security/concurrency checks.

Run the full test suite only when it is cheap or explicitly justified.

Memory checkpoint is never a requirement for task completion. It occurs only when durable reusable knowledge was produced. If no reusable knowledge was generated, finish without checkpointing.

## Context Efficiency Rules

These rules apply to every skill in this repository:

- Load only the focused `SKILL.md` files needed for the task.
- Never load all skills into context at once.
- Prefer scripts and references over long skill bodies.
- Keep explanations shorter than the code they explain.
- If a skill body exceeds 500 lines, move details to `references/`.
- Mark deliberate simplifications with `least-code:` comments naming the ceiling and upgrade path.

## Skill Selection

Load the smallest relevant skill set:

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

## Skill Conflict Resolution

When multiple skills could apply:

1. Choose one primary skill that owns the main change.
2. Choose at most two supporting skills unless HIGH risk requires more.
3. Prefer the skill with the narrowest scope that still covers the task.
4. Do not load every related skill to feel thorough.

## Skill Override Hierarchy

When rules conflict, apply in this order:
1. User instruction
2. Repository rules (`AGENTS.md`, project-specific instructions)
3. Project skill
4. Framework skill
5. Generic coding skill

Safety/security rules remain non-negotiable regardless of hierarchy.

## Definition of Done

A task is complete only when:
- requested behavior works,
- unrelated behavior is preserved,
- targeted verification passes,
- no unnecessary abstraction/dependency was added,
- durable knowledge is checkpointed only if reusable.

## Completion

Before declaring work complete, run the smallest meaningful verification set the project supports. If a check cannot run, report the command and reason.
