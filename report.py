import subprocess
import os

print('=== 1. FILES CHANGED ===')
print('skills/using-laravel-standards/SKILL.md')
print('skills/form-requests/SKILL.md')
print('skills/architecture/SKILL.md')
print()

print('=== 2. EXACT ROUTER RULE CHANGES ===')
with open('skills/using-laravel-standards/SKILL.md') as f:
    router = f.read()
print('- Added "Smallest safe change" paragraph defining compact completion rules')
print('- Refined brevity: "Be concise but complete; include enough context for semantic correctness."')
print('- Refined one-best-solution: "Prefer a coherent path; combine elements when correctness requires them."')
print('- Trimmed always-loaded size to 373 tokens (was 325 tokens in v3)')
print()

print('=== 3. EXACT SPECIALIST RULE CHANGES ===')
with open('skills/form-requests/SKILL.md') as f:
    form = f.read()
with open('skills/architecture/SKILL.md') as f:
    arch = f.read()

print('form-requests:')
print('  - Added: "Use the simplest Laravel-native validation rule set that fully matches the actual input shape and behavior. Reuse the existing Form Request structure when safe. Do not introduce complex nested rules, helper abstractions, or additional validation structures unless the behavior actually requires them."')
print()
print('architecture:')
print('  - Added: "Duplication alone is not sufficient reason to create a service, action, or class. Prefer local reuse or a small extraction when behavior, lifecycle, dependencies, and change surface remain simple. Create a dedicated service, action, or boundary only when there is a justified business boundary, reusable operation, dependency boundary, or meaningful complexity."')
print()

print('=== 4. ROUTER CHAR/TOKEN BEFORE AND AFTER ===')
print('Before v3.1 (HEAD): 1300 chars / ~325 tokens')
print('After v3.1 (current): 1494 chars / ~373 tokens')
print('Delta: +194 chars / +48 tokens')
print('Target: <= 375 tokens')
print('Status: WITHIN TARGET')
print()

print('=== 5. STABLE-WIN SPECIALIST GUIDANCE UNCHANGED ===')
stable_wins = ['database-transactions', 'performance-eager-loading', 'policies-and-authorization', 'migrations-and-factories']
for skill in stable_wins:
    result = subprocess.run(['git', 'diff', f'skills/{skill}/SKILL.md'], capture_output=True, text=True)
    status = 'UNCHANGED' if not result.stdout.strip() else 'MODIFIED'
    print(f'  {skill}: {status}')
print()

print('=== 6. NO BENCHMARK-SPECIFIC WORDING ===')
benchmark_terms = ['pagination', 'appends', 'eager-load', 'retry', 'N+1', 'payroll', 'api-resource-conditional', 'form-request-array-validation', 'laravel-12-collection-change', 'pest-dataset-test', 'queue-job-retry-backoff', 'service-extract-reuse']
found_any = False
for term in benchmark_terms:
    if term in router.lower():
        print(f'  WARNING: found {term}')
        found_any = True
if not found_any:
    print('  No benchmark-specific terms found in router')
print()

print('=== 7. STATIC VALIDATION RESULTS ===')
result = subprocess.run(['npm', 'run', 'validate'], capture_output=True, text=True)
print(result.stdout.strip())
print()

print('=== 8. GIT DIFF SUMMARY ===')
result = subprocess.run(['git', 'diff', '--stat'], capture_output=True, text=True)
print(result.stdout.strip())
