import json
import os

def read_grading(base_path, iter_name, eval_id, skill_type='with_skill'):
    print(f"TYPES: base_path={type(base_path)}, iter_name={type(iter_name)}, eval_id={type(eval_id)}, skill_type={type(skill_type)}")
    print(f"VALUES: base_path={base_path!r}, iter_name={iter_name!r}, eval_id={eval_id!r}, skill_type={skill_type!r}")
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

eval_ids = [
    'action-vs-controller', 'api-pagination-filter', 'api-resource-conditional',
]

for eid in eval_ids:
    for it in v3_iters:
        print(f"\n=== {eid} {it} ===")
        g_ws = read_grading(v3_base, it, eid, 'with_skill')
        print(f"Result: {get_pass_rate(g_ws)}")
