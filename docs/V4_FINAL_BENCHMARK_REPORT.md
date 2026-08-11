# V4 Final Benchmark Report

Status: FINAL_FREEZE_PREPARED
Date: 2026-08-11
Policy: policy_49

This report summarizes the final V4 evaluation evidence after the router and benchmark harness contract issues were corrected. V4 capability evaluation is complete. Do not use this report as a basis for further policy tuning on the same held-out suite.

## Final Conclusion

V4 policy_49 passes the final promotion gate.

- Canonical aggregate: V4 tied baseline and V3 at 114/288 each.
- Final held-out-new-v2: V4 scored 113/192, slightly above V3 at 112/192 and baseline at 107/192.
- The evidence supports non-inferiority on canonical and a small held-out advantage, not strong V4 superiority over V3.

## Frozen Implementation

- Policy: policy_49
- need_threshold: 0.35
- confidence_threshold: 0.4
- support_threshold: 0.5
- Activation architecture: sparse activation with mode0/mode1/mode2
- Maximum specialists loaded: primary plus support
- Router signal contract: numeric activation signals in [0.0, 1.0]
- Router structured output: strict Chat Completions JSON Schema
- Router retry: one schema-only format retry
- Selector behavior: unchanged
- Specialist bodies: 72 preserved
- Target max tokens: 16384
- Truncation retry: one retry at 32768
- Persistent runaway generation: explicit failure classification

## Historical And Confounded Runs

Earlier V4 development runs are diagnostic only. They must not be treated as final capability evidence because they included one or more confounders:

- Historical V4 activation had router-output/schema compatibility issues.
- The older canonical V4 run before normalization is INVALID_FOR_V4_CAPABILITY.
- heldout-new-v1 was consumed at the router gate and target capability evaluation was not executed.

These runs were useful for root-cause analysis and harness hardening, but final capability claims rely on the post-contract-fix canonical runs and heldout-new-v2 only.

## Calibration

Calibration selected policy_49 over policy_132 after a 3-run evaluation.

Frozen calibration inputs:

- Path: `D:\ai-skill-eval-real-project\v4\calibration\calibration-cases.json`
- SHA256: `f70fceb1baceb043d76dbd2113883487f1159147f25a1b609a34c485e4b3adcd`

Frozen selected policy:

- Path: `D:\ai-skill-eval-real-project\v4\calibration\results\v4-3-2-candidate-policies-1786281382572.json`
- Policy: policy_49
- Thresholds: need=0.35, confidence=0.4, support=0.5

## Canonical Regression

Canonical suite:

- Path: `D:\ai-skill-eval-real-project\evals\evals.json`
- Cases: 24
- Assertions: 96
- SHA256: `72e9ecc2b2be93289c62936cfe9c6c5459124e6af95930d75086a5ceaacb2617`

Fresh post-contract-fix canonical results:

| Run | Baseline | V3 full framework | V4 policy_49 |
| --- | ---: | ---: | ---: |
| Run1 | 38/96 | 37/96 | 39/96 |
| Run2 | 40/96 | 38/96 | 36/96 |
| Run3 | 36/96 | 39/96 | 39/96 |
| Aggregate | 114/288 | 114/288 | 114/288 |

Canonical aggregate conclusion: V4 is tied with baseline and V3 at 39.6%. This is a non-inferior/tied canonical result, not evidence of strong superiority.

## Final Held-Out Evaluation

heldout-new-v1:

- Status: CONSUMED_AT_ROUTER_GATE
- Capability evaluation: NOT_EXECUTED
- Reason: router_schema_gate_failure
- Path: `D:\ai-skill-eval-real-project\v4\heldout-new-v1\heldout-cases.json`
- SHA256: `f39adc79630b66ce9b8afc5ec2c1897888c1f3782c7aead0166674f1b3c600e6`

heldout-new-v2:

- Status: CONSUMED_FINAL_HELDOUT
- Path: `D:\ai-skill-eval-real-project\v4\heldout-new-v2\heldout-cases.json`
- Cases: 48
- Assertions: 192
- SHA256: `6f9284475e8a620f9016d8b192f11237a756dfd01765a4b129086f4de104e97c`

Final heldout-new-v2 scores:

| Mode | Score | Percent |
| --- | ---: | ---: |
| Baseline | 107/192 | 55.7% |
| V3 full framework | 112/192 | 58.3% |
| V4 policy_49 | 113/192 | 58.9% |

Held-out conclusion: V4 is slightly above V3 by 1 assertion and baseline by 6 assertions. This supports promotion gate PASS, with restrained language due to the small V4-over-V3 margin.

## Contract And Root-Cause Fixes

The following fixes are part of the frozen evidence chain:

- Target execution contract: baseline, V3, and V4 use the same Laravel/PHP target contract and model settings.
- Raw/stored identity: physical provider results are keyed by exact effective request SHA256 so reused results must match the same request body.
- Truncation handling: normal target max is 16384, with one length retry at 32768.
- Persistent generation failure: repeated runaway length failures are explicitly classified and not silently treated as normal responses.
- Checkpoint/resume: physical results are persisted incrementally and resumable.
- Semantic judge v2/adjudication: frozen semantic judge v2 plus adjudication is used for final scoring.
- Activation schema normalization: activation consumes normalized signal fields at a deterministic boundary.
- Numeric router producer contract: future router outputs must expose finite numeric activation signals in [0.0, 1.0].
- Strict JSON-schema structured output: V4 router calls use Chat Completions JSON Schema response_format, with categorical LOW/MEDIUM/HIGH rejected for activation numeric fields.

## Promotion Gate

PASS.

Rationale:

- Calibration selected policy_49 before final held-out use.
- Canonical aggregate tied baseline and V3.
- Final heldout-new-v2 is slightly above V3 and baseline.
- heldout-new-v2 is consumed and must not be reused for further tuning.
- No strong superiority claim is made.
