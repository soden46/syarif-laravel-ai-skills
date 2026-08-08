import json
import os

def read_grading(base_path, iter_name, eval_id, skill_type='with_skill'):
    g_path = os.path.join(base_path, iter_name, f'eval-{eval_id}', skill_type, 'grading.json')
    if not os.path.exists(g_path):
        return {}
    with open(g_path) as f:
        return json.load(f)

def get_pass_rate(grading):
    summary = grading.get('summary', {})
    return summary.get('pass_rate', 0.0)

# V3 iterations
v3_base = r'D:\ai-skill-eval-capability\benchmark-results\capability-v3-8b-judge20b'
v3_iters = ['iteration-2', 'iteration-3', 'iteration-4']

# Experiment A iterations
a_base = r'D:\ai-skill-eval-capability\benchmark-results\ablation-A-v3router-v31specialists\runs'
a_iters = ['iteration-1', 'iteration-2', 'iteration-3']

# All 24 cases
eval_ids = [
    'action-vs-controller', 'api-pagination-filter', 'api-resource-conditional',
    'concurrent-race-condition', 'eloquent-many-to-many-attach', 'eloquent-polymorphic-relation',
    'feature-test-auth-flow', 'form-request-array-validation', 'form-request-conditional',
    'laravel-12-cast-change', 'laravel-12-collection-change', 'livewire-dependent-dropdowns',
    'livewire-search-state-reset', 'migration-add-column-production', 'migration-modify-column-production',
    'n-1-query-count-aggregate', 'n-1-query-with-constraints', 'pest-dataset-test',
    'policy-admin-user-access', 'queue-job-retry-backoff', 'queue-job-unique-failure',
    'security-mass-assignment', 'service-extract-reuse', 'transaction-rollback'
]

results = []

for eid in eval_ids:
    # V3 scores
    v3_ws_scores = []
    v3_base_scores = []
    for it in v3_iters:
        g_ws = read_grading(v3_base, it, eid, 'with_skill')
        g_base = read_grading(v3_base, it, eid, 'without_skill')
        v3_ws_scores.append(get_pass_rate(g_ws))
        v3_base_scores.append(get_pass_rate(g_base))
    
    # Experiment A scores
    a_ws_scores = []
    a_base_scores = []
    for it in a_iters:
        g_ws = read_grading(a_base, it, eid, 'with_skill')
        g_base = read_grading(a_base, it, eid, 'without_skill')
        a_ws_scores.append(get_pass_rate(g_ws))
        a_base_scores.append(get_pass_rate(g_base))
    
    v3_ws = sum(v3_ws_scores)/len(v3_ws_scores) if v3_ws_scores else 0.0
    v3_base = sum(v3_base_scores)/len(v3_base_scores) if v3_base_scores else 0.0
    a_ws = sum(a_ws_scores)/len(a_ws_scores) if a_ws_scores else 0.0
    a_base = sum(a_base_scores)/len(a_base_scores) if a_base_scores else 0.0
    
    delta = a_ws - v3_ws
    v3_adv = v3_ws - v3_base
    a_adv = a_ws - a_base
    adv_delta = a_adv - v3_adv
    
    results.append((eid, v3_ws, a_ws, delta, v3_base, a_base, v3_adv, a_adv, adv_delta))

# Print results
print('='*120)
print(f"{'Case':<35} {'V3 WS':>7} {'A WS':>7} {'Delta':>7} {'V3 Base':>8} {'A Base':>8} {'V3 Adv':>7} {'A Adv':>7} {'Adv D':>7}")
print('='*120)

v3_ws_total = 0.0
a_ws_total = 0.0
v3_base_total = 0.0
a_base_total = 0.0
v3_adv_total = 0.0
a_adv_total = 0.0

for eid, v3_ws, a_ws, delta, v3_base, a_base, v3_adv, a_adv, adv_delta in results:
    v3_ws_total += v3_ws
    a_ws_total += a_ws
    v3_base_total += v3_base
    a_base_total += a_base
    v3_adv_total += v3_adv
    a_adv_total += a_adv
    print(f"{eid:<35} {v3_ws:>7.3f} {a_ws:>7.3f} {delta:>+7.3f} {v3_base:>8.3f} {a_base:>8.3f} {v3_adv:>7.3f} {a_adv:>7.3f} {adv_delta:>+7.3f}")

print('='*120)
n = float(len(eval_ids))
print(f"\nAGGREGATE MEANS (n={len(eval_ids)}):")
print(f"  V3 with_skill:   {v3_ws_total/n:.3f}")
print(f"  A with_skill:    {a_ws_total/n:.3f}")
print(f"  V3 baseline:     {v3_base_total/n:.3f}")
print(f"  A baseline:      {a_base_total/n:.3f}")
print(f"  V3 advantage:    {v3_adv_total/n:.3f}")
print(f"  A advantage:     {a_adv_total/n:.3f}")
print(f"  Advantage delta: {a_adv_total/n - v3_adv_total/n:+.3f}")
