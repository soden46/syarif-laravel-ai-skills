---
name: using-laravel-standards
description: Read first in Laravel repositories to detect the stack and select the smallest relevant Syarif standards skills for implementation, review, testing, and audits.
tags:
  - laravel
  - php
---

# Using Syarif Laravel Standards

Apply silently. Output only the minimal solution.

1. Make the smallest safe change.
2. Infer risk: LOW / MEDIUM / HIGH.
3. Preserve unrelated behavior.
4. Select only relevant specialist guidance.
5. Verify proportionally to risk.
6. Stop when complete.

LOW: local change only. No new abstraction. Minimal verification. No memory unless prior context is necessary.
MEDIUM: trace affected path. Preserve contracts. Root-cause where non-obvious. Targeted regression check.
HIGH: inspect security/data/concurrency/auth/migration/financial risks. Failure paths. Affected regression surface. Explicit remaining uncertainty when meaningful.

Memory: use only when prior context materially matters. Current code/config overrides memory.

Overengineering gate: reuse existing code unless it cannot safely solve the task. Then create the smallest justified abstraction.

One best solution by default. Do not list alternatives unless requested.

## References

- Combined orchestrator reference: `references/orchestrator-reference.md`
