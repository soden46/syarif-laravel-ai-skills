import json
import os

def read_grading(base_path, iter_name, eval_id, skill_type='with_skill'):
    g_path = os.path.join(base_path, iter_name, f'eval-{eval_id}', skill_type, 'grading.json')
    if not os.path.exists(g_path):
        print(f"  MISSING: {g_path}")
        return {}
    with open(g_path) as f:
        return json.load(f)

# Experiment A iterations
a_base = r'D:\ai-skill-eval-capability\benchmark-results\ablation-A-v3router-v31specialists\runs'
a_iters = ['iteration-1', 'iteration-2', 'iteration-3']

eval_ids = [
    'action-vs-controller', 'api-pagination-filter', 'api-resource-conditional',
]

for eval_id in eval_ids:
    for it in a_iters:
        print(f"\n=== {eval_id} {it} ===")
        g_ws = read_grading(a_base, it, eval_id, 'with_skill')
        g_base = read_grading(a_base, it, eval_id, 'without_skill')
        print(f"WS: {len(g_ws)} keys, Base: {len(g_base)} keys")
