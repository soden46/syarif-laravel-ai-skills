# Least Code Details

Detailed guidance for `least-code`. Load only when needed.

## Risk classification

- **LOW**: typo, Blade text, CSS kecil, rename lokal.
- **MEDIUM**: validation, query, Livewire state, controller/service refactor, non-destructive action.
- **HIGH**: migration, auth, permission, payroll, financial calculation, concurrency, destructive action, data-shape change.

## Behavior preservation

Identify preservation constraints before editing. Expose in user-visible output only when useful for handoff or HIGH-risk work. For LOW tasks, honor constraints silently.

Preserve:
- input/output contract
- authorization boundary
- side effects and events
- response shape and redirects
- existing tests that are not explicitly obsolete

## Least-code vs least-risk

Smallest code is not always safest. Prefer the smallest change that preserves existing contracts and minimizes regression risk.

Rule:
- Reuse only when semantics match, not merely because code looks similar.
- A slightly longer existing abstraction is better than a clever one-liner that breaks an implicit contract.
- Mark deliberate simplifications that cut a real corner with a `least-code:` comment naming the ceiling and upgrade path.

## Change surface budget

Prefer, in order:
1. existing line/local expression
2. existing method
3. existing class/component
4. existing module boundary
5. new abstraction/file only when justified

Escalate the change surface only when the lower level cannot solve the root cause safely.

## Root-cause workflow

```
symptom
  → entrypoint
    → state/data flow
      → implementation
        → callers
          → persistence
            → rendering/output
```

For Laravel/Livewire specifically:
```
route
  → component/controller
    → validation
      → service/model
        → DB
          → event/job
            → response/view
```

### Root-cause confidence

After tracing, classify confidence before patching:

- **CONFIRMED** — Evidence directly proves root cause.
- **LIKELY** — Evidence strongly suggests root cause but reproduction/test is incomplete.
- **UNKNOWN** — Insufficient evidence; do not perform speculative invasive fixes.

Never state "root cause is X" when confidence is LIKELY or UNKNOWN.

## Stop condition

Stop exploration once the execution path, affected callers, contract, and verification surface are sufficiently understood.

Do not grep the entire repository to feel safe. Trace the real call graph and the real data flow. If the change touches 3 files and you understand why, stop.

## Test creation rules

Do not add tests mechanically.

Add or update a regression test when:
- fixing a reproducible bug;
- changing business-critical behavior;
- changing authorization or validation boundaries;
- the affected behavior is not already adequately covered.

Prefer extending the nearest existing test over creating a new test structure.

## Anti-pattern: false reuse

Reuse only when semantics match, not merely because code looks similar.

Bad:
- Reusing a payroll helper for reimbursement just because both involve money math.
- Reusing a filter scope for an admin report just because both filter by date.

Good:
- Reusing a session-persisted filter helper when the new feature explicitly uses session state.
- Reusing a notification channel when the delivery contract is identical.

## Overengineering control

Before creating any new file, class, service, repository, DTO, Form Request, middleware, helper, trait, abstraction, or dependency:
- determine whether the existing execution path can solve the task safely
- if yes, reuse it
- if no, create only the smallest justified abstraction

Semantic necessity matters more than LOC.

## Output

Routine task: maksimal 3-5 baris.
Complex/debug/high-risk: boleh lebih panjang.
Selalu prioritaskan:
- changed
- verified
- remaining risk

Pattern:
```
Fixed filter persistence in PaymentTable.
Reused existing session-state pattern; no new abstraction.
Verified search -> payment -> reload flow and unauthorized path.
```

If the explanation is longer than the code, delete the explanation. Every paragraph defending a simplification is complexity smuggled back in as prose. Explanation the user explicitly asked for is not debt.
