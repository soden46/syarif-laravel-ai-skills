# Merged Laravel Standards Proposal

Audit date: 2026-07-16

Status: proposal only. Do not create or edit `SKILL.md` yet.

Scope:
- Audited all Markdown proposals in `proposals/pending`.
- Added external skill intake from two Laravel-oriented skill repositories as proposal material, without installing or copying upstream skills.
- Compared overlapping rules across proposals.
- Consolidated reusable Laravel standards into one de-identified proposal.
- Removed client names, project names, company names, URLs, credentials, exact provider details, business-specific copy, concrete role names, concrete permission slugs, and domain-specific model/table names.
- Did not modify or copy any upstream Laravel skill.

## Decision Criteria

Promote a rule only when it is reusable across Laravel projects and improves maintainability, security, testability, or complexity control.

Prefer rules that:
- appear consistently across multiple proposals;
- align with Laravel best practices;
- are supported by tests or quality checks;
- apply across business domains;
- reduce controller/model complexity;
- make authorization, data access, I/O, or deployment behavior safer.

Do not promote a rule just because it appeared once.

## Source Map

The source proposal filenames are intentionally abstracted in this merged proposal:

| Source | Description |
| --- | --- |
| P1 | Production/reporting Laravel audit proposal |
| P2 | CRUD/admin Laravel standards proposal |
| P3 | Laravel skill roadmap proposal |
| P4 | Integration-heavy Laravel standards proposal |
| P5 | Scoped admin/data-access Laravel standards proposal |
| P6 | External agent skill repository intake |
| P7 | External Laravel superpowers skill repository intake |

## Classification Summary

| Rule group | Sources | Classification | Recommendation |
| --- | --- | --- | --- |
| Controller -> FormRequest -> Service/Action workflow | P2, P3, P4, P5 | NEW | Add as a core global architecture rule. |
| External integration boundary in small services/adapters | P3, P4 | UPDATE | Merge into the service workflow rule and integration guidance. |
| Conditional interfaces and repositories | P3, P4, P5 | UPDATE | Add anti-overengineering wording. |
| Route-boundary authorization and resource permission matrices | P2, P5 | UPDATE | Add guarded route authorization guidance. |
| Centralized scoped access reused by query, validation, and authorization | P5 | NEW | Add with strong scope and policy caveats. |
| Laravel 12 middleware registration in `bootstrap/app.php` | P2 | NEW | Add as framework-version convention, not universal versionless rule. |
| Form Request validation and authorization | P2, P3, P5 | DUPLICATE | Already core best practice; reference in combined rules. |
| Inline validation in controllers | P1, P2, P3 | CONFLICT | Reject as a global standard. |
| Normalize human-formatted numeric input at request boundary | P5 | NEW | Add as a reusable boundary rule. |
| Framework fakes for I/O boundaries | P2, P3, P4 | UPDATE | Add as testing refinement. |
| Feature workflow tests for user-facing flows | P2, P3, P4, P5 | UPDATE | Add as a testing standard. |
| Feature parity tests for ported/rebuilt apps | P5 | UPDATE | Add as optional migration/rebuild testing pattern. |
| Lightweight in-memory relation graphs for pure render/redirect tests | P1 | NEW | Add only with tight scope limitations. |
| Generated document/report artifact tests | P1 | NEW | Add as report/export testing guidance. |
| Explicit relation loading before rendering Blade/report/export/PDF surfaces | P1, P3 | UPDATE | Add as render-surface eager-loading refinement. |
| Select only needed columns for listings | P3, P4 | DUPLICATE | Keep under existing performance guidance; do not add as standalone. |
| Explicit model contracts: fillable, casts, typed relationships | P2, P3, P5 | UPDATE | Merge into one Eloquent model contract rule. |
| Native enums for closed values | P1, P2, P3 | DUPLICATE | Keep as part of bounded options guidance; do not add separately. |
| Bounded UI/validation options from one source of truth | P1, P3 | UPDATE | Add as configuration/model convention. |
| Idempotent seeders for reference data | P2, P5 | UPDATE | Add after wording caveats and recommended verification. |
| Transactions for multi-write workflows | P1, P2, P3, P5 | DUPLICATE | Do not add as new; merge side-effect refinements only. |
| Row locks for counters/balances | P2, P3 | DUPLICATE | Keep under transactions/concurrency guidance. |
| Transaction plus filesystem cleanup | P1 | NEW | Add as side-effect consistency refinement. |
| Jobs/events after commit | P3 | UPDATE | Add inside service workflow/transaction guidance. |
| Database-backed singleton/admin-editable settings with cache invalidation | P2, P4 | UPDATE | Merge into one settings rule. |
| Structured logs around external integrations | P4 | UPDATE | Add as observability refinement. |
| Route-cache-safe utility controllers | P4 | UPDATE | Add with exception for simple closures/prototypes. |
| More-specific routes before resource routes | P1 | NEW | Add with `route:list` or feature-test verification. |
| UUID/ULID route keys for non-sequential public/shared URLs | P2 | UPDATE | Add as route-model-binding refinement. |
| Preserve historical master data with soft deletes and `withTrashed()` | P2, P5 | NEW | Add with privacy/compliance caveat. |
| Snapshot important document data | P2, P5 | NEW | Add with sensitive-data caveat. |
| API resources, pagination, stable errors, and API evolution | P6, P7 | NEW | Add API contracts and evolution guidance. |
| OWASP-style security pass, CSRF, rate limiting, upload safety, and sensitive data exposure | P6, P7 | NEW | Add security review baseline. |
| Large dataset processing with chunk/lazy/cursor and cursor pagination | P6, P7 | UPDATE | Add explicit volume-safety guidance. |
| Async jobs, queue retry/backoff/failure behavior, scheduling safety | P6, P7 | NEW | Add async operations guidance. |
| Blade/Inertia/Tailwind/accessibility/SEO stack-aware frontend standards | P3, P6, P7 | NEW | Add optional frontend/UI/SEO reference, gated by stack detection. |
| Browser E2E tests with role locators, web-first assertions, and no fixed sleeps | P6, P7 | UPDATE | Add browser-test guidance for JS-dependent critical flows. |
| PHP version-aware type safety and code review rubric | P6 | UPDATE | Add to review and implementation guardrails. |
| Technical-debt, code-quality, security, and docs audit ledgers | P6, P7 | NEW | Add audit output modes. |
| Documentation hygiene and cleanup of stale generated docs | P6, P7 | NEW | Add docs hygiene guidance. |
| Runner detection and quality gates | P7 | UPDATE | Add to implementation workflow. |
| Dependency trimming | P7 | NEW | Add maintenance guidance. |
| Internationalization from the start | P7 | NEW | Add optional user-facing product guidance. |
| AI SDK, vector search, MCP, Nova, major-version upgrade playbooks | P6, P7 | PROJECT_ONLY | Keep as specialized future skills or optional references. |
| SEO/performance skill roadmap | P3, P6 | UPDATE | Move into stack-aware frontend/public-site guidance. |
| Admin page-swap/prefetch behavior | P4 | PROJECT_ONLY | Do not promote globally. |
| Frontend build and asset workaround | P5 | PROJECT_ONLY | Keep local. |
| Provider-specific payloads, statuses, staging behavior, and message copy | P4 | PROJECT_ONLY | Keep local. |
| Concrete roles, permission strings, demo users, labels, costs, branch/module names | P1, P2, P4, P5 | PROJECT_ONLY | Remove from global standards. |
| Whole-repository formatting exception from projects with failing Pint baseline | P1, P4, P5 | REJECT | Keep global expectation that quality gates should be clean before handoff. |
| Copying third-party/upstream skill content wholesale | P3, P5 | REJECT | Extract only generic rules after classification. |
| External installer commands, metadata, command wrappers, and repository layout | P6, P7 | REJECT | Do not merge into custom Laravel skill. |

## Merged Standards To Adopt

### 1. Controller, Request, And Service Workflow

Classification: NEW

Merged from:
- Controller cleanup and service class proposals.
- External integration boundary proposals.
- Future architecture roadmap.

Proposed global rule:

For non-trivial Laravel workflows, structure the request path as:

```text
Controller -> FormRequest -> Service/Action -> Model/Integration
```

Controllers should focus on HTTP orchestration: receive the request, rely on Form Requests or policies for validation and authorization, call a service/action, and return a response, redirect, resource, or view.

Use a service/action when the workflow:
- coordinates multiple models;
- writes several records;
- calls external systems;
- parses files;
- generates documents;
- dispatches jobs/events;
- contains reusable business rules;
- would otherwise make the controller large or branch-heavy.

Use constructor injection for dependencies. Add an interface only when there are multiple implementations, provider swapping, a stable domain port, or a meaningful test/substitution boundary. Do not create repositories or interfaces by default for simple Eloquent CRUD.

Generic example:

```php
final class CreateRecordService
{
    public function create(User $actor, array $data): Record
    {
        return DB::transaction(function () use ($actor, $data) {
            $record = Record::create([
                'owner_id' => $actor->id,
                'name' => $data['name'],
            ]);

            $record->items()->createMany($data['items'] ?? []);

            return $record->fresh(['items']);
        });
    }
}

final class RecordController
{
    public function store(StoreRecordRequest $request, CreateRecordService $service): RedirectResponse
    {
        $record = $service->create($request->user(), $request->validated());

        return redirect()->route('records.show', $record);
    }
}
```

Acceptance guidance:
- Feature test the HTTP path.
- Unit test the service/action when the workflow has meaningful branching or domain logic.
- Use after-commit dispatching for queued jobs/events that depend on committed database state.

### 2. External Integration Boundary

Classification: UPDATE

Merged from:
- Small integration services.
- HTTP fake workflow tests.
- Structured integration logs.

Proposed global rule:

Keep external provider calls in focused services or adapters, not controllers, jobs, route files, Blade templates, or inline closures.

Use a small service when the app talks to one provider and the provider is not yet a domain abstraction. Promote to a port/interface plus adapters when multiple providers, provider swapping, or framework-independent domain code justifies the extra layer.

The integration boundary should own:
- request payload mapping;
- authentication/signing details;
- timeout and retry behavior;
- response parsing;
- provider error translation;
- sanitized logging;
- fake-driven tests for important flows.

Generic example:

```php
final class GatewayService
{
    public function createLink(Record $record): string
    {
        $response = Http::baseUrl(config('services.gateway.url'))
            ->timeout(5)
            ->retry(2, 200, throw: false)
            ->post('/links', [
                'reference' => $record->public_reference,
                'amount' => $record->total,
            ]);

        throw_unless($response->successful(), RuntimeException::class);

        return $response->json('url');
    }
}
```

Do not globalize:
- concrete provider endpoints;
- exact payload fields from one provider;
- customer message copy;
- staging incidents;
- status mappings from one integration.

### 3. Route-Boundary Authorization

Classification: UPDATE

Merged from:
- Explicit route middleware proposals.
- Resource permission matrix proposals.

Proposed global rule:

Keep coarse access requirements visible at the HTTP boundary. Attach authentication, verification, tenant, role, permission, or `can:*` middleware directly to route groups or routes when the rule is route-level and auditable there.

Use Policies for per-model actions and Gates for cross-cutting checks. Use Form Request `authorize()` when the check depends on validated input or request-specific context. Keep business authorization logic out of route files.

Generic example:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('records', RecordController::class)
        ->middlewareFor('index', 'can:viewAny,' . Record::class)
        ->middlewareFor(['create', 'store'], 'can:create,' . Record::class)
        ->middlewareFor(['edit', 'update'], 'can:update,record')
        ->middlewareFor('destroy', 'can:delete,record');
});
```

Tests should cover allowed and denied paths with `assertForbidden()`, `assertUnauthorized()`, or redirect assertions.

Do not globalize:
- concrete permission slugs;
- role names;
- portal names;
- local fallback semantics.

### 4. Scoped Access Reuse

Classification: NEW

Merged from:
- Scoped access reused by query, validation, and authorization.

Proposed global rule:

In multi-tenant or scoped-access apps, centralize accessible resource IDs or constraints and reuse them for:
- listing queries;
- form option queries;
- validation rules;
- explicit authorization checks.

Keep this shared layer thin. Move complex ownership, state, or domain rules into Policies, Actions, or Services.

Generic example:

```php
final class AccessibleResources
{
    public function idsFor(User $user): array
    {
        return $user->resources()
            ->pluck('resources.id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }
}

$ids = $access->idsFor($request->user());

$records = Record::query()
    ->whereIn('resource_id', $ids ?: [0])
    ->paginate();

$data = $request->validate([
    'resource_id' => ['required', Rule::in($ids)],
]);
```

Do not globalize:
- one app's "all access" sentinel values;
- branch/team/module names;
- hierarchy labels.

### 5. Laravel Version-Specific Middleware Configuration

Classification: NEW

Merged from:
- Laravel 12 middleware configuration proposal.

Proposed global rule:

When working in Laravel versions that configure middleware through `bootstrap/app.php`, register middleware aliases and authentication redirects through the framework bootstrap middleware hook.

Keep alias names and redirect destinations project-specific. Confirm the project version and existing structure before recommending version-specific code.

Generic example:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->redirectGuestsTo(fn () => '/login');
    $middleware->redirectUsersTo(fn () => '/dashboard');

    $middleware->alias([
        'verified-access' => EnsureVerifiedAccess::class,
    ]);
})
```

Verification:
- Feature test redirects and denied access.
- Confirm middleware names via route tests or `php artisan route:list` when relevant.

### 6. Request-Boundary Input Normalization

Classification: NEW

Merged from:
- Human-formatted numeric input normalization.

Proposed global rule:

Normalize human-formatted numeric inputs before applying Laravel `numeric` validation. For new HTTP endpoints, prefer `FormRequest::prepareForValidation()`.

Keep locale, decimal separator, thousands separator, and currency assumptions explicit. Use a small helper or value object when parsing is reused across requests.

Generic example:

```php
final class NumberInput
{
    public static function normalize(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        $clean = preg_replace('/[^\d,.-]/', '', (string) $value) ?: '';
        $clean = str_replace(',', '.', str_replace(' ', '', $clean));

        return is_numeric($clean) ? (float) $clean : null;
    }
}

protected function prepareForValidation(): void
{
    $this->merge([
        'amount' => NumberInput::normalize($this->input('amount')),
    ]);
}
```

Tests should cover accepted formats, rejected formats, blank values, and locale assumptions.

### 7. Framework Fakes For I/O Boundaries

Classification: UPDATE

Merged from:
- Laravel fakes in tests.
- External integration workflow tests.

Proposed global rule:

Use Laravel fakes for external or filesystem side effects so tests stay deterministic and do not touch real services.

Common fakes:
- `Http::fake()` for outbound HTTP;
- `Storage::fake()` for uploads and generated files;
- `Notification::fake()` for notifications;
- `Mail::fake()` for mail;
- `Queue::fake()` or `Bus::fake()` for queued work;
- `Event::fake()` when the event is the asserted boundary.

Generic example:

```php
Http::fake([
    'api.example.test/*' => Http::response(['ok' => true]),
]);

$this->post(route('records.send', $record))
    ->assertRedirect()
    ->assertSessionHasNoErrors();

Http::assertSent(fn ($request) => $request->method() === 'POST');
```

Assert the side effect through the fake instead of relying on real disks, SMTP, queue workers, or third-party services.

### 8. Workflow And Parity Tests

Classification: UPDATE

Merged from:
- Feature workflow tests.
- Port/rebuild feature parity tests.
- Behavior-proof testing proposals.

Proposed global rule:

For user-facing workflows, prefer feature tests that exercise the route and framework behavior end to end.

Cover important combinations of:
- middleware and authorization;
- session state;
- validation;
- redirects;
- database writes;
- response output;
- external integration boundaries through fakes.

When porting, rebuilding, or replacing an existing app, add a feature parity test for the critical happy path. Treat parity tests as a regression net, not a replacement for focused validation, authorization, unit, and service tests.

Generic example:

```php
$this->actingAs($user)
    ->post(route('records.store'), [
        'name' => 'Example',
    ])
    ->assertRedirect(route('records.index'))
    ->assertSessionHasNoErrors();

$this->assertDatabaseHas('records', [
    'name' => 'Example',
]);
```

Do not globalize:
- exact business copy;
- demo data names;
- legacy source app labels.

### 9. Lightweight Render And Redirect Tests

Classification: NEW

Merged from:
- In-memory relation graph render tests.
- Direct redirect target tests.

Proposed global rule:

For tests that only render a Blade view, render a report/export source view, or verify narrow redirect behavior, unsaved Eloquent model graphs may be built with `forceFill()` and `setRelation()`.

Use this only when persistence, middleware, authorization, route model binding, database constraints, query behavior, and events are not part of the behavior under test.

Prefer factories and database-backed feature tests when the behavior depends on database writes or the full framework request lifecycle.

Generic example:

```php
$owner = (new User)->forceFill([
    'name' => 'Example User',
]);

$record = (new Record)->forceFill([
    'number' => 'DOC-001',
]);

$record->setRelation('owner', $owner);

$html = view('reports.record', [
    'record' => $record,
])->render();

$this->assertStringContainsString('DOC-001', $html);
```

For redirect tests to named routes, compare the target against `route(...)` rather than hardcoded URLs.

```php
$response = app(RecordRedirectController::class)->show($record);

$this->assertSame(
    route('records.index', ['search' => 'DOC-001']),
    $response->getTargetUrl()
);
```

### 10. Generated Document And Report Tests

Classification: NEW

Merged from:
- Report/PDF contract tests.
- Generated artifact validity tests.

Proposed global rule:

For generated documents such as PDFs, reports, exports, or printable views, assert both:
- stable rendered contract text/data;
- artifact validity appropriate to the generator or format.

Avoid full HTML snapshots unless the project has a deliberate snapshot or visual-regression workflow.

Generic example:

```php
$viewData = [
    'record' => $record,
];

$html = view('reports.record', $viewData)->render();
$output = Pdf::loadView('reports.record', $viewData)->output();

$this->assertStringContainsString('Document Number', $html);
$this->assertStringContainsString('DOC-001', $html);
$this->assertStringStartsWith('%PDF-', $output);
```

### 11. Render-Surface Relation Loading

Classification: UPDATE

Merged from:
- Explicit relation graphs before rendering views/reports/PDFs.
- Eager-loading performance guidance.

Proposed global rule:

Before rendering Blade reports, printable views, exports, or PDFs, explicitly load the relation graph needed by the template in the controller, query object, action, or report builder.

Do not add new relation dependencies inside templates without updating the load list and adding or adjusting a render test.

Generic example:

```php
public function show(Record $record)
{
    $record->load([
        'owner',
        'items.product',
        'approvals.user',
    ]);

    return view('records.show', [
        'record' => $record,
    ]);
}
```

This refines eager-loading guidance; it does not replace broader N+1 prevention.

### 12. Explicit Eloquent Model Contracts

Classification: UPDATE

Merged from:
- Fillable/casts/typed relationship proposals.
- Model contracts and typed relationships.

Proposed global rule:

Models should declare mass-assignment boundaries, casts, and concrete relationship return types.

Use accessors sparingly for simple derived values. Move heavy business behavior into services/actions when model methods grow beyond simple invariants.

Generic example:

```php
class Record extends Model
{
    protected $fillable = [
        'owner_id',
        'number',
        'total',
        'issued_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'date',
            'total' => 'decimal:2',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### 13. Bounded Options From One Source Of Truth

Classification: UPDATE

Merged from:
- Native enums.
- Constants/configuration guidance.
- UI/validation bounded values.

Proposed global rule:

For bounded application choices used by validation and display, keep allowed values and labels in one source of truth.

Prefer PHP enums when the project PHP version and conventions support them. Use class/model constants for small model-owned maps in older projects. Use config files for environment-level or deployment-level options.

Do not duplicate option values across controllers, Blade templates, JavaScript, validation rules, and database seeders.

Generic example:

```php
enum RecordStatus: string
{
    case Draft = 'draft';
    case Approved = 'approved';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Approved => 'Approved',
            self::Cancelled => 'Cancelled',
        };
    }
}

$request->validate([
    'status' => ['required', Rule::enum(RecordStatus::class)],
]);
```

Do not globalize:
- actual business status labels;
- pricing maps;
- operational categories from one app.

### 14. Idempotent Reference Seeders

Classification: UPDATE

Merged from:
- Idempotent seeder proposals in multiple audits.

Proposed global rule:

Reference data seeders that may run more than once should be idempotent when stable natural keys exist. Use `updateOrCreate()`, `firstOrCreate()`, `upsert()`, and relationship `sync()` intentionally.

Do not force idempotency for large generated datasets or data that should be produced by factories in tests.

Generic example:

```php
$option = ReferenceOption::updateOrCreate(
    ['key' => 'example-option'],
    ['label' => 'Example Option'],
);

$group = ReferenceGroup::updateOrCreate(
    ['key' => 'example-group'],
    ['label' => 'Example Group'],
);

$group->options()->sync([$option->id]);
```

Recommended verification:
- add a smoke test that runs the seeder twice and asserts stable counts; or
- document the stable natural keys and run the seeder twice during migration review.

Do not globalize:
- demo users;
- demo passwords;
- concrete role names;
- project module names;
- operational seed rows from one domain.

### 15. Transaction And Side-Effect Consistency

Classification: UPDATE

Merged from:
- Existing transaction guidance.
- Filesystem cleanup around database transactions.
- Queued jobs/events after commit.

Proposed global rule:

Wrap multi-write workflows in database transactions at the service/action boundary. Keep transactions short and make retry behavior idempotent where retries are possible.

When a workflow writes database records and files in the same logical operation, account for the fact that database transactions do not roll back filesystem changes.

Track stored file paths during the workflow and delete them if the database transaction fails. For delete flows, commit database/audit changes first, then delete files after the successful transaction unless the product explicitly requires the opposite failure mode.

Use after-commit dispatching for queued jobs/events that depend on committed database state.

Generic example:

```php
$storedPaths = [];

try {
    DB::transaction(function () use ($request, &$storedPaths) {
        $record = Record::create([...]);

        foreach ($request->file('attachments', []) as $file) {
            $storedPaths[] = $file->store("records/{$record->id}", 'public');
        }
    });
} catch (Throwable $exception) {
    Storage::disk('public')->delete($storedPaths);

    throw $exception;
}
```

Recommended tests:
- success path;
- failed database write cleanup;
- delete cleanup;
- after-commit dispatch behavior for important workflows.

### 16. Database-Backed Settings

Classification: UPDATE

Merged from:
- Singleton settings caching.
- Admin-editable settings.

Proposed global rule:

Use database-backed settings only for non-secret values that must be changed at runtime by authorized users. Deployment configuration, credentials, and environment-specific values should stay in `config/*.php` and environment variables.

For low-frequency settings shared across many requests:
- keep access behind a model method or small settings service;
- use stable cache keys;
- include tenant, locale, team, or user scope in the key when settings are not truly global;
- invalidate cache explicitly after writes;
- test defaults, updates, cache invalidation, and deletion.

Generic example:

```php
final class AppSetting extends Model
{
    private const CACHE_KEY = 'app_settings:current';

    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    public static function current(): self
    {
        return Cache::rememberForever(
            self::CACHE_KEY,
            fn () => self::query()->first() ?? new self()
        );
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
```

Do not globalize:
- branding field names;
- homepage section names;
- payment copy;
- credential storage in database settings.

### 17. Structured Integration Logs

Classification: UPDATE

Merged from:
- Structured logs around integrations.

Proposed global rule:

Log important integration transitions with structured context that helps production debugging without exposing secrets.

Include useful non-sensitive identifiers and state:
- local record IDs;
- public references;
- provider IDs when safe;
- status codes;
- operation names;
- sanitized response summaries.

Do not log:
- tokens;
- signatures;
- card data;
- full payment payloads;
- unnecessary personally identifiable information;
- credentials.

Generic example:

```php
Log::info('integration.gateway.create.completed', [
    'record_id' => $record->id,
    'reference' => $record->public_reference,
    'provider_status' => $response->status(),
]);
```

Add tests for behavior. Assert logs only when the log entry itself is part of the expected contract or incident workflow.

### 18. Route Cache And Route Ordering

Classification: UPDATE

Merged from:
- Route-cache-safe utility endpoints.
- Specific routes before resource routes.

Proposed global rule:

For committed production endpoints, prefer controller actions over route closures when the endpoint needs framework behavior, tests, middleware, sessions, cache headers, or deployment route caching.

Use invokable controllers for focused one-off endpoints. Keep route closures acceptable for static views, simple redirects, prototypes, and temporary debugging.

Define static or more-specific routes before broad resource routes when URI patterns could collide.

Generic example:

```php
Route::get('records/export', ExportRecordsController::class)
    ->name('records.export');

Route::resource('records', RecordController::class);
```

Verification:
- check `php artisan route:list` after collision-prone route changes;
- add route or feature tests for critical routes.

### 19. UUID/ULID Route Keys For Non-Sequential URLs

Classification: UPDATE

Merged from:
- UUID route model binding proposal.

Proposed global rule:

Use UUID or ULID route keys for resources where public or shared URLs should not expose sequential database IDs.

Pair this with:
- a unique database index;
- a consistent generation strategy;
- route model binding tests for important public/shared links.

Generic example:

```php
public function getRouteKeyName(): string
{
    return 'uuid';
}
```

Not every model needs UUID route binding. Use it where non-sequential identifiers have product, privacy, or operational value.

### 20. Historical Data And Document Snapshots

Classification: NEW

Merged from:
- Historical master data.
- Document snapshots.

Proposed global rule:

When transactional or historical records must remain readable after related master data is removed from active use, consider soft deletes on the master model and `withTrashed()` on historical relationships.

Do not use soft deletes as a blanket rule for personal data or records subject to hard-delete compliance requirements. Decide per model whether history, privacy, or cleanup requirements dominate.

Generic example:

```php
class ReferenceRecord extends Model
{
    use SoftDeletes;
}

class HistoricalRecord extends Model
{
    public function reference(): BelongsTo
    {
        return $this->belongsTo(ReferenceRecord::class)->withTrashed();
    }
}
```

When creating historical documents, copy the attributes that must remain true for that document even if related master data changes later.

```php
DocumentLine::create([
    'reference_id' => $reference->id,
    'reference_snapshot' => $reference->only(['code', 'name']),
]);
```

Cast snapshot columns to `array` or a typed value object when appropriate. Store only fields needed for historical correctness and avoid unnecessary sensitive data.

### 21. API Contracts And Evolution

Classification: NEW

Merged from:
- External API design skills.
- Laravel API resource and API evolution skills.

Proposed global rule:

For JSON APIs, keep response shapes stable through API Resources, dedicated transformers, or DTO-backed presenters. Include pagination metadata consistently and use conditional fields for expensive, optional, or permission-sensitive data.

API responses should have predictable status codes, validation error details, and a consistent error shape. Do not expose stack traces or internal exception details in API responses.

When evolving public, partner, mobile, or otherwise consumed APIs, preserve backward compatibility where practical. Add compatibility tests for response shape, status codes, validation errors, pagination, and deprecation behavior.

Internal admin JSON endpoints may stay simpler, but they still need authorization, validation, predictable response shape, and tests for important consumers.

### 22. Security Review Baseline

Classification: NEW

Merged from:
- External OWASP-oriented Laravel security skills.
- Request forgery, rate limiting, upload, and sensitive data rules.

Proposed global rule:

For security-sensitive Laravel work, run a focused security pass before handoff.

Check:
- authorization on every route/action;
- authentication and rate limits on abuse-prone routes;
- CSRF/request forgery protection for browser forms;
- explicit and documented webhook exclusions;
- validated file uploads, MIME/type limits, size limits, and safe storage paths;
- escaped output in Blade and safe prop exposure in frontend stacks;
- parameterized queries or query builder usage instead of raw interpolated SQL;
- secrets kept out of source, logs, database settings, frontend environment, and API payloads;
- redacted structured logs;
- dependency advisories and abandoned packages when dependency changes are in scope.

Security review should be a mode of the custom skill, not a separate mandatory wall of text loaded for every Laravel task.

### 23. Large Data And Query Volume

Classification: UPDATE

Merged from:
- External database optimization skills.
- Data chunking and pagination skills.

Proposed global rule:

Do not process unbounded production datasets with `all()` or broad `get()` calls. Use pagination for user-facing UI/API lists and chunk/lazy/cursor iteration for background processing.

Prefer:
- `paginate()` or cursor pagination for user-facing large lists;
- `chunkById()` or `lazyById()` when updating rows during iteration;
- `cursor()` or lazy collections for forward-only streaming;
- raw bulk updates only when events/model behavior are intentionally bypassed;
- selected columns and indexed filters for high-volume paths.

Add tests or review notes for large-data code paths that can silently pass on small local datasets but fail in production volume.

### 24. Async Jobs, Queues, And Schedules

Classification: NEW

Merged from:
- External Laravel queue and Horizon skills.
- Task scheduling skills.

Proposed global rule:

Queued jobs should be safe to retry. Pass IDs or small scalar payloads when possible, reload models in `handle()`, define retry/backoff/timeout behavior intentionally, and make permanent failures explicit.

Dispatch after commit when the job depends on database writes. Use fakes for tests that assert dispatching, and use integration/feature tests when the job behavior itself is important.

Do not force Horizon for every project. Use Horizon or equivalent operational visibility when queue volume, failed job handling, throughput, or production support needs justify it.

Scheduled tasks should use overlap protection for long-running work and should be observable enough that missed or failed runs are detectable. Keep environment-specific schedules visible and test command behavior separately from cron itself.

### 25. Frontend Stack Quality For Laravel Apps

Classification: NEW

Merged from:
- Blade component/layout skills.
- Inertia/React skills.
- Tailwind, accessibility, Vite, and SEO skills.

Proposed global rule:

When a Laravel task touches UI, detect the frontend stack before editing: Blade, Blade plus Alpine, Livewire, Inertia, React, Vue, Tailwind, Vite, or another setup.

For Blade, keep templates focused on rendering and move reusable UI into components. For Inertia/React, type page props where the project supports it, use framework form helpers, handle validation errors, manage shared data carefully, and set document head metadata for public pages.

All user-facing UI should preserve:
- semantic HTML;
- labels and accessible names;
- visible validation errors;
- keyboard focus;
- responsive layout;
- loading/disabled states;
- reduced-motion respect where animation matters.

For public/indexable pages, add SEO checks for metadata, canonical URLs, structured data where useful, social sharing tags, sitemap/robots expectations, image dimensions/formats, and Core Web Vitals-sensitive assets.

Apply React/Vite/Tailwind-specific guidance only when those stacks are present.

### 26. Browser E2E Tests For Critical Flows

Classification: UPDATE

Merged from:
- External Playwright skills.
- Laravel E2E testing skills.

Proposed global rule:

Use browser E2E tests for critical behavior that depends on JavaScript, browser state, file previews, modals, drag/drop, upload progress, SPA navigation, or real user interaction.

Prefer role and label locators, web-first assertions, and deterministic auth setup such as storage state when appropriate. Avoid fixed sleeps. Keep E2E coverage focused on high-value paths, while PHP feature tests continue to cover most server behavior.

### 27. PHP And Code Quality Review Rubric

Classification: UPDATE

Merged from:
- PHP best practice skills.
- Clean code, technical debt, and code-quality review skills.

Proposed global rule:

Before adding PHP patterns, detect the project's PHP and Laravel versions. Prefer explicit parameter, property, and return types. Use modern syntax only when the project version supports it and the existing codebase already accepts it.

In implementation and review, flag:
- generic names;
- narration comments and empty docblocks;
- debug artifacts;
- useless wrappers;
- premature interfaces;
- excessive defensive branches for impossible states;
- broad exception swallowing;
- tests that mirror implementation instead of behavior;
- snapshot tests used where explicit assertions would be clearer.

Use DRY, KISS, SRP, fail-fast, and composition as review heuristics, not as an excuse for abstraction-heavy rewrites.

### 28. Audit Output Modes

Classification: NEW

Merged from:
- External technical debt, code-quality, security, and documentation audit skills.

Proposed global rule:

For audits, lead with findings ordered by severity. Include file references, risk, recommendation, and verification.

Supported audit modes:
- implementation readiness;
- technical debt ledger;
- code-quality/slop ledger;
- security checklist;
- performance/data-volume checklist;
- documentation hygiene review;
- UI/accessibility/SEO review when the task touches UI or public pages.

Use concise classifications such as `FIX_NOW`, `STANDARDIZE`, `PROJECT_ONLY`, `DUPLICATE`, or `IGNORE`.

### 29. Documentation Hygiene

Classification: NEW

Merged from:
- External project documentation skills.
- Existing proposal cleanup needs.

Proposed global rule:

Keep project documentation durable. Preserve setup, operations, architecture decisions, domain rules, and project-specific conventions.

Remove or archive temporary plans, duplicate summaries, stale generated notes, and filler documentation after implementation. Use ADR-style notes only for meaningful architectural decisions that future maintainers need to understand.

When extracting standards, keep reusable rules in the standards repo and project-only details in project docs.

### 30. Runner, Quality Gate, Dependency, And Locale Workflow

Classification: UPDATE

Merged from:
- Runner selection and quality-check skills.
- Dependency trimming and internationalization skills.

Proposed global rule:

Before running Laravel commands, detect whether the project expects Sail/container commands or host PHP/Composer/Node commands. Use the project's existing workflow and document any command that could not run.

Before handoff, run the relevant quality gates the project supports: tests, Pint or style check, static analysis, frontend build/lint, route checks, or targeted smoke tests. Do not normalize failing legacy baselines as global standards.

Periodically remove unused Composer/NPM packages and assets when dependency changes are in scope; trimming dependencies reduces boot time, attack surface, and maintenance burden.

For user-facing products, build new strings with translation readiness in mind when the project already has or clearly needs multiple locales. Do not force i18n scaffolding into small single-locale internal tools unless requested.

## Duplicate Rules Not To Add Separately

These are valid Laravel practices but should not become standalone new rules because they are already covered or merged above:

| Rule | Classification | Handling |
| --- | --- | --- |
| Form Requests for validation/authorization | DUPLICATE | Referenced in controller workflow. |
| Policies/Gates for authorization | DUPLICATE | Referenced in route-boundary authorization. |
| Basic service/action extraction | DUPLICATE | Merged into controller/request/service workflow. |
| Native enums for closed values | DUPLICATE | Merged into bounded options rule. |
| Select only required columns | DUPLICATE | Keep in performance guidance. |
| Prevent N+1 with eager loading | DUPLICATE | Render-surface rule is only a refinement. |
| Database transactions for multi-write flows | DUPLICATE | Side-effect cleanup is the new refinement. |
| Row locks for counters/balances | DUPLICATE | Keep under transaction/concurrency guidance. |
| Feature tests as general behavior proof | DUPLICATE | Workflow/parity rule is a refinement. |
| Generic clean-code principles | DUPLICATE | Used as review heuristics, not standalone Laravel rules. |
| Generic frontend framework rules | DUPLICATE | Apply only through stack-aware frontend guidance. |
| Generic API design principles | DUPLICATE | Apply through Laravel API contracts guidance. |

## Conflicts And Recommended Resolutions

### Inline Controller Validation vs Form Requests

Classification: CONFLICT

Conflict:
- Some source notes tolerated inline validation in existing small controllers.
- Global Laravel standards should prefer Form Requests for validation and authorization at HTTP boundaries.

Recommendation:
- Reject inline controller validation as a global standard.
- Allow it only as project-local legacy tolerance or for tiny prototypes.
- For new or heavily edited flows, use Form Requests.

### Route Closures vs Route-Cache-Safe Controllers

Classification: CONFLICT

Conflict:
- Route closures are convenient for static pages, redirects, prototypes, and debugging.
- Production endpoints with middleware, sessions, cache headers, tests, or deployment route caching benefit from controllers.

Recommendation:
- Do not say "never use route closures."
- Promote controllers for committed production endpoints that need framework behavior.
- Keep closures acceptable for simple/static/temporary routes.

### Service Interfaces And Repositories By Default

Classification: CONFLICT

Conflict:
- Some architecture references suggest service interfaces or repositories broadly.
- Existing Laravel best practice favors Eloquent directly until abstraction is justified.

Recommendation:
- Add interfaces only for multiple implementations, provider swapping, stable domain ports, or meaningful test boundaries.
- Add repositories only for real data-access complexity or storage-provider variation.
- Reject "interface for every service" and "repository for every model" as global rules.

### Soft Deletes For History vs Hard-Delete/Privacy Needs

Classification: CONFLICT

Conflict:
- Historical workflows often need related master data to remain readable.
- Privacy, legal, or retention requirements may require hard delete or anonymization.

Recommendation:
- Promote soft deletes with `withTrashed()` only for models where historical readability dominates.
- Require per-model decision-making and avoid storing unnecessary sensitive data in snapshots.

### In-Memory Render Tests vs Database-Backed Feature Tests

Classification: CONFLICT

Conflict:
- In-memory relation graphs are fast for pure view/report rendering.
- They can hide persistence, authorization, middleware, binding, database constraint, query, and event bugs.

Recommendation:
- Allow in-memory graphs only for pure render/redirect tests.
- Use factories and database-backed feature tests for full framework behavior.

### Global Quality Gates vs Legacy Formatting Baselines

Classification: CONFLICT

Conflict:
- Multiple source projects had failing formatting/build baselines.
- Global standards should not normalize failing quality gates.

Recommendation:
- Reject project-specific formatting exceptions as global standards.
- Keep global guidance that tests, formatting, static analysis, and builds should be clean before handoff when the project supports them.
- Document legacy exceptions in project docs only.

### Laravel/PHP Version Specificity

Classification: CONFLICT

Conflict:
- External skills may assume newer Laravel or PHP features.
- Source projects and future projects may use older or mixed Laravel/PHP versions.

Recommendation:
- Detect versions from `composer.json` before applying version-specific syntax, middleware registration, attributes, API helpers, AI SDK, vector search, or framework conventions.
- Keep version-specific guidance in references and load it only when relevant.

### Generic Frontend Guidance vs Actual Laravel Stack

Classification: CONFLICT

Conflict:
- External frontend skills include Blade, React, Inertia, Tailwind, Vite, accessibility, and SEO guidance.
- A Laravel app may use only some of these, or none of the SPA tooling.

Recommendation:
- Detect the stack before applying frontend-specific rules.
- Treat accessibility, form feedback, responsive behavior, and safe data exposure as universal UI standards.
- Treat React/Vite/Tailwind/Inertia/SEO details as conditional references.

### API Formality vs Internal Admin Endpoints

Classification: CONFLICT

Conflict:
- API skills promote versioning, formal error envelopes, OpenAPI-style documentation, and strict compatibility.
- Some Laravel projects expose only internal admin endpoints or simple private JSON surfaces.

Recommendation:
- Apply full API lifecycle guidance to public, partner, mobile, or consumed APIs.
- Keep private endpoints simpler while preserving authorization, validation, stable response shape, and tests.

### Specialized Skills vs Core Laravel Standard

Classification: CONFLICT

Conflict:
- External repositories include specialized topics such as AI SDK, vector search, MCP, Nova, major upgrades, and Horizon dashboards.
- Loading these into the core skill would bloat context and over-trigger niche guidance.

Recommendation:
- Keep specialized topics out of the core custom Laravel skill.
- Add them later as separate optional skills or references loaded only when explicitly needed.

## Project-Only Or Rejected Material

### PROJECT_ONLY

Keep these out of the global skill:
- client names;
- project names;
- company names;
- URLs;
- credentials;
- provider-specific endpoint paths;
- exact customer/admin message copy;
- concrete payment/status mappings;
- staging incidents;
- concrete permission strings;
- role names;
- seeded demo users/passwords;
- branch/team/module labels;
- report labels;
- pricing/weight/cost maps;
- admin page-swap/prefetch behavior;
- frontend build workarounds;
- local environment warnings;
- exact route/module names tied to one domain.
- external repository installer commands;
- external repository metadata and agent-specific command wrappers;
- AI SDK/vector/MCP/Nova/upgrade playbooks unless explicitly scoped as future dedicated skills.

### REJECT

Do not promote:
- inline validation in controllers as a global rule;
- whole-repository formatting exceptions from projects with failing Pint baselines;
- copying external or upstream skill text wholesale;
- copying upstream `README.md`, `AGENTS.md`, metadata, commands, or installer content;
- repository pattern as a default;
- interface-per-service as a default;
- provider-specific operations as reusable Laravel standards;
- business-specific data maps or operational logic.
- broad "use every skill" behavior that would make `SKILL.md` too large.

## Recommended Skill Shape

This merged proposal is suitable for a custom global Laravel skill owned by this repository, but the final `SKILL.md` should stay concise.

Recommended structure:

```text
custom-laravel-standards/
  SKILL.md
  references/
    architecture.md
    api-contracts.md
    authorization-routing.md
    security.md
    testing.md
    data-modeling.md
    large-data-performance.md
    transactions-side-effects.md
    async-operations.md
    integrations-observability.md
    configuration-settings.md
    frontend-ui-seo.md
    review-audit.md
    documentation-hygiene.md
```

Recommended `SKILL.md` contents:
- trigger description for Laravel implementation, review, refactor, audit, and standards extraction;
- short workflow: detect stack/version, choose relevant reference, implement with tests, run quality checks;
- concise guardrails: no upstream copying, no project-specific details, no overengineering.

Move longer examples and detailed rules into references so the skill remains token-efficient.

## Migration Plan For Later Implementation

Do not implement this section until explicitly approved.

1. Create or update a custom skill in this repository, not upstream Laravel skills.
2. Keep `SKILL.md` concise and use reference files for detailed Laravel standards.
3. Add accepted rules from this proposal into topic references.
4. Preserve conflict notes as decision guardrails.
5. Add validation guidance for tests, Pint, static analysis, build, and route checks.
6. Validate the skill folder with the skill creator tooling.
7. Forward-test the skill against generic Laravel tasks before marking it ready.
