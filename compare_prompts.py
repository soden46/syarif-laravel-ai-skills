import json
import os

cases = ['api-resource-conditional', 'laravel-12-collection-change', 'migration-add-column-production', 'form-request-conditional', 'queue-job-retry-backoff']

for case in cases:
    print(f'\n=== {case} ===')
    for version, base in [('V3', r'D:\ai-skill-eval-capability\benchmark-results\capability-v3-8b-judge20b\iteration-2'), ('V3.1', r'D:\ai-skill-eval-capability\benchmark-results\capability-v31-8b-judge20b\iteration-1')]:
        p_path = os.path.join(base, f'eval-{case}', 'with_skill', 'prompts.json')
        with open(p_path) as f:
            p = json.load(f)
        print(f'\n{version} SYSTEM (first 800 chars):')
        print(p.get('system','')[:800])
