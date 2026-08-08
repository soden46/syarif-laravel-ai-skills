import os

# Verify V3.1 form-request refinement
with open(r'D:\syarif-laravel-ai-skills\syarif-laravel-standards\skills\form-requests\SKILL.md') as f:
    form = f.read()

form_keywords = [
    'simplest Laravel-native validation rule set',
    'Reuse the existing Form Request structure when safe',
    'Do not introduce complex nested rules',
    'helper abstractions',
    'additional validation structures unless the behavior actually requires them'
]

print('=== FORM-REQUESTS V3.1 REFINEMENT ===')
for kw in form_keywords:
    found = kw in form
    status = 'OK' if found else 'MISSING'
    print(f'  [{status}] {kw}')

# Verify V3.1 architecture refinement
with open(r'D:\syarif-laravel-ai-skills\syarif-laravel-standards\skills\architecture\SKILL.md') as f:
    arch = f.read()

arch_keywords = [
    'Duplication alone is not sufficient reason',
    'Prefer local reuse or a small extraction',
    'justified business boundary',
    'reusable operation',
    'dependency boundary',
    'meaningful complexity'
]

print()
print('=== ARCHITECTURE V3.1 REFINEMENT ===')
for kw in arch_keywords:
    found = kw in arch
    status = 'OK' if found else 'MISSING'
    print(f'  [{status}] {kw}')
