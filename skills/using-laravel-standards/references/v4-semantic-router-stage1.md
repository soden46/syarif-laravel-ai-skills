# V4 Semantic Router Stage 1: Domain Classification

## Purpose

Stage 1 classifies the task into a semantic family without exposing the full
72-specialist catalog. It produces a coarse-grained domain label that Stage 2
uses to select a shortlist of candidate specialists.

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| `task_description` | User request | Natural language description of the task |
| `stack_hints` | Project detection | Laravel version, packages, framework patterns |
| `memory_snippets` | Memory preflight | ≤3 relevant memory snippets (or empty) |
| `risk_level` | Risk classifier | LOW / MEDIUM / HIGH (controls verification depth only) |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `primary_family` | string | Selected semantic family or `"other"` |
| `secondary_family` | string \| null | Secondary family if cross-cutting is present |
| `family_confidence` | float | 0.0–1.0 |
| `cross_cutting_strength` | float | 0.0–1.0 |
| `reason` | string | Short rationale |

## Constraints

- Output ONLY the JSON object. No additional text.
- `primary_family` must be one of the published semantic families.
- `secondary_family` must be null or a different valid family.
- Do not expose the full specialist catalog in this stage.
- Do not force activation; classification is independent of knowledge need.

## Semantic Families

The stage 1 classifier must choose from the following families:

1. `validation`
2. `authorization_security`
3. `database_schema_migrations`
4. `database_transactions`
5. `eloquent_orm`
6. `query_performance`
7. `livewire`
8. `queues_jobs`
9. `architecture_refactoring`
10. `framework_compatibility`
11. `caching`
12. `frontend`
13. `testing`
14. `api`
15. `storage_filesystem`
16. `code_quality`
17. `planning_execution`
18. `memory_workflow`
19. `integrations`
20. `design_patterns`
21. `other`

## Cross-Cutting Strength Interpretation

| Range | Meaning |
|-------|---------|
| 0.0–0.2 | Single concern |
| 0.3–0.4 | Secondary concern exists but generic knowledge is enough |
| 0.5 | Meaningful secondary concern, specialist support may be optional |
| 0.6–0.7 | Two specialist domains materially contribute |
| 0.8–1.0 | Strong multi-domain dependency |
