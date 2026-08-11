# V4 Context Contract

## Purpose

Defines a lightweight, architecture-compatible abstraction for context candidates. This interface allows future expansion beyond specialist knowledge retrieval to include long-term memory retrieval, while keeping V4.1 focused on specialists only.

## ContextCandidate

```yaml
ContextCandidate:
  id: string                    # Unique identifier
  source_type: enum             # specialist | project_memory | workflow_memory | decision_memory | issue_fix_memory | cross_session
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
| project_memory | Reserved | Project-specific conventions and decisions |
| workflow_memory | Reserved | Standard workflows for recurring task types |
| decision_memory | Reserved | Prior decisions and their rationale |
| issue_fix_memory | Reserved | Prior bug fixes and root causes |
| cross_session | Reserved | Cross-session context recovery |

## Priority Computation

For V4.1, only `specialist` source types are produced. Priority is computed as:

```
priority = (need × 0.5) + (confidence × 0.3) + (relevance × 0.2)
```

Future memory sources use the same priority formula. The activation enforcer does not distinguish between source types when ordering candidates.

## Activation Enforcer (Generic)

The activation enforcer operates on `ContextCandidate` objects:

1. Receive list of candidates from retrieval layer.
2. Compute priority for each candidate.
3. Sort by priority descending.
4. Apply gates:
   - Need gate: reject candidates with need < NEED_THRESHOLD.
   - Confidence gate: reject candidates with confidence < CONFIDENCE_THRESHOLD.
   - Hard cap (specialists only): accept at most 2 specialist candidates total.
   - Cost budget: reject if cumulative cost exceeds MAX_PROMPT_TOKENS.
5. Return ordered list of accepted candidates.

## Hard Cap Scope

MAX_SPECIALISTS = 2 applies **only to specialist bodies**. It does not apply to future memory sources. Memory sources have their own budget limits defined in the memory layer.

## Future Extension

When memory retrieval is enabled:

1. Memory candidates are produced alongside specialist candidates.
2. Both types flow through the same activation enforcer.
3. Token budget is shared: memory snippets consume the same budget as specialist bodies.
4. Priority scoring applies uniformly.

Example with future memory:
```
ContextCandidates:
  [specialist] eloquent-patterns: need=0.72, confidence=0.65, cost=1500, priority=0.68
  [project_memory] convention: need=0.55, confidence=0.80, cost=200, priority=0.62
  [specialist] validation: need=0.45, confidence=0.50, cost=1200, priority=0.48

Activation decision:
  Activate: eloquent-patterns (specialist, primary)
  Activate: convention (project_memory, support context)
  Reject: validation (below confidence threshold)
```

## V4.1 Implementation Scope

For V4.1, only the `specialist` source type is implemented. The other source types are reserved for future integration and are not loaded or processed in V4.1.
