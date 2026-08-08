import json

with open(r'D:\ai-skill-eval-capability\skills\laravel-ai-skills\evals\evals.json') as f:
    data = json.load(f)

print('Total evals:', len(data['evals']))
print()
for eval_item in data['evals']:
    print(f"{eval_item['id']}: {eval_item['name']}")
