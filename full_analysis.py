import json
import os

# Load full data for detailed analysis
with open(r'D:\ai-skill-eval-capability\skills\laravel-ai-skills\evals\evals.json') as f:
    evals = json.load(f)['evals']

# V3 and V3.1 means from previous analysis
v3_means = {
    'action-vs-controller': 0.917, 'api-pagination-filter': 1.0, 'api-resource-conditional': 0.75,
    'concurrent-race-condition': 0.917, 'eloquent-many-to-many-attach': 1.0, 'eloquent-polymorphic-relation': 0.25,
    'feature-test-auth-flow': 0.667, 'form-request-array-validation': 0.583, 'form-request-conditional': 0.75,
    'laravel-12-cast-change': 0.417, 'laravel-12-collection-change': 0.75, 'livewire-dependent-dropdowns': 1.0,
    'livewire-search-state-reset': 0.75, 'migration-add-column-production': 0.667, 'migration-modify-column-production': 0.333,
    'n-1-query-count-aggregate': 0.5, 'n-1-query-with-constraints': 0.75, 'pest-dataset-test': 0.833,
    'policy-admin-user-access': 0.75, 'queue-job-retry-backoff': 0.75, 'queue-job-unique-failure': 0.333,
    'security-mass-assignment': 1.0, 'service-extract-reuse': 0.667, 'transaction-rollback': 1.0
}

v31_means = {
    'action-vs-controller': 0.833, 'api-pagination-filter': 1.0, 'api-resource-conditional': 0.667,
    'concurrent-race-condition': 0.667, 'eloquent-many-to-many-attach': 0.833, 'eloquent-polymorphic-relation': 0.417,
    'feature-test-auth-flow': 0.667, 'form-request-array-validation': 0.583, 'form-request-conditional': 0.417,
    'laravel-12-cast-change': 0.25, 'laravel-12-collection-change': 0.833, 'livewire-dependent-dropdowns': 0.917,
    'livewire-search-state-reset': 0.833, 'migration-add-column-production': 0.083, 'migration-modify-column-production': 0.25,
    'n-1-query-count-aggregate': 0.0, 'n-1-query-with-constraints': 0.5, 'pest-dataset-test': 0.667,
    'policy-admin-user-access': 0.75, 'queue-job-retry-backoff': 0.583, 'queue-job-unique-failure': 0.083,
    'security-mass-assignment': 1.0, 'service-extract-reuse': 0.667, 'transaction-rollback': 1.0
}

# Risk/domain labels inferred from task semantics
inferred = {
    'action-vs-controller': {'domain': 'architecture', 'risk': 'MEDIUM'},
    'api-pagination-filter': {'domain': 'api', 'risk': 'LOW'},
    'api-resource-conditional': {'domain': 'api', 'risk': 'MEDIUM'},
    'concurrent-race-condition': {'domain': 'database', 'risk': 'HIGH'},
    'eloquent-many-to-many-attach': {'domain': 'eloquent', 'risk': 'LOW'},
    'eloquent-polymorphic-relation': {'domain': 'eloquent', 'risk': 'LOW'},
    'feature-test-auth-flow': {'domain': 'testing', 'risk': 'MEDIUM'},
    'form-request-array-validation': {'domain': 'validation', 'risk': 'LOW'},
    'form-request-conditional': {'domain': 'validation', 'risk': 'LOW'},
    'laravel-12-cast-change': {'domain': 'eloquent', 'risk': 'MEDIUM'},
    'laravel-12-collection-change': {'domain': 'eloquent', 'risk': 'LOW'},
    'livewire-dependent-dropdowns': {'domain': 'livewire', 'risk': 'LOW'},
    'livewire-search-state-reset': {'domain': 'livewire', 'risk': 'LOW'},
    'migration-add-column-production': {'domain': 'migrations', 'risk': 'HIGH'},
    'migration-modify-column-production': {'domain': 'migrations', 'risk': 'HIGH'},
    'n-1-query-count-aggregate': {'domain': 'performance', 'risk': 'MEDIUM'},
    'n-1-query-with-constraints': {'domain': 'performance', 'risk': 'MEDIUM'},
    'pest-dataset-test': {'domain': 'testing', 'risk': 'LOW'},
    'policy-admin-user-access': {'domain': 'authorization', 'risk': 'HIGH'},
    'queue-job-retry-backoff': {'domain': 'queues', 'risk': 'MEDIUM'},
    'queue-job-unique-failure': {'domain': 'queues', 'risk': 'HIGH'},
    'security-mass-assignment': {'domain': 'security', 'risk': 'HIGH'},
    'service-extract-reuse': {'domain': 'architecture', 'risk': 'LOW'},
    'transaction-rollback': {'domain': 'database', 'risk': 'HIGH'},
}

# Build table rows
rows = []
for e in evals:
    cid = e['id']
    v3 = v3_means.get(cid, 0)
    v31 = v31_means.get(cid, 0)
    delta = v31 - v3
    info = inferred.get(cid, {})
    domain = info.get('domain', 'unknown')
    risk = info.get('risk', 'unknown')
    
    # Determine likely affected layer
    if cid in ['api-resource-conditional', 'laravel-12-collection-change', 'queue-job-retry-backoff']:
        layer = 'router'
    elif cid in ['form-request-array-validation', 'form-request-conditional']:
        layer = 'form-request specialist'
    elif cid == 'service-extract-reuse':
        layer = 'architecture specialist'
    elif cid in ['migration-add-column-production', 'n-1-query-count-aggregate', 'concurrent-race-condition']:
        layer = 'router or model variance'
    else:
        layer = 'unclear'
    
    rows.append((cid, domain, risk, v3, v31, delta, layer))

# Print per-case table
print('PER-CASE MEAN WITH_SKILL SCORES')
print('='*120)
print(f"{'Case':<35} {'Domain':<15} {'Risk':<8} {'V3':>6} {'V3.1':>6} {'Delta':>7} {'Layer'}")
print('-'*120)
for cid, domain, risk, v3, v31, delta, layer in rows:
    print(f"{cid:<35} {domain:<15} {risk:<8} {v3:>6.3f} {v31:>6.3f} {delta:>+7.3f} {layer}")

# Aggregates
print()
print('AGGREGATE BY RISK')
print('='*60)
risk_groups = {}
for cid, domain, risk, v3, v31, delta, layer in rows:
    if risk not in risk_groups:
        risk_groups[risk] = {'v3': [], 'v31': []}
    risk_groups[risk]['v3'].append(v3)
    risk_groups[risk]['v31'].append(v31)

for risk in ['LOW', 'MEDIUM', 'HIGH']:
    if risk in risk_groups:
        v3_avg = sum(risk_groups[risk]['v3'])/len(risk_groups[risk]['v3'])
        v31_avg = sum(risk_groups[risk]['v31'])/len(risk_groups[risk]['v31'])
        n = len(risk_groups[risk]['v3'])
        print(f"{risk}: V3={v3_avg:.3f}, V3.1={v31_avg:.3f}, delta={v31_avg-v3_avg:+.3f}, n={n}")

print()
print('AGGREGATE BY DOMAIN')
print('='*60)
domain_groups = {}
for cid, domain, risk, v3, v31, delta, layer in rows:
    if domain not in domain_groups:
        domain_groups[domain] = {'v3': [], 'v31': []}
    domain_groups[domain]['v3'].append(v3)
    domain_groups[domain]['v31'].append(v31)

for domain in sorted(domain_groups.keys()):
    v3_avg = sum(domain_groups[domain]['v3'])/len(domain_groups[domain]['v3'])
    v31_avg = sum(domain_groups[domain]['v31'])/len(domain_groups[domain]['v31'])
    n = len(domain_groups[domain]['v3'])
    print(f"{domain}: V3={v3_avg:.3f}, V3.1={v31_avg:.3f}, delta={v31_avg-v3_avg:+.3f}, n={n}")

# Intended fixes
print()
print('INTENDED FIXES RESULT')
print('='*60)
intended = ['api-resource-conditional', 'form-request-array-validation', 'laravel-12-collection-change', 'queue-job-retry-backoff', 'service-extract-reuse']
for cid in intended:
    v3 = v3_means.get(cid, 0)
    v31 = v31_means.get(cid, 0)
    delta = v31 - v3
    if delta > 0.05:
        status = 'IMPROVED'
    elif delta < -0.05:
        status = 'REGRESSED'
    else:
        status = 'UNCHANGED'
    print(f"{cid}: V3={v3:.3f}, V3.1={v31:.3f}, delta={delta:+.3f} -> {status}")

# Stable wins
print()
print('STABLE WINS ANALYSIS')
print('='*60)
stable_candidates = [
    'transaction-rollback', 'n-1-query-count-aggregate', 'n-1-query-with-constraints',
    'policy-admin-user-access', 'migration-add-column-production', 'migration-modify-column-production',
    'api-pagination-filter', 'feature-test-auth-flow', 'security-mass-assignment',
    'eloquent-many-to-many-attach', 'action-vs-controller', 'concurrent-race-condition'
]

lost = []
held = []
for cid in stable_candidates:
    v3 = v3_means.get(cid, 0)
    v31 = v31_means.get(cid, 0)
    delta = v31 - v3
    # A stable win is one where v3 skill > v3 baseline by meaningful margin
    # and v31 also > v31 baseline, but v31 skill dropped
    if delta < -0.05:
        lost.append((cid, v3, v31, delta))
    else:
        held.append((cid, v3, v31, delta))

print('Lost stable wins (delta < -0.05):')
for cid, v3, v31, delta in lost:
    print(f"  {cid}: V3={v3:.3f}, V3.1={v31:.3f}, delta={delta:+.3f}")

print()
print('Held steady (delta >= -0.05):')
for cid, v3, v31, delta in held:
    print(f"  {cid}: V3={v3:.3f}, V3.1={v31:.3f}, delta={delta:+.3f}")
