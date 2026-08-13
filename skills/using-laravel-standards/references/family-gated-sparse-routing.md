# Family-Gated Sparse Routing

## Status

This is the production routing policy for `using-laravel-standards`.

Frozen source policy: `candidate_b_family_gated_support_compat`

Semantic production name: `family_gated_sparse_routing`

The source Candidate B config and implementation are frozen in
`D:\ai-skill-eval-real-project\routing-calibration-v2`. Production must preserve
the same routing behavior under a stable semantic name.

## Policy Constants

Configured in `family-gated-sparse-routing.json`.

```
need_threshold = 0.35
confidence_threshold = 0.4
support_threshold = 0.5
support_signal_threshold = 7
MAX_SPECIALISTS = 2
```

Risk modifiers:

```
LOW = 0.05
MEDIUM = 0.10
HIGH = 0.15
```

## Router Contract

The upstream router must return strict numeric JSON activation signals:

- `primary_domain`
- `knowledge_need`
- `confidence`
- `ambiguity`
- `cross_cutting_signal.strength`
- `cross_cutting_signal.domain`
- `risk_level`
- `proposed_primary_specialist`
- `proposed_supporting_specialist`
- `raw_knowledge_need`
- `knowledge_need_components`
- `reason`

Numeric activation fields must be finite numbers in `[0.0, 1.0]`. Invalid or
schema-drifted router output is retried by the caller's schema retry contract.
If no valid normalized router signal is available, fall back to mode 0.

## Decision Flow

1. Run the least-code gate. Trivial, self-contained, reuse-only, and ordinary
   PHP tasks should skip specialist activation.
2. Infer a task family from production family profiles.
3. Suppress mode 0 when the task is generic/self-contained or the inferred
   family is excluded for primary routing.
4. Add the risk modifier to raw knowledge need and apply the need threshold.
5. Rank skills inside the inferred family and exclude meta/infrastructure
   specialists from primary selection.
6. Apply the confidence threshold.
7. Select one primary specialist when the family, skill rank, need, and
   confidence gates all pass.
8. Compute the support-required signal from cross-cutting strength, specialist
   marginal value, explicit markers, raw support proposal, and family ambiguity.
9. Select one support specialist only from families compatible with the primary
   family and only when the support-required score reaches the frozen threshold.
10. Deduplicate and hard-cap selected specialists at two.

## Memory Boundary

`memory-management` is infrastructure, not a specialist. It can run as a
conditional preflight/checkpoint flow, but it must not consume primary/support
slots and must never be selected as a production primary specialist.

## Historical Naming

`flat_v4` remains the historical policy49 sparse routing label for benchmark
compatibility. Do not silently rename old benchmark artifacts. New production
routing should use `family_gated_sparse_routing`.
