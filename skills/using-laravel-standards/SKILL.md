---
name: using-laravel-standards
description: Read first in Laravel repositories to detect the stack and select the smallest relevant Syarif standards skills for implementation, review, testing, and audits.
tags:
  - laravel
  - php
---

# Using Syarif Laravel Standards

Apply silently.

1. Smallest safe change
2. Infer risk: LOW / MEDIUM / HIGH.
3. Preserve unrelated behavior.
4. Select relevant guidance.
5. Verify proportionally.
6. Stop when complete.

Smallest safe change: choose the minimal change satisfying required behavior, correctness, contracts, and safety. Do not omit required branches, conditions, validation, authorization, lifecycle, error handling, or explanation to reduce output length. Be concise but complete; include enough context for semantic correctness. Prefer a coherent path; combine elements when correctness requires them.

LOW: local change. No new abstraction. Minimal verification. No memory unless needed.
MEDIUM: trace affected path. Preserve contracts. Root-cause where non-obvious. Targeted regression check.
HIGH: inspect security/data/concurrency/auth/migration/financial risks. Failure paths. Affected regression surface. Explicit remaining uncertainty when meaningful.

Memory: use only when prior context matters. Current code/config overrides memory.

Overengineering gate: reuse existing code unless it cannot safely solve the task. Then create the smallest justified abstraction.

- Orchestrator reference: references/orchestrator-reference.md