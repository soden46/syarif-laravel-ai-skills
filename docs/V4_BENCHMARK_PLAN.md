# V4 Benchmark Plan

**Status:** Experimental plan for V4 worktree.  
**Benchmark workspace:** `D:\ai-skill-eval-real-project`  
**Constraint:** Do not create benchmark result directories inside the V4 worktree.

---

## 1. Benchmark Workspace Structure

All benchmark artifacts remain under `D:\ai-skill-eval-real-project`:

```
D:\ai-skill-eval-real-project\
  benchmark-results\
    official-v1\          ← V1 results (frozen baseline)
    v4-experimental\      ← V4 experiment results
  evals\
    evals.json            ← Eval cases
  docs\
    specialist-catalog.json
  benchmark\
    v4-thresholds.json    ← Calibrated thresholds (populated after calibration)
    v4-ablation-plan.md   ← Ablation specification
    v4-heldout-suite.md   ← Held-out suite definition
```

---

## 2. V4 Regression Suite

### 2.1 Purpose

Ensure V4 does not regress on known task types.

### 2.2 Protocol

1. Run the 24-case benchmark suite 3 times with V4 sparse activation.
2. Compare against V3 full_framework baseline (76.04% mean, ~1,936 avg tokens).
3. Record all metrics per mode per case.

### 2.3 Ablation Modes

V4 benchmark must compare four modes:

| Mode | Description | What It Measures |
|------|-------------|------------------|
| `without_skill` | No specialist activation. Baseline only. | Baseline capability |
| `router_only` | Router runs but no specialists are loaded. | Router overhead / classification value |
| `primary_only` | Router activates exactly 1 primary specialist (no support). | Primary specialist value |
| `sparse_framework` | Full V4.1: 0/1/2 specialists with gates and sequential loading. | Full framework value |

### 2.4 Measurement Decomposition

For each ablation mode:

1. **Router value** = `router_only` - `without_skill`
2. **Primary specialist value** = `primary_only` - `router_only`
3. **Support specialist incremental value** = `sparse_framework` - `primary_only`
4. **Full framework value** = `sparse_framework` - `without_skill`

### 2.5 Logged Data Per Response

- `mode`
- `router.primary_domain`
- `router.knowledge_need`
- `router.confidence`
- `router.cross_cutting_signal`
- `activation.specialist_count`
- `activation.selected_specialists`
- `activation.gate_decisions` (need_gate, confidence_gate, support_gate)
- `tokens.prompt`, `tokens.completion`, `tokens.total`
- `score`, `passed_count`, `total_assertions`
- `estimated_tokens` (pre-activation estimate)

---

## 3. Calibration / Development Suite

### 3.1 Purpose

Select weights, thresholds, and support threshold for V4 activation. This suite is used exclusively for development and calibration. It is NOT the same as the regression suite or the true held-out suite.

### 3.2 Composition

| Category | Count | Description |
|----------|-------|-------------|
| Expert-authored cases | 30–40 cases | Covers all 12 existing families plus new families |
| Risk distribution | 40% LOW, 40% MEDIUM, 20% HIGH | Matches expected production distribution |

### 3.3 Usage

- Used to sweep threshold parameters and select optimal settings.
- Used to validate router classification quality.
- Used to tune ablation modes.
- **Never used for final promotion gates.** Final gates use regression suite + true held-out suite only.

---

## 4. True Held-Out Suite

### 4.1 Purpose

Test generalization to unseen task types and prevent overfit to the calibration/development suite.

### 4.2 Coverage Requirements

Minimum **3 cases per family** for all 12 existing families, plus coverage for new families.

### 4.3 Suite Composition

| Category | Count | Description |
|----------|-------|-------------|
| Existing families (12) | 36 cases | 3 cases per family, new task descriptions |
| New families | 12 cases | 3–4 cases per new family, expert-authored |
| **Total** | **48 cases** |

### 4.4 Risk Distribution

| Risk Level | Count | Percentage |
|------------|-------|------------|
| LOW | 19 | 40% |
| MEDIUM | 19 | 40% |
| HIGH | 10 | 20% |

### 4.5 New Family Selection

Candidate domains:
- API design and versioning
- Caching strategies
- Mail and notifications
- File storage and uploads
- Testing infrastructure

Select 3–4 new families based on project needs.

### 4.6 Case Creation Protocol

1. Expert-authored, not LLM-generated.
2. 4 assertions per case.
3. No overlap with regression suite or calibration suite.
4. No benchmark case IDs in descriptions.
5. **Never used for threshold calibration or router training.** Run only after V4 configuration is frozen.

---

## 5. Threshold Calibration

### 5.1 Parameter Grid

| Parameter | Range |
|-----------|-------|
| NEED_THRESHOLD | 0.30 – 0.60 |
| CONFIDENCE_THRESHOLD | 0.40 – 0.70 |
| SUPPORT_THRESHOLD | 0.50 – 0.80 |

### 5.2 Calibration Protocol

1. Test all combinations within the grid.
2. Run **calibration/development suite** 3 times per setting.
3. Compute Pareto frontier: capability vs. token cost vs. activation rate.
4. Select optimal setting with average specialists loaded < 1.0.
5. Freeze V4 configuration.
6. Run regression suite and true held-out suite for final validation.

### 5.3 Storage

Final thresholds stored in `D:\ai-skill-eval-real-project\v4\v4-thresholds.json`. Not stored in V4 worktree.

---

## 5. Promotion Gates

### 5.1 Capability Gate (Relative)

- Minimum: 100% of V3 full_framework (non-regression)
- Stretch: ≥ 104% of V3 full_framework

### 5.2 Stability Gate

- V4 target: ≤ 80% of V3 std dev

### 5.3 Routing Gate

- Minimum: 65.0% primary hit (vs. V3 58.3%)
- Stretch: 75.0%

### 5.4 Token Cost Gate (Pareto)

- V3 full_framework avg: ~1,936 tokens
- V4 target: ≤ 1,800 tokens average
- Stretch: ≤ 1,500 tokens average
- Additional: average specialists loaded < 1.0

### 5.5 Specialist Activation Gate

- V3: 100% activation
- V4 minimum: ≤ 50% activation
- V4 stretch: ≤ 40% activation

### 5.6 Ablation Gate

- `primary_only` must outperform `router_only` on ≥ 50% of activated cases.
- `sparse_framework` must outperform `primary_only` on < 30% of cases.
- No systematic regression vs. V3 full_framework without rationale.

### 5.7 Promotion Criteria

All gates must pass on BOTH regression suite and held-out suite. Promotion is via merge from `v4-sparse-activation` branch to `main`.

---

## 6. Execution Protocol

```
For each run:
  1. Shuffle case order
  2. For each case:
     a. Router classifies task → primary_domain, knowledge_need, confidence, cross_cutting_signal
     b. Activation enforcer applies gates → specialist_count, selected_specialists
     c. Load specialists sequentially (max 2)
     d. Execute task with available guidance
     e. Grade response against assertions
     f. Log: router_output, specialists_loaded, token_usage, score
  3. Compute aggregate metrics
  4. Repeat for 3 runs
```

---

## 7. Path References

All benchmark artifacts are under `D:\ai-skill-eval-real-project`. The V4 worktree does not contain benchmark result directories.
