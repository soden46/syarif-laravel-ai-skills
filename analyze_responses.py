import json
import os

cases = [
    'api-resource-conditional',
    'form-request-array-validation',
    'laravel-12-collection-change',
    'queue-job-retry-backoff',
    'service-extract-reuse',
    'transaction-rollback',
    'n-1-query-count-aggregate',
    'n-1-query-with-constraints',
    'policy-admin-user-access',
    'migration-add-column-production',
    'api-pagination-filter',
    'feature-test-auth-flow',
]

base_v3 = r'D:\ai-skill-eval-capability\benchmark-results\capability-v3-8b-judge20b'
base_v31 = r'D:\ai-skill-eval-capability\benchmark-results\capability-v31-8b-judge20b'

v3_iters = ['iteration-2', 'iteration-3', 'iteration-4']
v31_iters = ['iteration-1', 'iteration-2', 'iteration-3']

def read_json(path):
    with open(path) as f:
        return json.load(f)

for case in cases:
    print(f"\n{'='*60}")
    print(f"CASE: {case}")
    print('='*60)
    
    for version, base, iters in [('V3', base_v3, v3_iters), ('V3.1', base_v31, v31_iters)]:
        print(f"\n--- {version} ---")
        for iter_name in iters:
            prompt_path = os.path.join(base, iter_name, f'eval-{case}', 'with_skill', 'prompts.json')
            output_path = os.path.join(base, iter_name, f'eval-{case}', 'with_skill', 'outputs')
            grading_path = os.path.join(base, iter_name, f'eval-{case}', 'with_skill', 'grading.json')
            
            if not os.path.exists(prompt_path):
                continue
                
            prompts = read_json(prompt_path)
            grading = read_json(grading_path) if os.path.exists(grading_path) else {}
            
            # Read output file (usually a single text file)
            output_text = ''
            if os.path.exists(output_path):
                output_files = os.listdir(output_path)
                for out_file in output_files:
                    with open(os.path.join(output_path, out_file)) as f:
                        output_text = f.read()
                    break
            
            # Get score
            score = grading.get('score', 'N/A')
            passed = grading.get('passed', 'N/A')
            
            print(f"\n  {iter_name}:")
            print(f"    Score: {score}, Passed: {passed}")
            print(f"    Prompt (first 200 chars): {prompts[0]['content'][:200] if prompts else 'N/A'}")
            print(f"    Output (first 300 chars): {output_text[:300] if output_text else 'N/A'}")
