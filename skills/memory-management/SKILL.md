---
name: memory-management
description: Recall, checkpoint, and audit durable Laravel project knowledge across sessions when prior context materially affects the current task.
tags:
  - laravel
  - php
---

# Memory Management

Use this skill when the task depends on prior context, project history, or known conventions. For self-contained local tasks, skip memory entirely.

## Core Principles

- Remember only what remains useful.
- Retrieve only what is relevant.
- Verify before trusting.
- Anonymize before sharing across projects.
- Never persist secrets.
- Preserve provenance for every durable entry.
- Prefer continuity without context overload.

## Conditional Preflight

Run this only when at least one is true:
- the user references previous work or prior decisions
- the task depends on project history
- a known project convention is needed
- a relevant memory tool is actually available
- durable prior context materially affects the implementation

For self-contained local tasks, skip memory entirely.

```bash
node <skill-dir>/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5
```

This returns compact relevant memory. Do not load every memory file by default.

## Recall Budget

Default recall budget:

- User memory: ~200 tokens
- Conversation memory: ~500 tokens
- Project memory: ~800 tokens
- Workflow memory: ~400 tokens
- Codebase context: remaining budget up to ~2200 tokens
- Reserve: ~400 tokens

Stop retrieving when marginal relevance is lower than token cost.

## Graph Memory

When `memory-graph.json` exists, query the graph before opening Markdown evidence:

```bash
node <skill-dir>/scripts/memory.mjs graph query "<task intent>" --limit 5
node <skill-dir>/scripts/memory.mjs graph path <from-id> <to-id>
node <skill-dir>/scripts/memory.mjs graph explain <memory-id>
```

Use graph edges with confidence tags:
- `EXTRACTED` = explicit in source
- `INFERRED` = derived by reasoning
- `AMBIGUOUS` = weak or conflicting evidence

## Memory Staleness

Memory is not forever. Every memory entry should carry a lifecycle:

- `CURRENT` - actively valid and aligned with current codebase.
- `STALE` - likely outdated; verify before trusting.
- `SUPERSEDED` - replaced by newer memory or current code.
- `TEMPORARY` - valid only for the current session or short horizon.

When the codebase or architecture changes, mark older project memories as `STALE` or `SUPERSEDED` rather than deleting them. Prefer current code over old memory.

## Source Precedence

When memory and current evidence conflict, trust this order:

1. Current code
2. Current config
3. Project docs
4. Explicit project memory
5. Conversation memory
6. Inferred memory

This prevents memory poisoning during implementation.

## Selective Checkpointing

Do not checkpoint everything. Store only reusable durable knowledge:

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

## Decision Memory

Prefer storing the decision, not just the fact.

Good:
- Chose session-persisted filters instead of query-string persistence because existing project convention uses session state.

Bad:
- Search filter uses session.

Decision memory helps the next agent understand why, not just what.

## Checkpoint At Handoff

Run checkpoint after meaningful work:

```bash
node <skill-dir>/scripts/memory.mjs checkpoint --project <alias> --summary "<handoff summary>" --pending "<open questions>" --files "app/Actions/Foo.php,tests/Feature/FooTest.php"
```

Memory checkpoint is never a requirement for task completion. It occurs only when durable reusable knowledge was produced.

## Security Pipeline

Before writing memory, pass data through:

```text
raw input -> secret detection -> personal-data classification -> scope classification -> anonymization -> retention policy -> encryption at rest -> memory storage
```

Never store secrets, raw emails, phone numbers, .env contents, or customer personal data.

## References

- Graph memory commands and formats: `references/graph-memory.md`
- Hermes-style orchestrator profile: `references/hermes-orchestrator-profile.md`
- MCP/hook installation targets: `references/install-targets.md`
