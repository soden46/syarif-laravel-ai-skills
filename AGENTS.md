# AGENTS.md

This file provides guidance to AI coding agents when working in this repository.

## Repository Overview

This repository packages reusable Laravel AI skills. Skills are packaged instructions, workflows, scripts, and references that extend coding agent capabilities for Laravel projects.

## Source Of Truth

- Canonical skills live only under `skills/<skill-name>/SKILL.md`.
- Skill folder names and frontmatter `name` values must match exactly.
- Every skill must be assigned to exactly one skills.sh group in `skills.sh.json`.
- Every skill must be assigned to exactly one plugin in `plugin-groups.json`.
- Universal assistant metadata is generated at `agent-skills.json`.
- Codex marketplace artifact metadata lives at `.codex-plugin/plugin.json` and points directly to canonical `skills/`.
- Claude Code root plugin metadata lives at `.claude-plugin/plugin.json` and points directly to canonical `skills/` through `.claude-plugin/marketplace.json`.
- Generated marketplace/plugin output lives in `.agents/plugins/marketplace.json`, `.claude-plugin/`, and `plugins/`.
- Local generated Claude Code plugin manifests also live at `plugins/<plugin-name>/.claude-plugin/plugin.json` after `npm run sync`.
- Generated plugin skill copies under `plugins/<plugin-name>/skills/` are local build output and are ignored to keep marketplace artifacts under the 128-file scan limit.
- Do not edit generated plugin skill copies directly; edit `skills/` and run `npm run sync`.

## Creating Or Updating A Skill

Before creating a skill, search canonical names, descriptions, triggers, and workflows under `skills/`. Merge substantially overlapping guidance into the strongest canonical skill and update aliases/mappings instead of adding a competing trigger.

### Directory Structure

```text
skills/
  skill-name/
    SKILL.md
    scripts/      # Optional executable scripts
    references/   # Optional docs loaded on demand
    assets/       # Optional templates or output assets
```

### Naming Conventions

- Skill directories use lowercase kebab-case, for example `form-requests`.
- `SKILL.md` is always uppercase and uses this exact filename.
- Frontmatter `name` must match the directory name.
- Scripts should use kebab-case names such as `collect-signals.mjs`.

### SKILL.md Format

```markdown
---
name: skill-name
description: One concise sentence describing what the skill does and when to use it.
---

# Skill Title

Use imperative instructions that help the next agent do the work.
```

Keep frontmatter to `name` and `description` only. Put trigger context in `description`, because the body is loaded only after the skill is selected.

Note: public Laravel discovery also expects `tags` containing `laravel` and `php` when present in existing skills. Preserve those tags when editing current skills.

## Layered Protocol

This repository uses a thin orchestrator with selective specialist activation. The always-loaded core is intentionally small; detailed knowledge stays in specialist skills loaded on demand.

### Core: Tiny Orchestrator

`using-laravel-standards` is the always-loaded entrypoint. It should remain approximately 150–300 tokens. Its job is routing, not knowledge delivery:

- Apply silently. Output only the minimal solution.
- Make the smallest safe change.
- Infer risk: LOW / MEDIUM / HIGH.
- Preserve unrelated behavior.
- Select only relevant specialist guidance.
- Verify proportionally to risk.
- Stop when complete.

### Specialist Activation

Load specialist skills only when the task domain requires them. Default to one primary skill and at most two supporting skills unless HIGH risk requires more.

- `least-code`: load for focused implementation, review, or refactor work when minimization discipline is needed.
- All other skills are on-demand execution skills.

### Conditional Memory Infrastructure

`memory-management` is not a specialist slot. The entrypoint may run a sparse memory preflight before broad exploration when prior project, session, workflow, or decision context could materially affect correctness. Skip it for clearly self-contained tasks. Prefer the active `syarif-memory-management` MCP server, fall back to `skills/memory-management/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5` when file and Node access exist, and continue normally when memory is unavailable. Current code/config overrides memory.

### Risk Depth

- **LOW**: minimal local change. No new abstraction/dependency. No memory lookup unless prior context is necessary. One minimal targeted verification. No protocol narration.
- **MEDIUM**: trace affected execution path. Identify likely/confirmed root cause. Preserve affected contracts. Targeted regression verification. Load relevant specialist guidance.
- **HIGH**: inspect applicable security/data/concurrency/auth/migration/financial concerns. Failure paths. Affected regression surface. Explicit remaining uncertainty when meaningful. Load only relevant high-risk specialist guidance.

Do not load HIGH-risk guidance for LOW tasks.

### Architecture Note

Keep the permanent control plane thin: Memory → Decision/minimization → Framework orchestration.

Treat Laravel, Livewire, Database, Testing, Security, and API skills as on-demand execution skills, not permanent layers. This keeps the framework scalable and avoids context overhead.

## Context Efficiency

- Keep the always-loaded orchestrator (`using-laravel-standards`) under 300 tokens.
- Keep specialist skill `SKILL.md` bodies under 500 lines.
- Move detailed tables, examples, and long guidance into `references/`.
- Link reference files directly from `SKILL.md`; avoid nested reference chasing.
- Prefer scripts for repeatable or fragile operations.
- Keep skill bodies concise, action-oriented, and free of client names, secrets, private URLs, personal data, and one-off business rules.

## Public Discovery

Document skills.sh installation for public skills:

```bash
npx skills add soden46/syarif-laravel-ai-skills --skill skill-name
```

The skills.sh repository page is grouped by `skills.sh.json`. Update it whenever adding, removing, or renaming a skill.

## Universal Assistant Usage

This repo is designed for any AI assistant that can read files, not only assistants with native skill/plugin support.

- Start with `skills/using-laravel-standards/SKILL.md`. It is intentionally small; load specialist skills only when the task requires them.
- Use `agent-skills.json` for machine-readable entry points, install commands, and canonical paths.
- Read [docs/UNIVERSAL_USAGE.md](docs/UNIVERSAL_USAGE.md) for assistant-specific usage patterns.
- For generic assistants, prompt them to read `AGENTS.md`, then load only the focused `skills/<skill-name>/SKILL.md` files needed for the task.

## Workflow

After changing skills, skills.sh grouping, or plugin grouping, run:

```bash
npm run sync
npm run validate
npx skills add . --list
```

`npm run validate` also checks that tracked files stay within the codex-marketplace.com 128-file scan limit.

After pushing, verify GitHub discovery:

```bash
npx skills add soden46/syarif-laravel-ai-skills --list
```

## Capability Preservation

Do not delete specialist skills to reduce orchestration token usage. The framework's value is its knowledge library. Optimize routing and activation, not content.

Before considering any orchestrator change complete:
- confirm no specialist skill was accidentally removed
- confirm project-derived knowledge remains
- confirm routing still exposes specialist knowledge when relevant
- confirm trivial tasks can avoid loading specialist guidance
- confirm MEDIUM/HIGH tasks can still reach their relevant specialist skills
