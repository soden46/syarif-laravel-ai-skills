import json
import os

def read_grading(base_path, iter_name, eval_id, skill_type='with_skill'):
    print(f"DEBUG: base_path={base_path!r}, iter_name={iter_name!r}, eval_id={eval_id!r}, skill_type={skill_type!r}")
    g_path = os.path.join(base_path, iter_name, f'eval-{eval_id}', skill_type, 'grading.json')
    print(f"DEBUG: g_path={g_path!r}")
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

for eval_id in eval_ids[:2]:
    for it in v3_iters:
        print(f"\n=== {eval_id} {it} ===")
        g_ws = read_grading(v3_base, it, eval_id, 'with_skill')
        print(f"Result: {g_ws}")
