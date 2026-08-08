cases_data = {
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

# Aggregate by risk
risk_sums = {'LOW': {'v3': [], 'v31': []}, 'MEDIUM': {'v3': [], 'v31': []}, 'HIGH': {'v3': [], 'v31': []}}
for case, info in cases_data.items():
    risk = info['risk']
    risk_sums[risk]['v3'].append(v3_means[case])
    risk_sums[risk]['v31'].append(v31_means[case])

print('=== BY RISK ===')
for risk in ['LOW', 'MEDIUM', 'HIGH']:
    v3_list = risk_sums[risk]['v3']
    v31_list = risk_sums[risk]['v31']
    v3_avg = sum(v3_list)/len(v3_list)
    v31_avg = sum(v31_list)/len(v31_list)
    n = len(v3_list)
    print(f'{risk}: V3={v3_avg:.3f}, V3.1={v31_avg:.3f}, delta={v31_avg-v3_avg:+.3f}, n={n}')

# Aggregate by domain
domain_sums = {}
for case, info in cases_data.items():
    domain = info['domain']
    if domain not in domain_sums:
        domain_sums[domain] = {'v3': [], 'v31': []}
    domain_sums[domain]['v3'].append(v3_means[case])
    domain_sums[domain]['v31'].append(v31_means[case])

print()
print('=== BY DOMAIN ===')
for domain in sorted(domain_sums.keys()):
    v3_list = domain_sums[domain]['v3']
    v31_list = domain_sums[domain]['v31']
    v3_avg = sum(v3_list)/len(v3_list)
    v31_avg = sum(v31_list)/len(v31_list)
    n = len(v3_list)
    print(f'{domain}: V3={v3_avg:.3f}, V3.1={v31_avg:.3f}, delta={v31_avg-v3_avg:+.3f}, n={n}')
