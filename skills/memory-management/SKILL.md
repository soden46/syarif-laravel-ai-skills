---
name: memory-management
description: Provide automatic long-term Laravel AI memory preflight, recall, checkpointing, and secure cross-project context across conversation, project, user, workflow, and codebase scopes.
tags:
  - laravel
  - php
---

# Memory Management

Layer: 0 (Preflight)

Use this skill as the mandatory first layer before any Laravel skill writes code. It loads only the memory needed for the current task, then hands off to the next layer.

## Core Principles

- Remember only what remains useful.
- Retrieve only what is relevant.
- Verify before trusting.
- Anonymize before sharing across projects.
- Never persist secrets.
- Preserve provenance for every durable entry.
- Prefer continuity without context overload.

## Mandatory Preflight

Run this before any broad exploration or skill selection:

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
