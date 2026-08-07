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

This repository uses a strict layered protocol to keep token usage low and output quality high. Every task MUST pass through the layers in order.

### Layer 0: Memory Preflight

Run `memory-management` automatic preflight before anything else:

```bash
node <memory-skill-dir>/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5
```

If `memory-graph.json` exists, run one graph query instead of loading all memory. Use compact output as orientation only.

### Layer 1: least-code Minimization

Activate `least-code` before any code change. Apply the minimization ladder: YAGNI, reuse existing codebase helpers, stdlib, native platform features, installed dependencies, one-liners, then minimum working code. Keep the shortest diff and the smallest explanation.

### Layer 2: Risk Classification and Skill Selection

Classify task risk before implementation:

- **LOW**: typo, Blade text, CSS kecil, rename lokal.
- **MEDIUM**: validation, query, Livewire state, controller/service refactor.
- **HIGH**: migration, auth, permission, payroll, financial calculation, concurrency, destructive action.

Risk level determines trace depth, verification depth, and review strictness. Detect the project stack: Laravel version, PHP version, Sail/container vs host runner, frontend stack, test framework, queue driver, installed quality tools.

Choose the smallest relevant skill set for the current task. Load only the focused `SKILL.md` files needed. Do not load every skill. When multiple skills could apply, choose one primary skill and at most two supporting skills unless HIGH risk requires more.

### Layer 3: Focused Implementation

Apply the selected focused skills. Each skill governs its own domain and includes a `Context Efficiency` footer with its layer and loading guidance.

### Layer 4: Verification and Handoff

Verify with the smallest meaningful tests and quality checks the project supports. Match verification to risk level:

- LOW: syntax/static check.
- MEDIUM: targeted feature/unit test + affected callers.
- HIGH: targeted verification + affected regression surface + failure paths + relevant data/security/concurrency checks.

Run the full test suite only when it is cheap or explicitly justified.

Memory checkpoint is never a requirement for task completion. It occurs only when durable reusable knowledge was produced. At handoff, use `memory-management` to checkpoint durable decisions, touched files, and pending work when the task changed project knowledge.

### Architecture Note

Keep the permanent control plane thin: Memory → Decision/minimization → Framework orchestration.

Treat Laravel, Livewire, Database, Testing, Security, and API skills as on-demand execution skills, not permanent layers. This keeps the framework scalable and avoids context overhead.

## Context Efficiency

- Keep `SKILL.md` under 500 lines.
- Move detailed tables, examples, and long guidance into `references/`.
- Link reference files directly from `SKILL.md`; avoid nested reference chasing.
- Prefer scripts for repeatable or fragile operations.
- Keep skill bodies concise, action-oriented, and free of client names, secrets, private URLs, personal data, and one-off business rules.
- Every skill must include a `Context Efficiency` footer stating its layer and when to load it.

## Public Discovery

Document skills.sh installation for public skills:

```bash
npx skills add soden46/syarif-laravel-ai-skills --skill skill-name
```

The skills.sh repository page is grouped by `skills.sh.json`. Update it whenever adding, removing, or renaming a skill.

## Universal Assistant Usage

This repo is designed for any AI assistant that can read files, not only assistants with native skill/plugin support.

- Start with `skills/using-laravel-standards/SKILL.md`.
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
