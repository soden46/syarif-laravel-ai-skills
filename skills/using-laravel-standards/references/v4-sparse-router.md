# V4 Sparse Router

## Role

The V4 sparse router is a **classifier only**. It does not inject implementation guidance, code, or detailed patterns. Its sole responsibility is to classify the task and produce signals that the activation enforcer uses to decide whether to load specialist bodies.

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| `task_description` | User request | Natural language description of the task |
| `stack_hints` | Project detection | Laravel version, packages, framework patterns |
| `memory_snippets` | Memory preflight | ≤3 relevant memory snippets (or empty) |
| `risk_level` | Risk classifier | LOW / MEDIUM / HIGH (controls verification depth only) |
| `domain_signals` | Router internal | Computed domain/framework specificity score |
| `invariant_signals` | Router internal | Computed non-obvious invariant requirement score |
| `cross_boundary_signals` | Router internal | Computed cross-boundary/domain complexity score |
| `generic_sufficiency_signals` | Router internal | Computed generic model sufficiency score |
| `clarity_signals` | Router internal | Computed routing clarity score |
| `completeness_signals` | Router internal | Computed task completeness score |
| `ambiguity_signals` | Router internal | Computed ambiguity/conflict score |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `primary_domain` | string | Selected primary specialist name or "baseline" |
| `knowledge_need` | float | 0.0 to 1.0 |
| `confidence` | float | 0.0 to 1.0 |
| `cross_cutting_signal` | object | `{strength: float, domain: string}` or null |
| `specialist_count` | int | 0, 1, or 2 |
| `reason` | string | Human-readable rationale for activation decision |

Numeric activation fields must be finite JSON numbers in the inclusive range `0.0` to `1.0`. Do not emit categorical labels such as `LOW`, `MEDIUM`, or `HIGH` for `knowledge_need`, `raw_knowledge_need`, `confidence`, `ambiguity`, `cross_cutting_signal.strength`, `specialist_marginal_value`, `invariant_requirement`, `domain_specificity`, `cross_boundary_complexity`, or `generic_sufficiency`.

## Responsibilities

The router MUST:
1. Classify the task domain and compute knowledge need/confidence scores.
2. Apply the need gate and confidence gate consistently.
3. Enforce the hard cap of 2 specialists.
4. Return a reason for transparency.

The router MUST NOT:
1. Inject implementation code or detailed patterns.
2. Load specialist bodies itself (the activation enforcer does this).
3. Make decisions based on benchmark case IDs.
4. Bypass the need gate for "important" tasks.
5. Exceed 2 specialists under any circumstance.

## Reasoning Transparency

The router must output its reasoning in a structured format that can be logged for benchmark analysis:

```
{
  "task": "...",
  "primary_domain": "queues",
  "knowledge_need": 0.72,
  "confidence": 0.65,
  "need_gate_passed": true,
  "confidence_gate_passed": true,
  "cross_cutting_signal": {"strength": 0.45, "domain": "validation"},
  "specialist_count": 1,
  "reason": "High domain specificity and invariant requirement for queue configuration. Confidence is moderate due to task completeness. Cross-cutting validation signal below support threshold.",
  "thresholds": {
    "need": 0.4,
    "confidence": 0.5,
    "support": 0.6
  }
}
```

## Threshold Loading

Thresholds are loaded from the benchmark workspace config (`D:\ai-skill-eval-real-project\v4\v4-thresholds.json` or equivalent runtime config). They are NOT hardcoded in this document or in routing logic. The V4 worktree does not contain benchmark result directories.
