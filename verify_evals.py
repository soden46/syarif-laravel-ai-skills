import json

with open(r'D:\ai-skill-eval-capability\skills\laravel-ai-skills\evals\evals.json') as f:
    original = json.load(f)

with open(r'D:\ai-skill-eval-capability\benchmark-results\ablation-A-v3router-v31specialists\skills\laravel-ai-skills\evals\evals.json') as f:
    ablation = json.load(f)

if original == ablation:
    print('Assertions: UNCHANGED (evals.json identical)')
else:
    print('Assertions: CHANGED')
    for i, (o, a) in enumerate(zip(original['evals'], ablation['evals'])):
        if o != a:
            cid = o['id']
            print(f'  Difference in eval {i}: {cid}')
