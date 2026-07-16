# Final Laravel Standards Proposal

Source project: `cashflow-app`
Audit date: 2026-07-16
Destination candidate: `syarif-laravel-standards`

This file is a move-ready proposal only. It does not modify any global skill or upstream Laravel skill.

## Compared Standards

Compared against installed custom Laravel skills under `C:\Users\SYARIF\.agents\skills`, especially:

- `laravel:using-laravel-superpowers`
- `laravel:routes-best-practices`
- `laravel:policies-and-authorization`
- `laravel:form-requests`
- `laravel:controller-cleanup`
- `laravel:transactions-and-consistency`
- `laravel:eloquent-relationships`
- `laravel:migrations-and-factories`
- `laravel:tdd-with-pest`
- `laravel:quality-checks`
- `laravel:custom-helpers`
- `laravel:performance-eager-loading`
- `laravel:blade-components-and-layouts`

Verification from source project:

- `php artisan test`: passed, 4 tests, 49 assertions.
- `vendor\bin\pint --test`: failed.
- `npm run build`: failed because `vite` is unavailable in the current environment.

## Classification Matrix

| Rule | Classification | Move decision | Target area |
| --- | --- | --- | --- |
| Explicit Resource Permission Matrix | UPDATE | Move as guarded refinement | Routing + authorization |
| Centralized Access Scope Reused by Query, Validation, and Authorization | UPDATE | Move as guarded refinement | Authorization + data access |
| Normalize Human-Formatted Numeric Input at the Request Boundary | NEW | Move as new boundary rule | Validation + helpers |
| Wrap Multi-Write Workflows in Database Transactions | DUPLICATE | Do not move as new rule; optionally add project evidence | Transactions |
| Explicit Eloquent Model Contracts | UPDATE | Move as concise refinement | Eloquent modeling |
| Feature Parity Test for Ported or Rebuilt Laravel Apps | UPDATE | Move as optional testing pattern | Testing |
| Idempotent Seeders | UPDATE | Move only after revision | Migrations + seeders |
| Project Formatting as a Global Convention | REJECT | Do not move | Quality |
| Frontend Build and Asset Handling | PROJECT_ONLY | Do not move to global standards | Project docs / AGENTS.md |

No proposal is classified as `CONFLICT`. The route permission and scoped-access proposals can conflict with existing standards only if they are written as replacements for Policies, Form Requests, or controller cleanup; this final proposal words them as guarded `UPDATE` items instead.

## Move Set

The following sections are ready to move after review.

### UPDATE: Explicit Resource Permission Matrix

Category: Routing and authorization

Proposed standard:

Use `Route::resource()` with `middlewareFor()` when a CRUD module has simple action-based permissions and the mapping should be auditable from the route file. Keep business logic out of routes. Prefer Policies, Gates, `can` middleware, or Form Request `authorize()` when authorization depends on model state, ownership, or domain rules.

Why it belongs:

- Refines `laravel:routes-best-practices`, which already allows middleware in routes and resource controllers.
- Refines `laravel:policies-and-authorization`, which already supports route middleware and policies.
- The source project uses this pattern consistently across CRUD resources.
- `php artisan test` passed and feature tests exercised multiple protected routes.

Generic example:

```php
Route::resource('projects', ProjectController::class)
    ->middlewareFor('index', 'permission:project.read')
    ->middlewareFor(['create', 'store'], 'permission:project.create')
    ->middlewareFor(['edit', 'update'], 'permission:project.update')
    ->middlewareFor('destroy', 'permission:project.delete');
```

Do not globalize:

- Local route language, module names, and concrete permission strings.
- Legacy permission fallback behavior.

### UPDATE: Centralized Access Scope Reused by Query, Validation, and Authorization

Category: Authorization and data access

Proposed standard:

In multi-tenant or scoped-access apps, centralize the list of accessible tenant/resource IDs and reuse it for listing queries, form option queries, validation rules, and explicit authorization checks. Keep the shared layer thin; move complex rules to Policies, Actions, or Services.

Why it belongs:

- Refines `laravel:policies-and-authorization` with a concrete data-access consistency pattern.
- Refines `laravel:eloquent-relationships`, which already recommends scopes for recurring constraints.
- Must be worded carefully to avoid conflicting with `laravel:controller-cleanup`.

Generic example:

```php
protected function accessibleTenantIds(): array
{
    return auth()->user()?->tenants()->pluck('tenants.id')->map(fn ($id) => (int) $id)->all() ?? [];
}

protected function applyTenantScope(Builder $query): Builder
{
    return $query->whereIn('tenant_id', $this->accessibleTenantIds() ?: [0]);
}

$data = $request->validate([
    'tenant_id' => ['required', Rule::in($this->accessibleTenantIds())],
]);
```

Do not globalize:

- Project-specific all-access semantics such as `branch_id = null`.
- Branch labels, pivot fallbacks, or local hierarchy names.

### NEW: Normalize Human-Formatted Numeric Input at the Request Boundary

Category: Validation and input normalization

Proposed standard:

Normalize human-formatted numeric inputs before applying Laravel `numeric` validation. For new endpoints, prefer `FormRequest::prepareForValidation()`. Use small support helpers or value objects for shared parsing logic; keep locale and currency assumptions explicit.

Why it belongs:

- This is not directly covered by the current Laravel skills.
- It complements `laravel:form-requests`, because normalization belongs at the request boundary.
- It complements `laravel:custom-helpers`, because shared parsers should stay small and testable.
- The source project passed feature tests using formatted values such as `1.000`, `10.000`, and `4.000`.

Generic example:

```php
final class NumberInput
{
    public static function normalize(mixed $value): float
    {
        if ($value === null || $value === '') {
            return 0;
        }

        $clean = preg_replace('/[^\d,.-]/', '', (string) $value) ?: '';
        $clean = str_replace('.', '', $clean);
        $clean = str_replace(',', '.', $clean);

        return is_numeric($clean) ? (float) $clean : 0;
    }
}

protected function prepareForValidation(): void
{
    $this->merge([
        'amount' => NumberInput::normalize($this->input('amount')),
    ]);
}
```

Do not globalize:

- Indonesian currency text such as `Rp`.
- One project's exact separator assumptions unless the standard states the locale explicitly.

### UPDATE: Explicit Eloquent Model Contracts

Category: Eloquent modeling

Proposed standard:

Models should declare mass-assignment boundaries, casts, and typed relationship return values. Use accessors sparingly for derived presentation/domain values, and keep heavy business behavior outside models when it grows beyond simple invariants.

Why it belongs:

- Refines `laravel:eloquent-relationships`, which already covers relationship clarity.
- Refines `laravel:specifying-constraints`, which already mentions `$fillable` for mass assignment safety.
- Adds the missing combined model contract rule: `$fillable`, `casts()`, and typed relationships together.

Generic example:

```php
class Invoice extends Model
{
    protected $fillable = [
        'customer_id',
        'number',
        'total',
        'issued_at',
        'is_paid',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'date',
            'total' => 'decimal:2',
            'is_paid' => 'boolean',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
```

Do not globalize:

- Domain-specific accessors such as current balance or remaining debt.
- Route key choices tied to one app's URL/UX.

### UPDATE: Feature Parity Test for Ported or Rebuilt Laravel Apps

Category: Testing strategy

Proposed standard:

When porting, rebuilding, or replacing an existing app, add a feature parity test that exercises the critical happy-path workflow across important routes. Treat it as a regression net, not a replacement for focused validation, authorization, unit, and service tests.

Why it belongs:

- Refines `laravel:tdd-with-pest`, which already permits PHPUnit and recommends feature tests.
- Refines `laravel:controller-cleanup`, which recommends feature tests for controller routes.
- Adds a specific migration/rebuild scenario currently absent from the global skills.

Generic example:

```php
$this->actingAs($admin);

$this->post(route('projects.store'), [
    'name' => 'QA Project',
])->assertRedirect(route('projects.index'))
    ->assertSessionHasNoErrors();

$this->assertDatabaseHas('projects', [
    'name' => 'QA Project',
]);
```

Do not globalize:

- Legacy source app names.
- Exact workflow labels and demo records from one project.

## Revise Before Moving

### UPDATE: Idempotent Seeders

Category: Migrations and seeders

Current classification:

This is an UPDATE to `laravel:migrations-and-factories`, not a brand-new rule.

Why it needs revision:

- The source project uses `updateOrCreate()` and relationship `sync()` consistently in seeders.
- No direct seeder idempotency test was run.
- The current global skill already says to seed realistic but minimal datasets, but does not require idempotency.

Revised standard candidate:

Prefer idempotent seeders for reference, demo, and local development data when stable natural keys exist. Use `updateOrCreate()`, `firstOrCreate()`, `upsert()`, and relationship `sync()` intentionally. Do not force idempotency for large generated datasets or data that should be produced by factories in tests.

Generic example:

```php
$role = Role::updateOrCreate(
    ['slug' => 'admin'],
    ['name' => 'Admin', 'permissions' => ['dashboard.read']],
);

$user->roles()->sync([$role->id]);
```

Move recommendation:

Move after adding one of these in the target standards repo:

- a short seeder idempotency checklist, or
- an example test that runs a seeder twice and asserts stable counts.

Do not globalize:

- Demo users, demo passwords, branch codes, and sample operational rows.

## Do Not Move

### DUPLICATE: Wrap Multi-Write Workflows in Database Transactions

Category: Data consistency

Reason:

This is already directly covered by `laravel:transactions-and-consistency`:

- Use `DB::transaction` to wrap write sequences and related side effects.
- Prefer after-commit jobs/events.
- Make retries safe and idempotent.

Keep as evidence, not as a new standard. If moved, add only a short project-proven example under an existing transactions section.

### REJECT: Project Formatting as a Global Convention

Category: Code style

Reason:

Reject deriving a formatting standard from this project because `vendor\bin\pint --test` failed. The correct global rule already exists in `laravel:quality-checks`: Pint must be clean before handoff/completion.

Do not move.

### PROJECT_ONLY: Frontend Build and Asset Handling

Category: Frontend/build workflow

Reason:

The source project references public CSS/JS directly while also having Vite scripts. `npm run build` failed because `vite` is unavailable. This is not stable enough for a global Laravel standard.

Keep in project docs or `AGENTS.md` only:

- whether hand-built `public/css/app.css` and `public/js/app.js` are intentional;
- local Node/Vite setup notes;
- any workaround for XAMPP or local asset serving.

## Suggested Repository Layout for `syarif-laravel-standards`

If the standards repo stores one topic per file, move the accepted/revised content like this:

```text
syarif-laravel-standards/
  laravel/
    routing-authorization.md
    data-access-scoping.md
    input-normalization.md
    eloquent-model-contracts.md
    testing-parity-workflows.md
    seeding-idempotency.md
```

If the standards repo stores skill-ready snippets, use one concise section per topic and keep examples short. Do not include project-specific route names, Indonesian UI copy, demo users, or build workarounds.

## Future Skill Intake Roadmap

Candidate upstream reference: `AsyrafHussin/agent-skills`.
Additional service-class reference: Zulfikar Ditya, "How to Use Service Classes in Laravel 12 for a Clean and Maintainable Codebase", Medium, 2025-03-18.

Relevant skills to evaluate before merging into `syarif-laravel-standards`:

- `laravel-best-practices`: Laravel conventions and architecture baseline.
- `php-best-practices`: PHP type system, SOLID, and maintainability.
- `clean-code-principles`: language-agnostic design patterns such as Factory, Strategy, and Repository.
- `laravel-testing`: Laravel feature/model/facade testing patterns.
- `laravel-database-optimization`: N+1 prevention, indexing, cursor pagination, caching, transactions, migrations, and query debugging.
- `technical-debt`: ranked refactor backlog for Laravel/MySQL and frontend stacks.
- `code-slop`: review guardrails for AI-generated or over-engineered code.
- `laravel-owasp-security`: Laravel and React/Inertia security audit.
- `seo-best-practices`: Laravel Blade and Inertia SEO, Core Web Vitals, meta tags, JSON-LD, Open Graph, and mobile-first indexing.
- `web-design-guidelines`: accessibility, semantic HTML, keyboard navigation, forms, and performance.
- `tailwind-best-practices`: Tailwind responsive design, dark mode, component patterns, and configuration.
- `react-vite-best-practices`: Vite build performance, code splitting, asset handling, environment config, and bundle analysis.

Architecture direction for future Laravel standards:

- Controllers stay thin: accept the request, delegate to a Form Request, call an Action or Service, and return a response/redirect/resource.
- Form Requests own authorization and validation for HTTP boundaries.
- Service classes own reusable application workflows that are not tied to HTTP.
- Actions may wrap a single use case when the workflow is specific and command-like.
- Domain/value helpers handle reusable parsing or transformation, such as numeric input normalization.
- Database writes involving multiple records stay inside transactions, usually inside the Service/Action layer.
- Feature tests cover HTTP workflows; unit tests cover Service classes and pure helpers.

Service class rules to extract later:

- Create services under `app/Services`, grouped by domain when the app grows.
- Use services for business operations that would otherwise bloat controllers, such as creating users, hashing passwords, assigning roles, dispatching events, or coordinating several models.
- Inject services into controllers through Laravel's container; avoid manually constructing services in controller methods.
- Use interfaces and service-provider bindings only when there are multiple implementations, external dependencies, or a real testing/substitution need. Do not create interfaces by default for every service.
- Keep repositories optional. Add a repository layer only when query/data-access duplication is real or when storage implementation must vary; otherwise Eloquent inside the service is acceptable.
- Put events in services when the event is part of the business workflow. Use after-commit dispatching for queued work that depends on committed database state.
- Wrap multi-model workflows inside the service with `DB::transaction`.
- Unit test services directly; feature test controllers as HTTP boundaries.

Preferred generic structure:

```text
app/
  Http/
    Controllers/
      ProjectController.php
    Requests/
      StoreProjectRequest.php
      UpdateProjectRequest.php
  Services/
    Projects/
      ProjectCreator.php
      ProjectUpdater.php
  Support/
    NumberInput.php
```

Generic controller/service pattern:

```php
final class ProjectController
{
    public function store(StoreProjectRequest $request, ProjectCreator $creator): RedirectResponse
    {
        $project = $creator->create($request->user(), $request->validated());

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Project created.');
    }
}

final class ProjectCreator
{
    public function create(User $actor, array $data): Project
    {
        return DB::transaction(function () use ($actor, $data) {
            $project = Project::create([
                'owner_id' => $actor->id,
                'name' => $data['name'],
            ]);

            $project->members()->sync($data['member_ids'] ?? []);

            return $project;
        });
    }
}
```

Intake rule:

Do not import third-party skill rules wholesale. Compare each rule against existing Laravel skills, classify it as `NEW`, `UPDATE`, `DUPLICATE`, `CONFLICT`, `PROJECT_ONLY`, or `REJECT`, then move only the concise accepted standard into `syarif-laravel-standards`.
