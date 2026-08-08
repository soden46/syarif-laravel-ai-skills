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

## Silent execution

Apply orchestration internally. Do not recite layer names, protocol steps, checklists, or internal decision process unless the user explicitly asks for a plan or explanation. The normal output must focus on the requested code/task, not the framework.

## Minimal protocol

1. Make the smallest safe change.
2. Infer risk silently.
3. Preserve unrelated behavior.
4. Escalate guidance only when needed.
5. Do not overengineer.
6. Verify proportionally to risk.

## Conditional memory

Run memory preflight only when at least one is true:
- the user references previous work or prior decisions
- the task depends on project history
- a known project convention is needed
- a relevant memory tool is actually available
- durable prior context materially affects the implementation

For self-contained local tasks, skip memory entirely. Memory must remain subordinate to current code/config.

## Risk depth

- **LOW**: minimal local change. No new abstraction/dependency. No memory retrieval unless needed. One minimal targeted verification. No protocol narration.
- **MEDIUM**: trace affected execution path. Identify likely/confirmed root cause. Preserve affected contracts. Targeted regression verification. Load only relevant supporting guidance.
- **HIGH**: full data/security/auth/concurrency/migration reasoning when applicable. Failure paths. Affected regression surface. Explicit remaining uncertainty/risk. Broader verification only when justified.

Do not load HIGH-risk guidance for LOW tasks.

## Skill selection

Load the smallest relevant skill set. Choose one primary skill and at most two supporting skills unless HIGH risk requires more. Prefer the skill with the narrowest scope that still covers the task.

Project-specific `AGENTS.md` rules override these defaults when explicitly documented.

## Definition of done

A task is complete only when:
- requested behavior works,
- unrelated behavior is preserved,
- targeted verification passes,
- no unnecessary abstraction/dependency was added,
- durable knowledge is checkpointed only if reusable.

## Detailed references

- Full skill catalog and selection guidance: `references/skill-selection.md`
- Risk-aware verification depth: `references/verification-depth.md`
- Memory and checkpointing details: `references/memory-details.md`
- Overengineering control and conflict resolution: `references/overengineering-control.md`
