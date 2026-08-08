# Compare ablation wrapper body with V3 router body

v3_router = """# Using Syarif Laravel Standards

Apply silently. Output only the minimal solution.

1. Make the smallest safe change.
2. Infer risk: LOW / MEDIUM / HIGH.
3. Preserve unrelated behavior.
4. Select only relevant specialist guidance.
5. Verify proportionally to risk.
6. Stop when complete.

LOW: local change only. No new abstraction. Minimal verification. No memory unless prior context is necessary.
MEDIUM: trace affected path. Preserve contracts. Root-cause where non-obvious. Targeted regression check.
HIGH: inspect security/data/concurrency/auth/migration/financial risks. Failure paths. Affected regression surface. Explicit remaining uncertainty when meaningful.

Memory: use only when prior context materially matters. Current code/config overrides memory.

Overengineering gate: reuse existing code unless it cannot safely solve the task. Then create the smallest justified abstraction.

One best solution by default. Do not list alternatives unless requested.

## References

- Combined orchestrator reference: `references/orchestrator-reference.md`
"""

with open(r'D:\ai-skill-eval-capability\benchmark-results\ablation-A-v3router-v31specialists\skills\laravel-ai-skills\SKILL.md') as f:
    wrapper = f.read()

# Extract body after frontmatter
lines = wrapper.split('\n')
if lines[0] == '---':
    end = lines.index('---', 1)
    body = '\n'.join(lines[end+1:])
else:
    body = wrapper

# Normalize title
body = body.replace('# Laravel AI Skills Framework', '# Using Syarif Laravel Standards')

if body.strip() == v3_router.strip():
    print('V3 ROUTER: EXACT MATCH')
else:
    print('V3 ROUTER: MISMATCH')
    import difflib
    diff = list(difflib.unified_diff(v3_router.strip().splitlines(), body.strip().splitlines(), lineterm=''))
    for line in diff[:30]:
        print(line)
