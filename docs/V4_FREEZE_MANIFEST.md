# V4 Freeze Manifest

Status: READY_FOR_COMMIT_PENDING_REVIEW
Date: 2026-08-11

## Repository State

- Production V3 path: `D:\syarif-laravel-ai-skills\syarif-laravel-standards`
- V4 worktree path: `D:\syarif-laravel-ai-skills\syarif-laravel-standards-v4`
- Benchmark path: `D:\ai-skill-eval-real-project`
- Branch: `v4-sparse-activation`
- Base HEAD observed during freeze prep: `6767a37901e2263b3750dc38118f04d3cc581535`
- Implementation commit SHA: PENDING_COMMIT
- Worktree status: dirty, freeze docs not committed

## Frozen Policy

- Policy name: policy_49
- need_threshold: 0.35
- confidence_threshold: 0.4
- support_threshold: 0.5

## Activation Rules

- Sparse activation modes: mode0, mode1, mode2
- mode0: no specialist context loaded
- mode1: primary specialist loaded
- mode2: primary specialist plus support specialist loaded
- Maximum specialists loaded: 2
- Selector behavior: unchanged
- Activation formulas: unchanged
- Specialist bodies: unchanged
- Specialist count: 72

## Router Schema Rules

- Router producer emits canonical numeric activation signals.
- Activation numeric fields must be finite JSON numbers in [0.0, 1.0].
- Numeric strings may be parsed only where legacy normalization explicitly supports them.
- Categorical labels such as LOW, MEDIUM, and HIGH are invalid for numeric activation fields.
- Malformed activation signals remain observable as schema violations.
- Activation engine requires validated normalized numeric schema.
- Structured output uses strict Chat Completions JSON Schema response_format.

## Retry Policies

- Router retry: one schema-only router format retry using the same task and model.
- Router retry scope: correct output schema only, not target capability.
- Target normal max tokens: 16384
- Target truncation retry: one retry at 32768
- Persistent runaway generation: explicit failure classification
- Checkpoint/resume: enabled
- SHA256 exact effective provider request dedup: enabled

## Benchmark Suites

Calibration:

- Path: `D:\ai-skill-eval-real-project\v4\calibration\calibration-cases.json`
- SHA256: `f70fceb1baceb043d76dbd2113883487f1159147f25a1b609a34c485e4b3adcd`
- Status: consumed for policy selection
- Result: policy_49 selected over policy_132 after 3-run evaluation

Canonical:

- Path: `D:\ai-skill-eval-real-project\evals\evals.json`
- SHA256: `72e9ecc2b2be93289c62936cfe9c6c5459124e6af95930d75086a5ceaacb2617`
- Status: consumed canonical regression
- Aggregate result: baseline=114/288, V3=114/288, V4=114/288

heldout-new-v1:

- Path: `D:\ai-skill-eval-real-project\v4\heldout-new-v1\heldout-cases.json`
- SHA256: `f39adc79630b66ce9b8afc5ec2c1897888c1f3782c7aead0166674f1b3c600e6`
- Status: CONSUMED_AT_ROUTER_GATE
- Capability evaluation: NOT_EXECUTED
- Reason: router_schema_gate_failure

Router structured-output synthetic contract:

- Path: `D:\ai-skill-eval-real-project\v4\router-contract-live\router-contract-cases.json`
- SHA256: `939fbf8f072b25cd9416fddefba67ec316678b77418f54f74a89ffe1323f260b`
- Status: router contract smoke only, not capability evaluation
- Result: provider JSON Schema support verified, 8/8 valid first attempt, 0 retries, 0 schema failures

heldout-new-v2:

- Path: `D:\ai-skill-eval-real-project\v4\heldout-new-v2\heldout-cases.json`
- SHA256: `6f9284475e8a620f9016d8b192f11237a756dfd01765a4b129086f4de104e97c`
- Status: CONSUMED_FINAL_HELDOUT
- Cases: 48
- Assertions: 192
- Final result: baseline=107/192, V3=112/192, V4=113/192

## Final Evidence Summary

Canonical post-contract-fix aggregate:

- Baseline: 114/288 = 39.6%
- V3 full framework: 114/288 = 39.6%
- V4 policy_49: 114/288 = 39.6%

Final heldout-new-v2:

- Baseline: 107/192 = 55.7%
- V3 full framework: 112/192 = 58.3%
- V4 policy_49: 113/192 = 58.9%

## Promotion Gate

PASS.

Interpretation:

- Canonical aggregate is non-inferior/tied.
- Held-out V4 is slightly above V3.
- No strong V4 superiority claim is made.
- Do not tune policy_49 further using heldout-new-v2.

## Freeze Actions Not Performed

- No commit created.
- No tag created.
- No merge to production V3.
- No provider calls.
- No judge calls.
- No benchmark reruns.
