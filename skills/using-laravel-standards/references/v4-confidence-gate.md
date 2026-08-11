# V4 Confidence Gate

## Purpose

The confidence gate decides whether the router's classification is reliable enough to justify specialist activation. It uses only task-observable semantic signals. No historical accuracy. No benchmark-derived calibration.

## Signals

### Signal 1: Routing Clarity (weight: W_CLARITY)

| Level | Score | Description |
|-------|-------|-------------|
| High | 0.8–1.0 | Primary domain is unambiguous (single, clear match). |
| Medium | 0.4–0.7 | Primary domain is clear but has overlap with one other domain. |
| Low | 0.0–0.3 | Multiple domains equally plausible; routing is uncertain. |

### Signal 2: Task Completeness (weight: W_COMPLETENESS)

| Level | Score | Description |
|-------|-------|-------------|
| High | 0.8–1.0 | Request is well-specified with clear inputs, outputs, and constraints. |
| Medium | 0.4–0.7 | Request is mostly clear but has minor ambiguities. |
| Low | 0.0–0.3 | Request is vague, underspecified, or missing critical context. |

### Signal 3: Ambiguity/Conflict Signals (weight: W_UNAMBIGUITY)

| Level | Score | Description |
|-------|-------|-------------|
| High | 0.8–1.0 | Conflicting requirements, contradictory constraints, or overlapping domain signals that make selection uncertain. |
| Medium | 0.4–0.7 | Minor ambiguities or potential trade-offs that could affect specialist selection. |
| Low | 0.0–0.3 | Clear, consistent requirements with no detectable conflicts. |

## Computation

**Confidence = (Routing Clarity × W_CLARITY) + (Task Completeness × W_COMPLETENESS) + ((1 − Ambiguity/Conflict) × W_UNAMBIGUITY)**

Result is normalized/clamped to **0.0–1.0**.

## Monotonicity Validation

The following cases prove the formula is explicitly monotonic-safe:

**Case A: Same clarity/completeness, increasing ambiguity**
- Clarity = 0.8, Completeness = 0.8, Ambiguity = 0.2
- Confidence = (0.8 × W_CLARITY) + (0.8 × W_COMPLETENESS) + (0.8 × W_UNAMBIGUITY)
- Clarity = 0.8, Completeness = 0.8, Ambiguity = 0.8
- Confidence = (0.8 × W_CLARITY) + (0.8 × W_COMPLETENESS) + (0.2 × W_UNAMBIGUITY)
- **Result:** Higher ambiguity strictly decreases confidence because (1 − ambiguity) decreases.

**Case B: High ambiguity cannot increase confidence**
- Clarity = 0.2, Completeness = 0.2, Ambiguity = 0.9
- Confidence = (0.2 × W_CLARITY) + (0.2 × W_COMPLETENESS) + (0.1 × W_UNAMBIGUITY)
- Even with low clarity/completeness, high ambiguity produces a low confidence term (0.1 × W_UNAMBIGUITY), not a high one.
- **Result:** Confidence always remains within 0..1 and decreases with ambiguity.

**Case C: Zero ambiguity maximizes the unambiguity term**
- Clarity = 0.5, Completeness = 0.5, Ambiguity = 0.0
- Confidence = (0.5 × W_CLARITY) + (0.5 × W_COMPLETENESS) + (1.0 × W_UNAMBIGUITY)
- **Result:** Maximum possible contribution from the unambiguity term.

## Critical Rule: Ambiguity Direction

Confidence MUST decrease when ambiguity/conflict increases. The formula uses `(1 − ambiguity)` so higher ambiguity always reduces confidence. Do NOT use a formula where high ambiguity increases confidence.

## Threshold

The confidence threshold is loaded from the benchmark workspace config. It is not hardcoded.

## Fallback

If confidence is below threshold, the activation enforcer selects 0 specialists even if knowledge need is high. This avoids loading a specialist when the router is uncertain about the domain classification.
