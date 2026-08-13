# Candidate B Promotion Report

## Scope

This report records the promotion of frozen `candidate_b` routing into the
production Laravel skill routing instructions under the semantic name
`family_gated_sparse_routing`.

No benchmark cases, assertions, judges, specialist bodies, calibration suites,
heldout suites, token-efficiency results, or Candidate B source implementation
were modified for this promotion.

## Frozen Source Verification

Source directory:
`D:\ai-skill-eval-real-project\routing-calibration-v2`

Required Candidate B config SHA256:
`a94cfdf9a3290f0a6a63c4a578d96e2d7e4dfe89b7c9f019831354bb62ae978b`

Required Candidate B implementation SHA256:
`d419a8ea19009b37f223a3564b5b61007f2ff4df279e12c35c6e7ea07c5a1686`

Both hashes were recomputed before production edits and matched the required
frozen values.

## Audit

Previous production routing was the `flat_v4` / policy49-style sparse route:
direct specialist selection from router output with need, confidence, and
cross-cutting thresholds.

Promoted production routing keeps the frozen threshold family but changes the
selection logic to Candidate B behavior:

- infer a semantic task family from family profiles;
- suppress generic/self-contained and meta/infrastructure primary selection;
- rank primary specialists within the inferred family;
- require a support signal threshold before loading support;
- restrict support selection through the frozen compatibility matrix;
- preserve the hard cap of 0 to 2 specialists;
- keep `memory-management` outside specialist slot accounting.

## Validation Evidence To Preserve

Routing heldout evidence from `routing-heldout-v3`:

| mode | mode % | primary family % | primary skill % | support precision % | support recall % | overactivation % | avg specialists | utility | gate |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| policy49 | 68.1 | 58.3 | 56.9 | 45.2 | 100.0 | 34.7 | 1.208 | 0.706 | FAIL |
| candidate_b | 83.3 | 72.2 | 69.4 | 100.0 | 91.7 | 14.6 | 1.125 | 0.800 | PASS |

Capability evidence from `candidate-b-capability-v1`:

| mode | assertions | capability |
|---|---:|---:|
| baseline | 113 / 192 | 58.9% |
| policy49 | 110 / 192 | 57.3% |
| candidate_b | 112 / 192 | 58.3% |

Candidate B deltas: baseline `-0.5 pp`, policy49 `+1.0 pp`.
Promotion gate: `PASS`.

Token-efficiency evidence from `token-efficiency-candidate-b-v1-full`:

| mode | assertions | capability |
|---|---:|---:|
| baseline | 73 / 120 | 60.8% |
| load_all | 71 / 120 | 59.2% |
| policy49 / v4_sparse | 63 / 120 | 52.5% |
| candidate_b | 75 / 120 | 62.5% |

Candidate B token-efficiency gate: `CANDIDATE_B_TOKEN_EFFICIENCY_PASS=PASS`.

The legacy/global `TOKEN_EFFICIENCY_PASS=FAIL` belongs to an older/global
policy49 gate and is not a Candidate B failure.

## Production Files

Production routing entrypoint:
`skills/using-laravel-standards/SKILL.md`

Production routing reference:
`skills/using-laravel-standards/references/family-gated-sparse-routing.md`

Production routing frozen config:
`skills/using-laravel-standards/references/family-gated-sparse-routing.json`

Backward-compatible historical policy49 reference:
`skills/using-laravel-standards/references/v4-sparse-router.md`

## Versioning

Production semantic routing name:
`family_gated_sparse_routing`

Frozen Candidate B source ID:
`candidate_b_family_gated_support_compat`

Historical policy49 sparse mode:
`flat_v4`

Historical benchmark artifacts keep their original names.
