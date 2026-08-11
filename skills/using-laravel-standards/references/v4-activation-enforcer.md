# V4 Activation Enforcer

## Purpose

The activation enforcer is the execution layer that transforms router signals into concrete specialist loading decisions. It enforces the hard cap, validates candidates, and manages sequential loading.

## Constants

```
MAX_SPECIALISTS = 2
MAX_PRIMARY = 1
MAX_SUPPORTING = 1
```

These are protocol constants. They are not calibration parameters.

## Responsibilities

1. Receive router outputs: primary_domain, knowledge_need, confidence, cross_cutting_signal.
2. Load threshold values from benchmark workspace config (`D:\ai-skill-eval-real-project\v4\v4-thresholds.json` or equivalent runtime config).
3. Apply need gate, confidence gate, and support gate.
4. Enforce hard cap of 2 specialists.
5. Validate selected specialists against the catalog.
6. Deduplicate selections.
7. Return ordered list: [primary] or [primary, support].

## Decision Flow

```
1. Load thresholds from config
2. IF knowledge_need < NEED_THRESHOLD:
     → specialist_count = 0
     → reason = "Need below threshold"
3. ELIF confidence < CONFIDENCE_THRESHOLD:
     → specialist_count = 0
     → reason = "Confidence below threshold"
4. ELIF cross_cutting_signal.strength >= SUPPORT_THRESHOLD:
     → specialist_count = 2
     → primary = primary_domain
     → support = cross_cutting_signal.domain
5. ELSE:
     → specialist_count = 1
     → primary = primary_domain
     → support = null
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

## Sequential Loading Protocol

```
Step 1: Load primary specialist SKILL.md
Step 2: Execute with primary guidance
Step 3: Assess residual cross-cutting need
Step 4: If cross-cutting signal strength >= SUPPORT_THRESHOLD:
          Load supporting specialist SKILL.md
Step 5: Execute with combined guidance
```

## Rationale Requirements

Every activation decision must include a brief rationale:

```
Mode 0: "Knowledge need below threshold (0.35 < TBD). Domain is generic; baseline knowledge sufficient."
Mode 1: "Knowledge need above threshold (0.65 >= TBD), confidence above threshold (0.70 >= TBD), no strong cross-cutting signal. Primary specialist: eloquent-patterns."
Mode 2: "Knowledge need above threshold (0.72 >= TBD), confidence above threshold (0.68 >= TBD), cross-cutting signal strong (0.75 >= TBD). Primary: queues, Support: validation."
Mode 0 fallback: "Knowledge need above threshold (0.55 >= TBD) but confidence below threshold (0.35 < TBD). Routing clarity low due to ambiguous domain overlap. Falling back to baseline."
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

Note: Exact token estimates per specialist body should be measured from actual SKILL.md + references/ sizes and stored in a lightweight catalog file.

## Logging

Every activation decision is logged for benchmark analysis:

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
  "selected_specialists": ["queues"],
  "estimated_tokens": 1750,
  "reason": "...",
  "thresholds": {
    "need": 0.4,
    "confidence": 0.5,
    "support": 0.6
  }
}
```
