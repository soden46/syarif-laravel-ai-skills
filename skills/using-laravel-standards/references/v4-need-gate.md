# V4 Need Gate

## Purpose

The need gate decides whether specialist knowledge is likely to add material value to the current task. It uses only task-observable semantic signals. No benchmark-derived signals. No baseline gap. No historical accuracy.

## Signals

### Signal 1: Domain/Framework Specificity (weight: 0.4)

| Level | Score | Description |
|-------|-------|-------------|
| High | 0.8–1.0 | Task requires patterns that are domain-specific and non-obvious (e.g., Livewire state reset, queue atomic operations, authorization policy design). |
| Medium | 0.4–0.7 | Task benefits from domain patterns but generic Laravel knowledge provides a reasonable starting point (e.g., standard Eloquent queries, basic validation). |
| Low | 0.0–0.3 | Task is generic PHP/Laravel with no domain-specific patterns (e.g., string manipulation, array operations, simple refactoring). |

### Signal 2: Non-Obvious Invariant Requirement (weight: 0.3)

| Level | Score | Description |
|-------|-------|-------------|
| High | 0.8–1.0 | Task involves framework invariants, lifecycle hooks, or subtle contract requirements that are easy to violate without specialist knowledge (e.g., Livewire render lifecycle, queue job serialization, policy gate ordering). |
| Medium | 0.4–0.7 | Task involves framework conventions that improve correctness but are not strictly required (e.g., Eloquent accessor casting, route model binding edge cases). |
| Low | 0.0–0.3 | Task has no non-obvious framework invariants; standard patterns suffice. |

### Signal 3: Cross-Boundary/Domain Complexity (weight: 0.2)

| Level | Score | Description |
|-------|-------|-------------|
| High | 0.8–1.0 | Task spans multiple framework boundaries where interactions are non-trivial (e.g., "export report with authorization filter", "migration with security constraint"). |
| Medium | 0.4–0.7 | Task touches two domains but the interaction is straightforward (e.g., validation on a Livewire component). |
| Low | 0.0–0.3 | Task operates within a single domain with no cross-boundary concerns. |

### Signal 4: Generic Model Sufficiency (weight: 0.1)

| Level | Score | Description |
|-------|-------|-------------|
| High (sufficient) | 0.8–1.0 | A generic model can solve this task safely without specialist patterns. |
| Medium | 0.4–0.7 | Generic model provides a reasonable solution, but specialist patterns may improve quality. |
| Low (insufficient) | 0.0–0.3 | Generic model is likely to miss critical requirements; specialist knowledge is needed. |

## Computation

**Knowledge Need = (Domain/Framework Specificity × 0.4) + (Non-Obvious Invariant Requirement × 0.3) + (Cross-Boundary Complexity × 0.2) + ((1 − Generic Model Sufficiency) × 0.1)**

Result is normalized/clamped to **0.0–1.0**.

## Risk as Separate Axis

Risk (LOW / MEDIUM / HIGH) controls verification depth, not specialist activation:

- **LOW:** Minimal verification. No specialist activation unless knowledge need is high.
- **MEDIUM:** Targeted regression check. Specialist activation follows knowledge need gate.
- **HIGH:** Full regression surface + failure paths. Specialist activation follows knowledge need gate.

### Optional Risk Modifier

If risk is to influence knowledge need at all, it is a small additive modifier applied after the primary computation:

| Risk Level | Modifier |
|------------|----------|
| LOW | +0.00 |
| MEDIUM | +0.05 |
| HIGH | +0.10 |

**Rationale:** Higher risk increases the cost of a wrong implementation, which can justify the overhead of specialist activation even when knowledge need is borderline. The modifier is small and optional; it does not override the need gate.

**Final Knowledge Need (with optional modifier) = min(1.0, Knowledge Need + Risk Modifier)**

## Threshold

The need threshold is loaded from the benchmark workspace config (`D:\ai-skill-eval-real-project\v4\v4-thresholds.json` or equivalent runtime config). It is not hardcoded.

## Fallback

If knowledge need is below threshold, the activation enforcer selects 0 specialists. Baseline knowledge is used.
