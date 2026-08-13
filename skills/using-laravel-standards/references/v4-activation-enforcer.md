# V4 Activation Enforcer

## Purpose

The activation enforcer transforms router signals into concrete specialist
loading decisions. It enforces the hard cap, validates candidates, and manages
sequential loading.

Production routing uses family-gated sparse activation. See
`family-gated-sparse-routing.md` and `family-gated-sparse-routing.json` for the
frozen Candidate B behavior. The historical `flat_v4` / policy49 flow remains
available only for benchmark compatibility.

## Constants

```
MAX_SPECIALISTS = 2
MAX_PRIMARY = 1
MAX_SUPPORTING = 1
```

These are protocol constants. They are not calibration parameters.

## Responsibilities

1. Receive strict numeric router outputs: `primary_domain`, `knowledge_need`,
   `confidence`, `cross_cutting_signal`, `risk_level`, proposed specialists,
   and knowledge-need components.
2. Load production policy constants and family profiles from
   `family-gated-sparse-routing.json`.
3. Infer a task family from profile terms.
4. Suppress generic/self-contained tasks and excluded meta/infrastructure
   families.
5. Apply need and confidence gates.
6. Rank primary skills within the inferred family.
7. Apply the support-required signal and support compatibility matrix.
8. Enforce hard cap of 2 specialists.
9. Validate selected specialists against the catalog.
10. Deduplicate selections.
11. Return ordered list: [primary] or [primary, support].

## Decision Flow

```
1. Load production policy config.
2. IF normalized router output is unavailable:
     -> specialist_count = 0
     -> reason = "Invalid routing signal"
3. Infer task_family from family profiles.
4. IF task is generic OR task_family is excluded:
     -> specialist_count = 0
     -> reason = "Generic or excluded primary family"
5. Apply effective_need = raw_knowledge_need + risk_modifier.
6. IF effective_need < NEED_THRESHOLD:
     -> specialist_count = 0
     -> reason = "Need below threshold"
7. Rank primary skill inside task_family.
8. IF no primary rank OR confidence < CONFIDENCE_THRESHOLD:
     -> specialist_count = 0
     -> reason = "Confidence or primary rank failed"
9. Select primary.
10. IF support_required_signal < SUPPORT_SIGNAL_THRESHOLD:
      -> specialist_count = 1
      -> support = null
11. ELSE select the best compatible support family and support skill.
12. Return at most [primary, support].
```

## Hard Cap Enforcement

```
IF specialist_count > MAX_SPECIALISTS:
    raise ActivationError("Hard cap exceeded")
    # Fallback: load only the highest-priority specialist
    # Log the event for benchmark analysis
```

## Validation

Before loading any specialist:

1. Verify the specialist exists in the catalog.
2. Verify the specialist body file is present.
3. Deduplicate: if primary == support, load only one.
4. If support specialist is invalid, fall back to primary only.
5. If `memory-management` is proposed by a legacy router or family index, do
   not count it as a specialist. Run or reuse conditional memory preflight, then
   select the next valid procedural specialist or fall back to baseline.

## Sequential Loading Protocol

```
Step 1: Load primary specialist SKILL.md
Step 2: Execute with primary guidance
Step 3: Assess residual cross-cutting need
Step 4: If support-required signal >= SUPPORT_SIGNAL_THRESHOLD:
          Load compatible supporting specialist SKILL.md
Step 5: Execute with combined guidance
```

## Rationale Requirements

Every activation decision must include a brief rationale:

```
Mode 0: "Knowledge need below threshold. Domain is generic; baseline knowledge sufficient."
Mode 1: "Knowledge need and confidence above threshold. Primary specialist: eloquent-patterns."
Mode 2: "Primary selected and compatible support signal required. Primary: form-requests. Support: policies-and-authorization."
Mode 0 fallback: "Knowledge need above threshold but confidence below threshold. Routing clarity low; falling back to baseline."
```

## Token Budget Estimation

Before loading, estimate token cost:

```
SPECIALIST_TOKEN_ESTIMATES = {
    "architecture": 1800,
    "eloquent-patterns": 1500,
    "livewire-development": 2000,
    ...
}

def estimate_token_cost(specialists):
    baseline = 250
    specialist_tokens = sum(SPECIALIST_TOKEN_ESTIMATES.get(s, 1500) for s in specialists)
    return baseline + specialist_tokens

MAX_PROMPT_TOKENS = 5000

if estimate_token_cost(selected_specialists) > MAX_PROMPT_TOKENS:
    # Reduce to highest-priority specialists
    selected_specialists = selected_specialists[:1]
```

Exact token estimates per specialist body should be measured from actual
`SKILL.md` and `references/` sizes and stored in a lightweight catalog file.

## Logging

Every activation decision is logged for benchmark analysis:

```
{
  "task": "...",
  "task_family": "validation",
  "knowledge_need": 0.72,
  "confidence": 0.65,
  "support_required_signal": 7,
  "specialist_count": 2,
  "selected_specialists": ["form-requests", "policies-and-authorization"],
  "estimated_tokens": 2750,
  "reason": "...",
  "thresholds": {
    "need": 0.35,
    "confidence": 0.4,
    "support": 0.5,
    "support_signal": 7
  }
}
```
