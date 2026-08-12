# V4 Context Contract

## Purpose

Defines a lightweight, architecture-compatible abstraction for specialist context candidates. Long-term memory retrieval is handled by the separate conditional memory preflight and is not processed by this specialist activation contract.

## ContextCandidate

```yaml
ContextCandidate:
  id: string                    # Unique identifier
  source_type: enum             # specialist
  domain: string                # Domain classification (e.g., "queues", "validation")
  relevance: float              # 0.0–1.0, computed by retrieval layer
  need: float                   # 0.0–1.0, computed by router
  confidence: float             # 0.0–1.0, computed by router
  cost_estimate: int            # Estimated token cost to load
  priority: float               # Composite score for ordering
  activation_decision: enum     # activate | defer | reject
  rationale: string             # Human-readable explanation
```

## Source Types

| Source Type | V4.1 Status | Description |
|-------------|-------------|-------------|
| specialist | Implemented | Specialist skill bodies from the catalog |

## Priority Computation

For V4.1, only `specialist` source types are produced. Priority is computed as:

```
priority = (need × 0.5) + (confidence × 0.3) + (relevance × 0.2)
```

Memory sources do not use this enforcer. They are retrieved sparsely before routing when prior context materially matters.

## Activation Enforcer (Generic)

The activation enforcer operates on `ContextCandidate` objects:

1. Receive list of candidates from retrieval layer.
2. Compute priority for each candidate.
3. Sort by priority descending.
4. Apply gates:
   - Need gate: reject candidates with need < NEED_THRESHOLD.
   - Confidence gate: reject candidates with confidence < CONFIDENCE_THRESHOLD.
   - Hard cap: accept at most 2 specialist candidates total.
   - Cost budget: reject if cumulative cost exceeds MAX_PROMPT_TOKENS.
5. Return ordered list of accepted candidates.

## Hard Cap Scope

MAX_SPECIALISTS = 2 applies only to specialist bodies. It does not apply to `memory-management` preflight or handoff checkpointing. Memory has its own sparse retrieval budget defined in `skills/memory-management/SKILL.md`.

## Memory Separation

When memory retrieval is useful:

1. Run conditional memory preflight before broad exploration.
2. Retrieve only top relevant memory snippets.
3. Verify retrieved memory against current code/config/docs.
4. Continue sparse specialist routing independently.
5. Do not count `memory-management` toward primary/support specialist slots.

Example:
```
Memory preflight:
  decision: RUN
  retrieved: project convention, prior approval-flow checkpoint

Specialist candidates:
  [specialist] eloquent-patterns: need=0.72, confidence=0.65, cost=1500, priority=0.68
  [specialist] validation: need=0.45, confidence=0.50, cost=1200, priority=0.48

Activation decision:
  Activate: eloquent-patterns (specialist, primary)
  Reject: validation (below confidence threshold)
```

## V4.1 Implementation Scope

For V4.1, only the `specialist` source type is implemented in this enforcer. Memory is separate conditional infrastructure.
