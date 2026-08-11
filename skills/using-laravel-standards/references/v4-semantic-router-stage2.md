# V4 Semantic Router Stage 2: Specialist Selection

## Purpose

Stage 2 receives the semantic family classification from Stage 1 and selects
the actual specialist names from a constrained shortlist. It never sees the
full 72-specialist catalog.

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| `primary_family` | Stage 1 | Semantic family from stage 1 |
| `secondary_family` | Stage 1 | Optional secondary family |
| `family_confidence` | float | Stage 1 confidence |
| `cross_cutting_strength` | float | Stage 1 cross-cutting signal |
| `task_description` | User request | Original task description |
| `candidate_specialists` | Family index | Shortlist of valid specialists for the family |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `proposed_primary_specialist` | string \| null | Selected primary specialist |
| `proposed_supporting_specialist` | string \| null | Selected supporting specialist |
| `specialist_confidence` | float | 0.0–1.0 |
| `reason` | string | Short rationale |

## Constraints

- Output ONLY the JSON object. No additional text.
- `proposed_primary_specialist` must be one of the `candidate_specialists`.
- `proposed_supporting_specialist` must be null or a different valid candidate.
- A support specialist must address a distinct concern from the primary.
- If `cross_cutting_strength` is low and `family_confidence` is high, prefer a single specialist.
- Do not invent specialist names outside the provided shortlist.

## Shortlist Construction

The shortlist is built from the family index:

- Primary candidates = all specialists in `primary_family`
- If `secondary_family` is present and `cross_cutting_strength >= 0.5`, add
  specialists from `secondary_family` as support candidates.
- Shortlist size target: 3–8 candidates.
