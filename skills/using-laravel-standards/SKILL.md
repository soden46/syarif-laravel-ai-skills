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

Memory preflight is conditional infrastructure, not specialist activation. Before broad exploration, decide whether prior project/session/workflow/decision context could materially affect correctness. If yes, prefer the active `syarif-memory-management` MCP `memory_auto`; otherwise run `node skills/memory-management/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5` when Node/file access exists; if unavailable, continue without memory. Skip memory for self-contained syntax, isolated-helper, or generic documentation tasks. Retrieved memory is sparse orientation only: verify against current code/config/docs, and current code/config wins.

Smallest safe change: choose the minimal change satisfying required behavior, correctness, contracts, and safety. Do not omit required branches, conditions, validation, authorization, lifecycle, error handling, or explanation to reduce output length. Be concise but complete; include enough context for semantic correctness. Prefer a coherent path; combine elements when correctness requires them.

LOW: local change. No new abstraction. Minimal verification. No memory unless needed.
MEDIUM: trace affected path. Preserve contracts. Root-cause where non-obvious. Targeted regression check.
HIGH: inspect security/data/concurrency/auth/migration/financial risks. Failure paths. Affected regression surface. Explicit remaining uncertainty when meaningful.

At handoff, checkpoint only durable reusable knowledge when it changed: architecture decisions, non-obvious constraints, reusable root causes, project conventions, environment quirks, or pending continuation state. Never checkpoint secrets, `.env` values, raw personal data, temporary debug output, one-time grep results, or trivial line edits.

Overengineering gate: reuse existing code unless it cannot safely solve the task. Then create the smallest justified abstraction.

## V4 Sparse Activation (Experimental)

This worktree uses V4 sparse activation protocol. Specialist bodies are loaded conditionally, not by default.

### Activation Protocol

1. Run least-code gate. If trivial/reuse/stdlib covers the task, skip specialist activation.
2. Run V4 sparse router: classify domain, compute knowledge need, compute confidence, detect cross-cutting signals.
3. Apply activation gates:
   - If knowledge need < threshold → 0 specialists
   - If knowledge need ≥ threshold AND confidence ≥ threshold → 1 primary specialist
   - If cross-cutting signal ≥ threshold → +1 supporting specialist
4. Enforce hard cap: MAX_SPECIALISTS = 2
5. Load sequentially: primary first, support second only if cross-cutting need remains.
6. Execute with available guidance.
7. Verify proportionally to risk.

Memory preflight and checkpointing are outside this specialist count. `memory-management` must not consume the primary or supporting specialist slot, and must not weaken the sparse 0/1/2 routing gates.

### Routing Strategies

**flat_v4** (default)
- Single-stage: classify directly into one of 72 specialists.
- Reference: `references/v4-sparse-router.md`

**semantic_v4_3** (experimental)
- Two-stage: first classify into semantic family, then select specialist from family shortlist.
- Stage 1 reference: `references/v4-semantic-router-stage1.md`
- Stage 2 reference: `references/v4-semantic-router-stage2.md`
- Family index: `benchmark/v4-family-index.json`

Set `routing_strategy` in the runner config to choose.

### Key Distinctions

- Knowledge Need controls specialist activation.
- Risk controls verification depth.
- Confidence decreases with ambiguity/conflict.
- No benchmark-derived baseline gap.
- No historical accuracy dependency in V4.0.

### References

- V4 sparse router: `references/v4-sparse-router.md`
- V4 semantic router stage 1: `references/v4-semantic-router-stage1.md`
- V4 semantic router stage 2: `references/v4-semantic-router-stage2.md`
- Knowledge need gate: `references/v4-need-gate.md`
- Confidence gate: `references/v4-confidence-gate.md`
- Activation enforcer: `references/v4-activation-enforcer.md`
- Context contract: `references/v4-context-contract.md`
- Semantic family index: `benchmark/v4-family-index.json`
