# Memory Details Reference

Detailed memory-management guidance for `using-laravel-standards`.

## When to use memory

Run memory preflight only when at least one is true:
- the user references previous work or prior decisions
- the task depends on project history
- a known project convention is needed
- a relevant memory tool is actually available
- durable prior context materially affects the implementation

For self-contained local tasks, skip memory entirely.

## Source precedence

When memory and current evidence conflict, trust this order:
1. Current code
2. Current config
3. Project docs
4. Explicit project memory
5. Conversation memory
6. Inferred memory

## Checkpoint only reusable knowledge

Store only:
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

## Decision memory

Prefer storing the decision, not just the fact.

Good:
- Chose session-persisted filters instead of query-string persistence because existing project convention uses session state.

Bad:
- Search filter uses session.
