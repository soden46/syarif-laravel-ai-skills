# Cashflow App Laravel Standards Proposal

## Source Scope

- Audited area: Laravel 12 cashflow app after the conversion/rebuild flow from task notes and Lovable parity into Laravel CRUD workflows.
- Date: 2026-07-17
- Stack reviewed: PHP `^8.2`, Laravel `^12.0`, PHPUnit `^11.5`, Laravel Pint, Vite/Tailwind.
- Verification reviewed:
  - `php artisan test`: passed, 17 tests, 121 assertions.
  - `vendor\bin\pint --test`: failed on formatting/import fixers across existing files.
  - PHP emitted an `imagick` startup warning during both checks; tests still passed.
- Global standards compared: `laravel:using-laravel-standards`, `laravel:routes-best-practices`, `laravel:controller-cleanup`, `laravel:form-requests`, `laravel:database-transactions`, `laravel:actions-and-services`, `laravel:eloquent-patterns`, `laravel:testing`, `laravel:security`.

## Multi-Project Merge Notes

- Treat each rule below as a candidate, not a final global edit.
- Promote a rule to `syarif-laravel-standards` only after the same pattern appears in at least one more unrelated Laravel project or it clearly fills a gap in the current global skills.
- Keep project language, route names, role slugs, menu labels, ordering constants, and business terms in project `AGENTS.md`, not global skills.
- Prefer adding short deltas to existing Laravel skills over creating a new skill unless multiple projects produce a distinct repeatable workflow.

## Proposal 1: Route-Level Permission Map Per Resource Action

- Nama aturan: Map coarse permissions explicitly on routes per resource action.
- Kategori aturan: Authorization, routes, controller boundaries.
- Stage 2 candidate classification: `UPDATE` to `laravel:security` and `laravel:controller-cleanup`.
- Alasan: Access boundaries are easier to audit when each route/action declares the required permission near the route definition. It also keeps controllers focused on request orchestration and model-specific checks.
- Bukti penerapan dalam proyek:
  - `routes/web.php` groups authenticated routes and applies `permission:*` middleware to every protected surface.
  - Resource routes use Laravel 12 `middlewareFor()` per action, for example branch/account/category/user/role CRUD.
  - Middleware aliases are registered centrally in `bootstrap/app.php`.
- Test atau quality check yang membuktikannya:
  - `tests/Feature/CategoryManagementTest.php` covers allowed and denied category access, including create, store, edit, update, destroy, and permission assignment.
  - `php artisan test` passed.
- Contoh generik:

```php
Route::middleware('auth')->group(function () {
    Route::resource('records', RecordController::class)
        ->middlewareFor('index', 'permission:record.read')
        ->middlewareFor(['create', 'store'], 'permission:record.create')
        ->middlewareFor('edit', 'permission:record.edit')
        ->middlewareFor('update', 'permission:record.update')
        ->middlewareFor('destroy', 'permission:record.delete');
});
```

- Konflik dengan standar global saat ini: No conflict. Current security standards already require authorization for every protected route, and controller cleanup already recommends visible route boundaries.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - Permission names such as `category.read`.
  - Indonesian route names such as `kategori`, `cabang`, and `piutang`.
  - Specific role slugs and role hierarchy.
- Rekomendasi: `accept`.

## Proposal 2: Tenant/Scope Helpers Must Be Paired With Scoped Validation Rules

- Nama aturan: Centralize tenant/resource scope helpers and enforce the same scope in validation.
- Kategori aturan: Authorization, validation, Eloquent query boundaries.
- Stage 2 candidate classification: `NEW`.
- Alasan: Listing data with a tenant scope is not enough. Mutating routes also need validation rules that prevent users from submitting IDs outside their allowed scope.
- Bukti penerapan dalam proyek:
  - `app/Http/Controllers/Controller.php` exposes `branchQuery()`, `applyBranchScope()`, `accessibleBranchIds()`, and `authorizeBranchId()`.
  - Controllers use `Rule::in($this->accessibleBranchIds())` and `Rule::exists(...)->whereIn(...)` for branch-scoped inputs in income, expense, transfer, transaction, and debt flows.
  - Controllers re-check cross-field ownership, for example account must belong to the selected branch.
- Test atau quality check yang membuktikannya:
  - `tests/Feature/CategoryManagementTest.php` proves denied paths for users without the relevant permission.
  - `tests/Feature/LovableCrudParityTest.php` exercises scoped CRUD-style happy paths across branches, accounts, transactions, transfers, debts, and reports.
  - `php artisan test` passed.
- Contoh generik:

```php
protected function applyTenantScope(Builder $query, string $column = 'tenant_id'): Builder
{
    return $query->whereIn($column, $this->accessibleTenantIds() ?: [0]);
}

$data = $request->validate([
    'tenant_id' => ['required', Rule::in($this->accessibleTenantIds())],
    'account_id' => [
        'required',
        Rule::exists('accounts', 'id')
            ->where(fn ($query) => $query->whereIn('tenant_id', $this->accessibleTenantIds())),
    ],
]);
```

- Konflik dengan standar global saat ini: No direct conflict. This expands `laravel:security` and `laravel:eloquent-patterns` with a concrete rule for request input IDs.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - The meaning of "all branch access" as `branch_id === null`.
  - Whether users may belong to many branches or exactly one tenant.
- Rekomendasi: `accept`.

## Proposal 3: Normalize Human-Formatted Numeric Input Before Validation

- Nama aturan: Normalize locale-formatted numeric inputs at the request boundary before applying numeric validation.
- Kategori aturan: Validation, input normalization, support helpers.
- Stage 2 candidate classification: `UPDATE` to `laravel:form-requests`.
- Alasan: Browser forms often submit human-formatted values such as `1.000` or `1.000,50`. Normalizing first lets Laravel numeric rules validate the real value consistently.
- Bukti penerapan dalam proyek:
  - `app/Support/MoneyInput.php` centralizes formatting and normalization.
  - Controllers call `MoneyInput::replaceInRequest()`, `replaceRowsInRequest()`, and `replaceArrayInRequest()` before validation.
  - A Blade directive exposes consistent display formatting for money inputs.
- Test atau quality check yang membuktikannya:
  - `tests/Feature/LovableCrudParityTest.php` posts formatted amounts such as `1.000`, `10.000`, and `5.000`, then asserts successful redirects and database writes.
  - `php artisan test` passed.
- Contoh generik:

```php
final class NumberInput
{
    public static function normalize(mixed $value): float
    {
        if ($value === null || $value === '') {
            return 0;
        }

        $clean = preg_replace('/[^\d,.-]/', '', (string) $value) ?: '';

        if (str_contains($clean, ',')) {
            $clean = str_replace('.', '', $clean);
            $clean = str_replace(',', '.', $clean);
        }

        return is_numeric($clean) ? (float) $clean : 0;
    }
}
```

- Konflik dengan standar global saat ini: Partial conflict if copied as controller mutation. `laravel:form-requests` prefers `prepareForValidation()` for new or heavily edited workflows. The reusable rule should be the normalization principle and helper shape, not the controller-inline request mutation.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - Currency symbol, decimal separator, and thousands separator defaults.
  - Blade directives named `money` or `moneyInput`.
- Rekomendasi: `revise`.

## Proposal 4: Wrap Multi-Record Financial/Counter Mutations In Transactions With Reversal Helpers

- Nama aturan: Atomic write workflows that update balances/counters must use transactions and deterministic reverse/apply operations.
- Kategori aturan: Transactions, data consistency, domain service boundaries.
- Stage 2 candidate classification: `UPDATE` to `laravel:database-transactions` and `laravel:actions-and-services`.
- Alasan: Workflows that create/update/delete records and adjust derived balances must not partially succeed. Reverse/apply helpers make update and delete flows explicit and testable.
- Bukti penerapan dalam proyek:
  - `app/Support/Ledger.php` owns account balance effects for transactions and transfers.
  - Transfer, transaction, income, expense, branch quick-add, and debt payment flows wrap multi-write effects in `DB::transaction()`.
  - Update/delete flows reverse previous ledger effects before applying new state or deleting records.
- Test atau quality check yang membuktikannya:
  - `tests/Feature/LovableCrudParityTest.php` covers bulk income with tax child transaction, bulk expense, quick add, transfer, debt payment with generated transaction, and transaction delete.
  - `php artisan test` passed.
- Contoh generik:

```php
DB::transaction(function () use ($record, $data) {
    BalanceLedger::apply($record, -1);

    $record->update($data);

    BalanceLedger::apply($record);
});
```

- Konflik dengan standar global saat ini:
  - `laravel:database-transactions` says transaction boundaries usually belong inside Actions or Services, not spread across controllers.
  - Shared counter/balance updates may need row locks for concurrent production writes; this project does not currently prove lock behavior.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - Ledger naming and whether income increases or decreases an account.
  - Tax child transaction behavior and debt payment descriptions.
- Rekomendasi: `revise`.

## Proposal 5: Add Feature Parity Tests When Porting A UI/App Into Laravel

- Nama aturan: Conversion/rebuild projects need at least one route-level parity test for critical user flows.
- Kategori aturan: Testing, migration/rebuild safety.
- Stage 2 candidate classification: `UPDATE` to `laravel:testing`.
- Alasan: When converting from another implementation, parity tests catch missing routes, validation mismatches, redirects, database writes, and important generated side effects before the new Laravel app is considered done.
- Bukti penerapan dalam proyek:
  - `tests/Feature/LovableCrudParityTest.php` exercises the converted CRUD flows across branches, users, income, expense, quick add, budgets, transfers, debts, transaction deletion, and CSV report export.
- Test atau quality check yang membuktikannya:
  - The parity test passed as part of `php artisan test`.
- Contoh generik:

```php
public function test_converted_core_workflows_match_expected_laravel_behavior(): void
{
    $this->actingAs($this->adminUser())
        ->post(route('records.store'), [
            'name' => 'QA Record',
            'amount' => '1.000',
        ])
        ->assertRedirect(route('records.index'))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('records', ['name' => 'QA Record']);
}
```

- Konflik dengan standar global saat ini: No conflict. `laravel:testing` already mentions parity tests for rebuilding/porting an app. This project strengthens it with a tested example.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - The exact checklist of converted flows from Lovable.
  - Route names and seed data used for this app.
- Rekomendasi: `accept`.

## Proposal 6: Test Authorization Invariants With Both Positive And Negative Paths

- Nama aturan: Permission systems must test allowed paths, denied paths, and non-reducible privileged roles.
- Kategori aturan: Security, authorization testing.
- Stage 2 candidate classification: `UPDATE` to `laravel:security` and `laravel:testing`.
- Alasan: Permission bugs often appear in edge cases: users who can read but not write, delegated permissions, protected privileged roles, and attempts to assign forbidden roles.
- Bukti penerapan dalam proyek:
  - `tests/Feature/CategoryManagementTest.php` covers read-only access, delegated category permissions, permission assignment denial, full-access roles that cannot be reduced, and prevention of modifying super-admin users.
  - `app/Models/Role.php` centralizes permission checks in `hasPermission()`.
  - `app/Http/Middleware/EnsureRolePermission.php` blocks users without a role or required permission.
- Test atau quality check yang membuktikannya:
  - Category authorization tests passed as part of `php artisan test`.
- Contoh generik:

```php
public function test_read_only_user_cannot_mutate_records(): void
{
    $this->actingAs($this->userWithPermissions(['record.read']))
        ->post(route('records.store'), ['name' => 'Blocked'])
        ->assertForbidden();

    $this->assertDatabaseMissing('records', ['name' => 'Blocked']);
}
```

- Konflik dengan standar global saat ini: No conflict. This is a concrete testing expansion of the current access-control standard.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - Which roles are always full access.
  - Which role slugs cannot be modified by which operators.
- Rekomendasi: `accept`.

## Proposal 7: Keep Eloquent Model Contracts Explicit And Query Loading Visible

- Nama aturan: Models should declare fillable fields, casts, typed relationships, and controllers should eager load view/report relation graphs.
- Kategori aturan: Eloquent, query shape.
- Stage 2 candidate classification: `DUPLICATE`.
- Alasan: This is already a good reusable standard, and this project follows it in enough places to confirm the current rule.
- Bukti penerapan dalam proyek:
  - Models define `$fillable`, `casts()`, and typed relationships such as `BelongsTo`, `HasMany`, and `BelongsToMany`.
  - Controllers eager load relations for index, dashboard, report, transaction, transfer, debt, and branch views.
- Test atau quality check yang membuktikannya:
  - Feature tests render route responses and perform database assertions through these models.
  - `php artisan test` passed.
- Contoh generik:

```php
class Record extends Model
{
    protected $fillable = ['tenant_id', 'name', 'total'];

    protected function casts(): array
    {
        return ['total' => 'decimal:2'];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

- Konflik dengan standar global saat ini: Already covered by `laravel:eloquent-patterns`; no new global rule needed.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - Domain-specific accessors such as current balance calculations.
- Rekomendasi: `accept` as confirmation, not as a new rule.

## Proposal 8: Project-Specific Display Ordering And Friendly Messages Stay Local

- Nama aturan: Do not promote domain-specific display ordering, labels, or localized copy into global Laravel standards.
- Kategori aturan: Project-only conventions, documentation hygiene.
- Stage 2 candidate classification: `PROJECT_ONLY`.
- Alasan: The app has useful local support classes, but their values encode this product's UI and domain vocabulary. They are not reusable Laravel standards.
- Bukti penerapan dalam proyek:
  - `app/Support/LovableOrder.php` contains app-specific account/category ordering.
  - `app/Support/FriendlyMessage.php` maps validation/status copy to Indonesian app wording.
  - `AppServiceProvider` registers app-specific Blade display directives and global branding composer.
- Test atau quality check yang membuktikannya:
  - These surfaces are indirectly exercised by feature tests, but no dedicated reusable helper tests exist.
  - `vendor\bin\pint --test` currently fails, so these files also need style cleanup before being used as examples.
- Contoh generik:

```php
// Project AGENTS.md only:
// Keep product-specific option ordering in a local Support class or config file.
// Do not copy the values into global Laravel skills.
```

- Konflik dengan standar global saat ini: Global standards already warn against importing client names, business rules, provider quirks, and project-specific copy.
- Keputusan yang sebaiknya hanya masuk `AGENTS.md` proyek:
  - Account/category order.
  - Indonesian labels and validation copy.
  - Branding defaults and app title/subtitle.
- Rekomendasi: `reject` for global standards; keep as project convention.

## Proposed Stage 2 Output Shape

When this proposal is compared against `syarif-laravel-standards`, move only sanitized deltas into a pending proposal repository. Suggested grouping:

- `UPDATE laravel:security`: route-level permission maps, positive/negative authorization invariant tests.
- `NEW or UPDATE laravel:security`: tenant/resource scoped validation for submitted foreign keys.
- `UPDATE laravel:form-requests`: human-formatted numeric normalization before numeric rules, preferably via `prepareForValidation()`.
- `UPDATE laravel:database-transactions`: reverse/apply balance helpers are acceptable when paired with transactions, but production-grade standards should mention Action/Service placement and locks for shared counters.
- `UPDATE laravel:testing`: parity tests for converted apps are required for critical workflows.
- `DUPLICATE laravel:eloquent-patterns`: no change unless another project shows a missing nuance.
- `PROJECT_ONLY/REJECT`: display ordering, role slugs, Indonesian route names, app copy, and branding defaults.

## Sanitization Checklist

- Removed business-specific names from generic examples.
- Avoided copying route names, role slugs, menu labels, and UI copy into global examples.
- Kept financial ledger details generic as balance/counter mutation patterns.
- No secrets, credentials, URLs, or private identifiers included.
