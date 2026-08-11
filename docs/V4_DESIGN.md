# V4 Experimental Sparse Activation Design

**Status:** Design proposal for V4 worktree only.  
**Evidence basis:** Official V1 benchmark (216 unique grading records, 864 assertion decisions, 3 official runs).  
**Constraint:** Do not modify V3. Do not modify specialist skill bodies. Do not delete specialists. Do not tune to benchmark case IDs.

---

## 1. Problem Statement

Official V1 benchmark evidence:

| Metric | Value |
|--------|-------|
| baseline mean | 76.04% |
| router_only mean | 76.74% |
| full_framework mean | 76.04% |
| primary routing hit rate | 58.3% |
| average specialists loaded | 2.17 |
| net aggregate gain | +0.00% |
| stable full-framework wins | 6 of 24 |
| stable full-framework losses | 2 of 24 |

**Root diagnosis:** Overactivation. The current architecture loads specialists by default and averages 2.17 specialists per response. The net aggregate effect is zero, but variance is high. Specialist knowledge helps on specific task types and hurts on others. The router's primary hit rate (58.3%) means ~42% of requests receive a suboptimal specialist selection.

**V4 hypothesis:** Default to zero specialists. Activate specialists only when a confidence/need gate indicates material value. Cap at 2 specialists total. Load sequentially. Tighten token budget to materially below V3 average.

---

## 2. V4 Architecture

### 2.1 Design Principles

1. **Zero by default.** No specialist bodies are loaded unless the need gate fires.
2. **Conditional activation.** Three modes: 0 specialists, 1 primary specialist, or 1 primary + 1 supporting specialist.
3. **Hard cap.** Maximum 2 specialist bodies per task. No exceptions.
4. **Confidence/need gate.** Specialist activation requires both domain match AND need signal.
5. **Sequential loading.** Primary specialist loads first. Supporting specialist loads only after primary is assessed and a cross-cutting concern remains unresolved.
6. **Router as classifier.** The router classifies domain and need; it does not inject implementation guidance.
7. **Anti-overfit.** All rules are semantic and general. No benchmark case IDs. No 24-case suite encoding.
8. **Memory-compatible retrieval.** The same sparse retrieval primitives can later serve project memory, workflow memory, decision memory, issue/fix memory, and cross-session context recovery.
9. **Pareto token discipline.** Average context must be materially lower than V3 full_framework (~1,936 total tokens). Target average specialists loaded < 1.0.

### 2.2 Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│  USER REQUEST                                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 0: MEMORY PREFILIGHT (conditional)               │
│  - Sparse retrieval from project/workflow/decision memory│
│  - Returns ≤3 relevant memory snippets or empty          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: LEAST-CODE GATE                              │
│  - YAGNI, reuse, stdlib, native checks                  │
│  - If task is trivial, skip specialist activation        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: V4 SPARSE ROUTER                             │
│  Input: task description, stack hints, memory snippets   │
│  Output:                                               │
│    - domain classification (primary family)              │
│    - knowledge need score: 0.0 to 1.0                   │
│    - confidence: 0.0 to 1.0                             │
│    - cross-cutting signal (optional supporting domain)   │
│  Decision:                                             │
│    - need < threshold → 0 specialists                    │
│    - need ≥ threshold, confidence ≥ threshold → 1 primary│
│    - cross-cutting signal present → +1 supporting        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  ACTIVATION ENFORCER                                    │
│  - Enforces hard cap of 2 specialists                    │
│  - Validates selected specialists against catalog        │
│  - Deduplicates                                          │
│  - Returns ordered list: [primary] or [primary, support] │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  SEQUENTIAL LOADER                                     │
│  Step 1: Load primary specialist SKILL.md                │
│  Step 2: Execute with primary guidance                  │
│  Step 3: Assess residual cross-cutting need             │
│  Step 4: If cross-cutting signal strong, load support   │
│  Step 5: Execute with combined guidance                 │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: IMPLEMENTATION (with ≤2 specialist bodies)    │
│  - Assistant performs implementation                     │
│  - Specialist guidance is contextual, not prescriptive   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 4: VERIFICATION                                  │
│  - Proportional to risk and change surface               │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Live Observable Signals

All signals are derived from the task description and context available at inference time. No benchmark-derived signals. No baseline gap. No historical accuracy.

### 3.1 Knowledge Need Signals

**Signal 1: Domain/Framework Specificity (weight: 0.4)**
- High (0.8–1.0): Task requires patterns that are domain-specific and non-obvious.
- Medium (0.4–0.7): Task benefits from domain patterns but generic Laravel knowledge provides a reasonable starting point.
- Low (0.0–0.3): Task is generic PHP/Laravel with no domain-specific patterns.

**Signal 2: Non-Obvious Invariant Requirement (weight: 0.3)**
- High (0.8–1.0): Task involves framework invariants, lifecycle hooks, or subtle contract requirements that are easy to violate without specialist knowledge.
- Medium (0.4–0.7): Task involves framework conventions that improve correctness but are not strictly required.
- Low (0.0–0.3): Task has no non-obvious framework invariants; standard patterns suffice.

**Signal 3: Cross-Boundary/Domain Complexity (weight: 0.2)**
- High (0.8–1.0): Task spans multiple framework boundaries where interactions are non-trivial.
- Medium (0.4–0.7): Task touches two domains but the interaction is straightforward.
- Low (0.0–0.3): Task operates within a single domain with no cross-boundary concerns.

**Signal 4: Generic Model Sufficiency (weight: 0.1)**
- High (0.8–1.0): A generic model can solve this task safely without specialist patterns.
- Medium (0.4–0.7): Generic model provides a reasonable solution, but specialist patterns may improve quality.
- Low (0.0–0.3): Generic model is likely to miss critical requirements; specialist knowledge is needed.

**Knowledge Need = (Domain/Framework Specificity × 0.4) + (Non-Obvious Invariant Requirement × 0.3) + (Cross-Boundary Complexity × 0.2) + ((1 − Generic Model Sufficiency) × 0.1)**

Result is normalized/clamped to 0.0–1.0.

**Risk as Separate Axis:** Risk (LOW/MEDIUM/HIGH) controls verification depth only. It does not automatically force specialist activation. Optional small modifier: LOW +0.00, MEDIUM +0.05, HIGH +0.10.

### 3.2 Confidence Signals

**Signal 1: Routing Clarity (weight: W_CLARITY)**
- High: Primary domain is unambiguous.
- Medium: Primary domain is clear but has overlap with one other domain.
- Low: Multiple domains equally plausible.

**Signal 2: Task Completeness (weight: W_COMPLETENESS)**
- High: Request is well-specified with clear inputs, outputs, and constraints.
- Medium: Request is mostly clear but has minor ambiguities.
- Low: Request is vague, underspecified, or missing critical context.

**Signal 3: Ambiguity/Conflict Signals (weight: W_UNAMBIGUITY)**
- High (0.8–1.0): Conflicting requirements, contradictory constraints, or overlapping domain signals.
- Medium (0.4–0.7): Minor ambiguities or potential trade-offs.
- Low (0.0–0.3): Clear, consistent requirements with no detectable conflicts.

**Confidence = (Routing Clarity × W_CLARITY) + (Task Completeness × W_COMPLETENESS) + ((1 − Ambiguity/Conflict) × W_UNAMBIGUITY)**

Result is normalized/clamped to **0.0–1.0**.

**Monotonicity validation:**
- Same clarity/completeness + higher ambiguity → lower confidence (because 1−ambiguity decreases).
- High ambiguity never increases confidence.
- Confidence always remains within 0..1.

**Critical rule:** Confidence MUST decrease when ambiguity increases. The formula uses `(1 − ambiguity)` so higher ambiguity always reduces confidence.

### 3.3 Cross-Cutting Signal

Present when:
1. The task explicitly mentions multiple domains.
2. The primary specialist's guidance reveals a secondary concern that materially affects implementation.
3. The task involves a framework boundary where two domains interact.

**Strength:** Strong (0.8–1.0), Medium (0.4–0.7), Weak (0.0–0.3).

**Support activation:** IF strength ≥ SUPPORT_THRESHOLD AND primary specialist is already loaded.

---

## 4. Activation Decision Model

### 4.1 Decision Table

| Knowledge Need | Confidence | Cross-Cutting Signal | Action |
|----------------|------------|----------------------|--------|
| < NEED_THRESHOLD | any | any | 0 specialists |
| ≥ NEED_THRESHOLD | ≥ CONFIDENCE_THRESHOLD | < SUPPORT_THRESHOLD | 1 primary specialist |
| ≥ NEED_THRESHOLD | ≥ CONFIDENCE_THRESHOLD | ≥ SUPPORT_THRESHOLD | 1 primary + 1 supporting |
| ≥ NEED_THRESHOLD | < CONFIDENCE_THRESHOLD | any | 0 specialists (fallback) |

### 4.2 Fallback Rules

1. **Low confidence fallback:** Always fall back to 0 specialists. Do not load "just in case."
2. **Ambiguous domain fallback:** Reduce confidence if routing clarity is low. If confidence drops below threshold, fall back to 0 specialists.
3. **Hard cap enforcement:** Load only primary and strongest cross-cutting signal. Defer remaining concerns.

---

## 5. Threshold Calibration Plan

### 5.1 Calibration Parameters

Thresholds are calibration parameters, not established values.

| Parameter | Symbol | Initial Estimate | Range to Explore |
|-----------|--------|------------------|------------------|
| Need threshold | NEED_THRESHOLD | 0.40 | 0.30 – 0.60 |
| Confidence threshold | CONFIDENCE_THRESHOLD | 0.50 | 0.40 – 0.70 |
| Support threshold | SUPPORT_THRESHOLD | 0.60 | 0.50 – 0.80 |

**Storage:** Calibration parameters are stored in the benchmark workspace (`D:\ai-skill-eval-real-project\v4\v4-thresholds.json` or equivalent). They are NOT stored in the V4 worktree.

### 5.2 Suite Roles

V4 uses three distinct suites. They must not be conflated.

| Suite | Purpose | Used For | Used For Calibration? |
|-------|---------|----------|----------------------|
| **Regression suite** | Existing 24 cases. Compare V4 against V3 full_framework baseline. | Regression comparison, promotion gates | NO |
| **Calibration/development suite** | Expert-authored cases used to select weights, thresholds, and support threshold. | Threshold selection, weight tuning, ablation analysis | YES |
| **True held-out suite** | Unseen task types and families. Run only after V4 configuration is frozen. | Generalization validation, promotion gate | NO |

### 5.3 Calibration Protocol

1. Define parameter grid within ranges.
2. Run **calibration/development suite** for each setting.
3. Compute Pareto frontier: capability vs. token cost vs. activation rate.
4. Select optimal setting that maximizes capability while minimizing token cost and activation rate.
5. Freeze V4 configuration (weights, thresholds, support threshold).
6. Run **regression suite** to compare V4 against V3.
7. Run **true held-out suite** only after configuration is frozen to validate generalization.

### 5.4 Calibration Constraints

- No benchmark case IDs in routing logic.
- No retroactive tuning after held-out evaluation.
- Stability requirement: variance ≤ 0.05.
- Token discipline: average specialists loaded < 1.0, average total tokens < V3 full_framework.

---

## 6. 0/1/2 Specialist Policy

### 6.1 Mode 0: Zero Specialists

**When:** Knowledge need < NEED_THRESHOLD, OR need ≥ NEED_THRESHOLD but confidence < CONFIDENCE_THRESHOLD.

**Behavior:**
- No specialist SKILL.md files are loaded.
- Assistant uses baseline Laravel knowledge + generic guidance.
- Memory preflight may still provide context (if applicable).
- Least-code gate still applies.

**Token budget:** 200–400 prompt tokens, 150–300 completion tokens, **target total ≤ 600 tokens**

### 6.2 Mode 1: One Primary Specialist

**When:** Knowledge need ≥ NEED_THRESHOLD AND confidence ≥ CONFIDENCE_THRESHOLD AND no cross-cutting signal ≥ SUPPORT_THRESHOLD.

**Behavior:**
- Load exactly 1 specialist SKILL.md (primary).
- Specialist guidance is contextual, not prescriptive.
- No supporting specialist loaded.

**Token budget:** 1,200–2,000 prompt tokens, 200–400 completion tokens, **target total ≤ 2,400 tokens**

### 6.3 Mode 2: Primary + One Supporting Specialist

**When:** Knowledge need ≥ NEED_THRESHOLD AND confidence ≥ CONFIDENCE_THRESHOLD AND cross-cutting signal ≥ SUPPORT_THRESHOLD.

**Behavior:**
- Load primary specialist SKILL.md.
- Execute initial implementation with primary guidance.
- Load exactly 1 supporting specialist SKILL.md.
- Execute final implementation with combined guidance.
- Total specialists in context: exactly 2.

**Token budget:** 2,000–3,500 prompt tokens, 300–500 completion tokens, **target total ≤ 4,000 tokens**

### 6.4 Hard Cap Enforcement

```
MAX_SPECIALISTS = 2

if specialist_count > MAX_SPECIALISTS:
    raise ActivationError("Hard cap exceeded")
    # Fallback: load only the 2 highest-priority specialists
```

---

## 7. Token/Capability Pareto Goals

### 7.1 V3 Baseline Token Profile

| Mode | Avg Prompt Tokens | Avg Completion Tokens | Avg Total |
|------|-------------------|----------------------|-----------|
| without_skill | ~210 | ~121 | ~331 |
| router_only | ~448 | ~305 | ~616 |
| full_framework | ~2,298 | ~101 | ~1,936 |

### 7.2 V4.1 Pareto Targets

V4.1 must dominate V3 full_framework on the Pareto frontier: **equal or better capability at strictly lower token cost.**

| Mode | Target Prompt Tokens | Target Completion Tokens | Target Total | Capability Target |
|------|---------------------|-------------------------|--------------|-------------------|
| 0 specialists | 200–400 | 150–300 | **≤ 600** | ≥ 75% of V3 full_framework |
| 1 specialist | 1,200–2,000 | 200–400 | **≤ 2,400** | ≥ 85% of V3 full_framework |
| 2 specialists | 2,000–3,500 | 300–500 | **≤ 4,000** | ≥ 90% of V3 full_framework |
| **V4.1 average** | — | — | **≤ 1,800** | **≥ 76.04% (non-regression vs V3 baseline)** |

**Key constraint:** Average specialists loaded must be **< 1.0**.

### 7.3 Pareto Optimization Method

For each threshold setting during calibration:
1. Compute average total tokens.
2. Compute mean assertion score.
3. Plot (tokens, score) for each setting.
4. Select the setting on or near the Pareto frontier with average specialists loaded < 1.0.

---

## 8. V4 Ablation Design

### 8.1 Ablation Modes

| Mode | Description | What It Measures |
|------|-------------|------------------|
| `without_skill` | No specialist activation. Baseline only. | Baseline capability |
| `router_only` | Router runs but no specialists are loaded. | Router overhead / classification value |
| `primary_only` | Router activates exactly 1 primary specialist (no support). | Primary specialist value |
| `sparse_framework` | Full V4.1: 0/1/2 specialists with gates and sequential loading. | Full framework value |

### 8.2 Measurement Decomposition

1. **Router value** = `router_only` - `without_skill`
2. **Primary specialist value** = `primary_only` - `router_only`
3. **Support specialist incremental value** = `sparse_framework` - `primary_only`
4. **Full framework value** = `sparse_framework` - `without_skill`

---

## 9. Generic Context Activation Interface

### 9.1 ContextCandidate

```yaml
ContextCandidate:
  id: string                    # Unique identifier
  source_type: enum             # specialist | project_memory | workflow_memory | decision_memory | issue_fix_memory | cross_session
  domain: string                # Domain classification
  relevance: float              # 0.0–1.0, computed by retrieval layer
  need: float                   # 0.0–1.0, computed by router
  confidence: float             # 0.0–1.0, computed by router
  cost_estimate: int            # Estimated token cost to load
  priority: float               # Composite score for ordering
  activation_decision: enum     # activate | defer | reject
  rationale: string             # Human-readable explanation
```

### 9.2 Priority Computation

```
priority = (need × 0.5) + (confidence × 0.3) + (relevance × 0.2)
```

### 9.3 V4.1 Implementation Scope

Only `specialist` source type is implemented in V4.1. Other source types are reserved for future integration.

---

## 10. Memory Compatibility

### 10.1 Sparse Retrieval Primitives

| Memory Type | V4.1 Primitive | Future Use |
|-------------|----------------|------------|
| Project memory | `memory.auto --query "<task intent>" --limit 3` | Project-specific conventions |
| Workflow memory | `memory.auto --query "<workflow step>" --limit 2` | Standard workflows |
| Decision memory | `memory.auto --query "<decision context>" --limit 2` | Prior decisions |
| Issue/fix memory | `memory.auto --query "<bug pattern>" --limit 3` | Prior bug fixes |
| Cross-session context | `memory.auto --query "<project context>" --limit 3` | Cross-session recovery |

### 10.2 Activation Compatibility

Memory is Layer 0. It runs before the router and provides context snippets. The router can use memory snippets as additional signals. Activation is independent of memory source.

---

## 11. Experimental Worktree Plan

### 11.1 Isolation

V3 production remains byte-for-byte untouched. V4 changes are confined to the `v4-sparse-activation` branch/worktree.

### 11.2 Structure

```
D:\syarif-laravel-ai-skills\
  syarif-laravel-standards\          ← V3 production (main branch)
  syarif-laravel-standards-v4\       ← V4 experimental (v4-sparse-activation branch)
```

### 11.3 V4 File Changes (worktree only)

| File | Purpose |
|------|---------|
| `skills/using-laravel-standards/SKILL.md` | Updated entrypoint |
| `skills/using-laravel-standards/references/v4-sparse-router.md` | Router contract |
| `skills/using-laravel-standards/references/v4-need-gate.md` | Need score computation |
| `skills/using-laravel-standards/references/v4-confidence-gate.md` | Confidence score computation |
| `skills/using-laravel-standards/references/v4-activation-enforcer.md` | Sequential loading, hard cap, token budget |
| `skills/using-laravel-standards/references/v4-context-contract.md` | Generic context interface |
| `skills/least-code/SKILL.md` | V4 alignment |
| `docs/V4_DESIGN.md` | This document |
| `docs/V4_BENCHMARK_PLAN.md` | Benchmark protocol |

---

## 12. Promotion Gates

### 12.1 Capability Gate (Relative)

- Minimum: 100% of V3 full_framework (non-regression)
- Stretch: ≥ 104% of V3 full_framework

### 12.2 Stability Gate

- V4.1 target: ≤ 80% of V3 std dev

### 12.3 Routing Gate

- Minimum: 65.0% primary hit (vs. V3 58.3%)
- Stretch: 75.0%

### 12.4 Token Cost Gate (Pareto)

- V3 full_framework avg: ~1,936 tokens
- V4.1 target: ≤ 1,800 tokens average
- Stretch: ≤ 1,500 tokens average
- Additional constraint: average specialists loaded < 1.0

### 12.5 Specialist Activation Gate

- V3: 100% activation
- V4.1 minimum: ≤ 50% activation
- V4.1 stretch: ≤ 40% activation

### 12.6 Promotion Criteria

All gates must pass on BOTH regression suite and held-out suite. Promotion is via merge from `v4-sparse-activation` branch to `main`.

---

## 13. Anti-Overfit Rules

1. **Semantic, not enumerative.** Rules describe properties of tasks.
2. **Domain-agnostic thresholds.** Apply to all families equally.
3. **No benchmark case IDs.** No references to eval cases.
4. **No 24-case suite encoding.** Router must not memorize benchmark patterns.
5. **Testable on held-out data.** Every rule expressible as a testable predicate.

---

## 14. Risks / Open Questions

1. **Threshold sensitivity:** Pareto frontier may be flat. Use stability constraint as tiebreaker.
2. **Domain ambiguity:** Some tasks may belong to multiple domains. Current design falls back to 0 specialists; may be overly conservative.
3. **Token estimate accuracy:** Actual specialist body sizes may vary. Measure during calibration.
4. **Memory integration:** Adding memory may introduce priority inversion. Tune weights during integration phase.

---

## 15. Appendix: Evidence Mapping

| V4 Decision | Benchmark Evidence |
|-------------|-------------------|
| Default 0 specialists | Several cases need no specialist |
| Max 2 specialists | Average 2.17 specialists loaded; overactivation is main problem |
| Need gate (calibrated) | Router only mean (+0.69%) suggests marginal value |
| Confidence gate (calibrated) | Primary hit rate 58.3% means ~42% suboptimal |
| Support threshold (calibrated) | Only 3 cases show measurable multi-specialist benefit |
| Sequential loading | 2.17 average specialists suggests simultaneous loading is wasteful |
| Router as classifier | Router_only mean near baseline; adds little implementation value |
| Token budget reduction | V3 full_framework avg 1,936 tokens; V4 targets ≤1,800 |
| Held-out suite | 24-case suite too small for reliable threshold calibration |

---

*V4.1 design proposal. Experimental only. No production changes.*
