# Final Proposal for `syarif-laravel-standards`

Audit date: 2026-07-16

Source proposal: `docs/standards-proposal.md`

Compared against global custom Laravel skills in `C:\Users\SYARIF\.agents\skills\laravel-*`.

This document is ready to move into the `syarif-laravel-standards` repository. It does not modify global skills directly.

## Comparison Sources

- `laravel:using-laravel-superpowers`
- `laravel:routes-best-practices`
- `laravel:policies-and-authorization`
- `laravel:controller-cleanup`
- `laravel:form-requests`
- `laravel:controller-tests`
- `laravel:tdd-with-pest`
- `laravel:transactions-and-consistency`
- `laravel:migrations-and-factories`
- `laravel:filesystem-uploads`
- `laravel:config-env-storage`
- `laravel:constants-and-configuration`
- `laravel:eloquent-relationships`
- `laravel:quality-checks`
- `laravel:complexity-guardrails`

## Classification Matrix

| No | Proposal | Classification | Existing coverage | Final decision |
| --- | --- | --- | --- | --- |
| 1 | Middleware authorization eksplisit di route boundary | UPDATE | `routes-best-practices` already allows middleware in routes; `policies-and-authorization` covers policies/gates and `can` middleware. | Add clearer route-boundary authorization guidance. Keep project permission slugs out. |
| 2 | Konfigurasi middleware Laravel 12 di `bootstrap/app.php` | NEW | No current global skill explicitly documents Laravel 12 middleware alias and auth redirects in `bootstrap/app.php`. | Add as framework convention guidance. |
| 3 | Service kecil untuk workflow domain atau I/O non-trivial | DUPLICATE | Covered by `using-laravel-superpowers`, `controller-cleanup`, and `complexity-guardrails`. | Do not migrate as a separate rule. |
| 4 | Transaksi database dengan row lock untuk counter dan saldo | DUPLICATE | Covered directly by `transactions-and-consistency`. | Do not migrate separately. |
| 5 | Seeder reference data harus idempotent | UPDATE | `migrations-and-factories` mentions seeders, but not idempotent reference data with `updateOrCreate` and `sync`. | Add a seeder idempotency section. |
| 6 | Feature tests sebagai bukti behavior | DUPLICATE | Covered by `tdd-with-pest`, `controller-tests`, `migrations-and-factories`, and `quality-checks`. | Do not migrate separately. |
| 7 | Gunakan Laravel fakes untuk I/O dalam test | UPDATE | `config-env-storage` covers `Storage::fake`; testing skills imply fakes but do not generalize boundary fakes. | Add broader fake-boundaries testing guidance. |
| 8 | Casts dan typed Eloquent relationships | UPDATE | `eloquent-relationships` covers relationship naming/loading; `constants-and-configuration` shows enum casts. | Add a compact model convention section. |
| 9 | Soft delete untuk master data yang dipakai histori | NEW | No direct global rule found for historical master data with `SoftDeletes` and `withTrashed()`. | Add historical data modeling guidance. |
| 10 | Native PHP enum untuk nilai domain tertutup | DUPLICATE | Covered by `constants-and-configuration` and `using-laravel-superpowers`. | Do not migrate separately. |
| 11 | Route model binding memakai UUID untuk URL dokumen publik/internal | UPDATE | `routes-best-practices` covers route model binding, but not UUID route keys. | Add UUID route-key refinement. |
| 12 | Snapshot data penting saat membuat dokumen historis | NEW | No direct global rule found for immutable document snapshots. | Add historical snapshot guidance. |
| 13 | Key-value `AppSetting` sederhana | UPDATE | `constants-and-configuration` has database-driven settings with cache invalidation. Project version is simpler. | Replace with stricter admin-editable settings guidance. |
| 14 | Inline validation di controller | REJECT | Conflicts with `form-requests` and `controller-cleanup`. | Do not migrate. |

## Ready-To-Move Changes

The following sections are the proposed text or content direction for `syarif-laravel-standards`.

### 1. Authorization At The Route Boundary

Classification: UPDATE

Suggested target: `laravel-routes-best-practices/SKILL.md`, with a cross-link to `laravel:policies-and-authorization`.

Proposed standard text:

Keep access requirements visible at the HTTP boundary. For route-level access rules, attach authentication, verification, tenant, role, permission, or `can:*` middleware directly to the route or route group.

Use Policies for per-model actions and Gates for cross-cutting checks. Route middleware is a good fit for coarse route access; controller or Form Request authorization is still appropriate when the check depends on validated input or model-specific policy logic.

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/reports', ReportController::class)
        ->middleware('can:viewReports')
        ->name('reports.index');
});
```

Avoid hiding required route access inside unrelated controller branches. Tests should assert both allowed and denied access paths with `assertForbidden()`, `assertUnauthorized()`, or redirect assertions.

Do not migrate project-specific names like `portal:pos`, `portal:backoffice`, or `permission:labels.view`.

### 2. Laravel 12 Middleware Configuration

Classification: NEW

Suggested target: `laravel-routes-best-practices/SKILL.md` or a framework-conventions skill/document.

Proposed standard text:

For Laravel 12 style applications, register middleware aliases and auth redirect behavior in `bootstrap/app.php` through `withMiddleware()`.

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->redirectGuestsTo(fn ($request) => $request->is('admin/*') ? '/admin/login' : '/login');
    $middleware->redirectUsersTo(fn ($request) => '/dashboard');

    $middleware->alias([
        'admin' => EnsureAdmin::class,
        'permission' => EnsurePermission::class,
    ]);
})
```

Keep redirect URLs and custom alias names project-specific. Test redirects and denied access through feature tests.

### 3. Idempotent Reference Seeders

Classification: UPDATE

Suggested target: `laravel-migrations-and-factories/SKILL.md`.

Proposed standard text:

Reference data seeders that may run more than once must be idempotent. Use stable natural keys with `updateOrCreate()`, `upsert()`, or equivalent unique constraints. For many-to-many reference mappings, use `sync()` when the seeder owns the complete mapping.

```php
$permission = Permission::updateOrCreate(
    ['slug' => 'orders.view'],
    ['name' => 'View Orders', 'module' => 'Orders'],
);

$role = Role::updateOrCreate(
    ['slug' => 'order-manager'],
    ['name' => 'Order Manager'],
);

$role->permissions()->sync([$permission->id]);
```

Prefer a smoke test or command check that can run the seeder twice without creating duplicates. Keep large demo datasets outside core seeders.

### 4. Framework Fakes For I/O Boundaries

Classification: UPDATE

Suggested target: `laravel:tdd-with-pest`, `laravel:controller-tests`, or a shared testing standard.

Proposed standard text:

Use Laravel fakes for external or filesystem side effects so tests stay deterministic and do not touch real services.

Common fakes:

- `Storage::fake()` for uploads and generated files
- `Notification::fake()` for notifications
- `Mail::fake()` for mail
- `Queue::fake()` or `Bus::fake()` for queued work
- `Event::fake()` when events are the asserted boundary

```php
Storage::fake('public');

$this->post(route('avatars.store'), [
    'avatar' => UploadedFile::fake()->image('avatar.png'),
])->assertRedirect();

Storage::disk('public')->assertExists('avatars/avatar.png');
```

Assert the side effect through the fake instead of relying on real disks, SMTP, queue workers, or third-party services.

### 5. Model Casts And Typed Relationships

Classification: UPDATE

Suggested target: `laravel-eloquent-relationships/SKILL.md`.

Proposed standard text:

Define casts for non-string model attributes and return concrete relationship types from relationship methods.

```php
protected function casts(): array
{
    return [
        'published_at' => 'datetime',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];
}

public function author(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

Use enum casts for closed domain values when the enum improves clarity. Keep relationship names descriptive and consistent with Laravel conventions.

### 6. Preserve Historical Master Data

Classification: NEW

Suggested target: new data-modeling standard, or `laravel-eloquent-relationships/SKILL.md` if no better home exists.

Proposed standard text:

When transactional or historical records must remain readable after master data is removed from active use, prefer soft deletes on the master model and `withTrashed()` on historical relationships.

```php
class Customer extends Model
{
    use SoftDeletes;
}

class Invoice extends Model
{
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class)->withTrashed();
    }
}
```

Do not use this as a blanket rule for personal data or records subject to hard-delete compliance requirements. Decide per model whether history, privacy, or cleanup requirements dominate.

### 7. UUID Route Keys For Non-Sequential URLs

Classification: UPDATE

Suggested target: `laravel-routes-best-practices/SKILL.md`.

Proposed standard text:

Use UUID or ULID route keys for resources where public or shared URLs should not expose sequential database IDs.

```php
public function getRouteKeyName(): string
{
    return 'uuid';
}
```

Pair this with a unique database index and a consistent generation strategy, such as model creation hooks, application service assignment, or database-generated values. Not every model needs UUID route binding; use it for documents, public links, and records where non-sequential identifiers are useful.

### 8. Snapshot Important Document Data

Classification: NEW

Suggested target: new data-modeling standard, or pair with historical master data guidance.

Proposed standard text:

When creating historical documents, copy the attributes that must remain true for that document even if related master data changes later.

```php
InvoiceLine::create([
    'product_id' => $product->id,
    'product_snapshot' => $product->only(['sku', 'name', 'price']),
]);
```

Cast snapshot columns to `array` or a typed value object when appropriate. Store only the fields needed for historical correctness and avoid unnecessary sensitive data.

### 9. Admin-Editable Database Settings

Classification: UPDATE

Suggested target: `laravel-constants-and-configuration/SKILL.md`.

Proposed standard text:

Use database-backed settings only for non-secret values that must be changed at runtime by authorized users. Deployment configuration, credentials, and environment-specific values should stay in `config/*.php` and environment variables.

Recommended settings model behavior:

- stable string key
- typed or JSON value storage
- cache reads with explicit invalidation on write
- authorization around write endpoints
- tests for default values, updates, cache invalidation, and deletion

```php
class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember(
            "settings.{$key}",
            config('app.cache_ttl.long'),
            fn () => static::query()->where('key', $key)->value('value') ?? $default,
        );
    }

    public static function set(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("settings.{$key}");
    }
}
```

## Do Not Migrate As New Standards

These proposals are already covered or should stay out of global standards:

- Small services for non-trivial workflow: DUPLICATE. Existing standards already say controllers orchestrate and services/actions own workflow.
- Database transactions and row locks: DUPLICATE. Existing `transactions-and-consistency` already says this directly.
- Feature tests as behavior proof: DUPLICATE. Existing testing skills already cover this.
- Native PHP enums: DUPLICATE. Existing configuration/constants guidance already covers enums.
- Inline controller validation: REJECT. It conflicts with Form Request and controller cleanup standards as a global rule.

## Project-Only Notes

Do not migrate these project-specific details into `syarif-laravel-standards`:

- permission slugs such as `labels.view`, `products.manage`, or `pos.access`
- portal names such as `pos` and `backoffice`
- seeded demo users and role names
- label-specific snapshot fields
- branding-specific `AppSetting` keys
- local tolerance for inline validation in small existing controllers

## Suggested Repository Placement

If `syarif-laravel-standards` mirrors the current skill layout, apply the proposal as:

- Update `laravel-routes-best-practices/SKILL.md`: authorization at route boundary, Laravel 12 middleware config, UUID route keys.
- Update `laravel-migrations-and-factories/SKILL.md`: idempotent reference seeders.
- Update testing docs or skills: framework fakes for I/O boundaries.
- Update `laravel-eloquent-relationships/SKILL.md`: casts and typed relationships, plus historical master data if no better data-modeling skill exists.
- Add or update a data-modeling standard: historical master data and document snapshots.
- Update `laravel-constants-and-configuration/SKILL.md`: admin-editable database settings with cache/type/non-secret constraints.
