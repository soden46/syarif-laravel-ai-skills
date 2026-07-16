# Final Proposal For syarif-laravel-standards

Audit date: 2026-07-16

Source proposal:
- `docs/2026-07-laravel-render-report-testing-pattern.md`

Comparison baseline:
- Installed global Laravel skills under `C:\Users\SYARIF\.agents\skills`.
- Local repository/folder named `syarif-laravel-standards` was not found during this audit.
- No global skill or standard was modified.

Validation snapshot from source project:
- `php artisan test`: passed, 5 tests, 11 assertions.
- `vendor\bin\pint --test`: failed, 223 files checked, 210 style issues.
- Non-blocking local warnings: missing PHP `imagick` extension and deprecated PHPUnit XML schema.

## Classification Summary

| Rule | Classification | Move to syarif-laravel-standards? |
| --- | --- | --- |
| Build lightweight in-memory relation graphs for pure render and redirect tests | NEW | Yes |
| Test reports and PDFs at both the HTML contract and artifact level | NEW | Yes |
| Prepare relation graphs explicitly before rendering views, reports, or PDFs | UPDATE | Yes, as a narrower addition to eager-loading guidance |
| Assert redirect targets with named routes | UPDATE | Yes, as a testing addition to route guidance |
| Keep bounded UI/validation options in one source of truth | UPDATE | Yes, revised to prefer enums when available |
| Place specific routes before resource routes when URI patterns could collide | NEW | Yes, but add route-list/test verification |
| Inline large validation arrays in controllers | CONFLICT | No |
| Combine database transactions with file cleanup around multi-step writes | UPDATE | Yes, as an enhancement to transactions/filesystem guidance |
| Current project operational notes | PROJECT_ONLY | No, keep in project `AGENTS.md` |
| Actual defect panel names, costs, weights, roles, labels | PROJECT_ONLY | No |
| Whole-repository Pint baseline as a reusable gate for this project | REJECT | No |

## Proposed Standards To Move

### 1. Use In-Memory Relation Graphs Only For Pure Render/Redirect Tests

Classification: NEW

Target section or skill:
- Add to Laravel testing standards.
- Good fit for a custom skill section such as `Testing Lightweight Render Surfaces`.

Reason:
The installed Laravel testing guidance prefers factories and HTTP tests, but it does not explicitly cover fast tests for view/PDF rendering or direct redirect behavior where persistence is not part of the behavior. This is a reusable testing pattern when scoped tightly.

Evidence from source project:
- `tests\Feature\DefectJerseyPdfTest.php:20`
- `tests\Feature\DefectJerseyPdfTest.php:26` to `tests\Feature\DefectJerseyPdfTest.php:44`
- `tests\Feature\SpkScanTest.php:15` to `tests\Feature\SpkScanTest.php:21`

Proof:
- `php artisan test` passed.
- Covered by `DefectJerseyPdfTest`.
- Covered by `SpkScanTest`.

Standard text:

```md
For tests that only render a Blade view, render a PDF view, or verify narrow redirect behavior, you may build unsaved Eloquent model graphs with `forceFill()` and `setRelation()`.

Use this only when persistence, middleware, authorization, route model binding, database constraints, query behavior, and events are not part of the behavior under test.

Prefer factories and database-backed feature tests when the behavior depends on database writes or framework request lifecycle behavior.
```

Generic example:

```php
$customer = (new Customer)->forceFill([
    'name' => 'Acme',
]);

$order = (new Order)->forceFill([
    'number' => 'SO-001',
]);

$order->setRelation('customer', $customer);

$html = view('reports.order', [
    'order' => $order,
])->render();

$this->assertStringContainsString('SO-001', $html);
```

Conflict notes:
- Not a replacement for the existing factory-first guidance.
- No conflict if the scope limitation is included.

### 2. Test Generated Documents At The Contract And Artifact Levels

Classification: NEW

Target section or skill:
- Add to Laravel testing standards.
- Could live near controller/report/PDF testing guidance.

Reason:
Existing standards mention controller tests and quality gates, but do not define a reusable pattern for generated documents. Testing both stable rendered content and artifact validity catches different failure modes.

Evidence from source project:
- `tests\Feature\DefectJerseyPdfTest.php:62`
- `tests\Feature\DefectJerseyPdfTest.php:63`
- `tests\Feature\DefectJerseyPdfTest.php:67` to `tests\Feature\DefectJerseyPdfTest.php:72`
- `tests\Feature\DefectJerseyDashboardTest.php:16` to `tests\Feature\DefectJerseyDashboardTest.php:17`

Proof:
- `php artisan test` passed.
- Covered by `DefectJerseyPdfTest`.
- Covered by `DefectJerseyDashboardTest`.

Standard text:

```md
For generated documents such as PDFs, reports, exports, or printable views, assert two things:

1. The rendered HTML or source view contains stable contract text/data.
2. The generated artifact is valid enough for the generator being used, such as checking a PDF output starts with `%PDF-`.

Avoid full HTML snapshots unless the project has a deliberate snapshot or visual-regression workflow.
```

Generic example:

```php
$viewData = [
    'invoice' => $invoice,
];

$html = view('reports.invoice', $viewData)->render();
$output = Pdf::loadView('reports.invoice', $viewData)->output();

$this->assertStringContainsString('Invoice Number', $html);
$this->assertStringContainsString('SO-001', $html);
$this->assertStringStartsWith('%PDF-', $output);
```

Conflict notes:
- No conflict with installed standards.

### 3. Make View/Report/PDF Relation Dependencies Explicit

Classification: UPDATE

Target section or skill:
- Update `laravel:performance-eager-loading` style guidance in the custom standards repo.
- Do not modify upstream/built-in superpowers skills directly.

Reason:
The old standard already says to use `with()`, `load()`, and `loadMissing()` to prevent N+1 queries. This proposal narrows that guidance for render surfaces: controllers/report builders should declare the relation graph needed by Blade/PDF templates before rendering.

Evidence from source project:
- `app\Http\Controllers\DefectJerseyController.php:61`
- `app\Http\Controllers\DefectJerseyController.php:184`
- `app\Http\Controllers\DefectJerseyController.php:298`
- `app\Http\Controllers\DefectJerseyController.php:497`
- Similar pattern in `SuratJalanController`, `PdfController`, and `LaporanPrintingController`.

Proof:
- `php artisan test` passed.
- Covered indirectly by dashboard and PDF render tests.

Standard text:

```md
Before rendering Blade reports, printable views, exports, or PDFs, explicitly load the relation graph that the template needs in the controller, query object, action, or report builder.

Do not add new relation dependencies inside templates without updating the load list and adding or adjusting a render test.
```

Generic example:

```php
public function pdf(Invoice $invoice)
{
    $invoice->load([
        'customer',
        'items.product',
        'payments',
    ]);

    return Pdf::loadView('reports.invoice', [
        'invoice' => $invoice,
    ])->stream("invoice-{$invoice->id}.pdf");
}
```

Conflict notes:
- Duplicate at the broad eager-loading level, but useful as an UPDATE because it names render/PDF surfaces and test expectations.

### 4. Assert Redirect Targets With Named Routes

Classification: UPDATE

Target section or skill:
- Update route testing guidance.

Reason:
The old route standard already recommends named routes, but it does not explicitly say to assert redirect targets using `route(...)`. This is a small but reusable testing refinement.

Evidence from source project:
- `app\Http\Controllers\SpkController.php:65`
- `tests\Feature\SpkScanTest.php:25` to `tests\Feature\SpkScanTest.php:28`

Proof:
- `php artisan test` passed.
- Covered by `SpkScanTest`.

Standard text:

```md
When testing redirect behavior to a named route, compare the target URL against `route('name', [...])` instead of hardcoding generated URLs.

Use full HTTP tests when auth, middleware, route model binding, sessions, or policies are part of the behavior.
```

Generic example:

```php
$response = app(OrderScanController::class)->show($order);

$this->assertSame(
    route('orders.index', ['search' => 'SO-001']),
    $response->getTargetUrl()
);
```

Conflict notes:
- Complements route standards; no conflict.

### 5. Keep Bounded Options In One Source Of Truth

Classification: UPDATE

Target section or skill:
- Update constants/configuration standards.

Reason:
The old constants standard already covers constants, enums, config files, and validation constants. This proposal refines it for bounded UI/validation options used across validation, accessors, labels, and views.

Evidence from source project:
- `app\Models\DefectJerseyBatchItem.php:27`
- `app\Models\DefectJerseyBatchItem.php:39`
- `app\Http\Controllers\DefectJerseyController.php:338`
- `resources\views\bebas_cetak\pdf\defect-jersey-batch.blade.php:42`
- `resources\views\bebas_cetak\laporan\defect-jersey-dashboard.blade.php:87`

Proof:
- `php artisan test` passed.
- Covered indirectly by render tests, but not directly exhaustive.

Revised standard text:

```md
For bounded application choices used by validation and display, keep allowed values and labels in one source of truth.

Prefer PHP enums when the project PHP version and existing conventions support them.
Use class/model constants for small model-owned maps in older Laravel/PHP projects.
Use config files for environment-level or deployment-level options.

Do not duplicate option values across controllers, Blade templates, JavaScript, and validation rules.
```

Generic example:

```php
enum OrderStatus: string
{
    case Draft = 'draft';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Confirmed => 'Confirmed',
            self::Cancelled => 'Cancelled',
        };
    }
}

$request->validate([
    'status' => ['required', Rule::enum(OrderStatus::class)],
]);
```

Fallback example for PHP/projects without enums:

```php
class OrderItem extends Model
{
    public const STATUSES = [
        'draft' => 'Draft',
        'confirmed' => 'Confirmed',
        'cancelled' => 'Cancelled',
    ];

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}

$request->validate([
    'status' => ['required', Rule::in(array_keys(OrderItem::STATUSES))],
]);
```

Conflict notes:
- Do not preserve the source project's actual `PANELS` values in global standards; those are business logic.
- Prefer enum-first wording to avoid weakening existing constants/configuration guidance.

### 6. Put Collision-Prone Specific Routes Before Resource Routes

Classification: NEW

Target section or skill:
- Add to route standards.

Reason:
The old route standard covers clean route declarations and named routes, but does not explicitly call out Laravel's order-sensitive matching when resource routes can capture static segments.

Evidence from source project:
- `routes\web.php:106` to `routes\web.php:108`
- `routes\web.php:110`

Proof:
- `php artisan test` passed.
- No direct route-collision test exists in the source project.

Standard text:

```md
Define static or more-specific routes before broad resource routes when URI patterns could collide.

After adding collision-prone routes, verify the route table with `php artisan route:list` and add a route or feature test when the route is critical.
```

Generic example:

```php
Route::get('invoices/multiple-payment', [InvoiceController::class, 'multiplePayment'])
    ->name('invoices.multiple-payment');

Route::resource('invoices', InvoiceController::class);
```

Suggested verification:

```php
$this->get(route('invoices.multiple-payment'))
    ->assertOk();
```

Conflict notes:
- No conflict.
- Because the source project lacks a direct test, move this as a general Laravel rule with an explicit verification requirement.

### 7. Coordinate Database Transactions With File Cleanup

Classification: UPDATE

Target section or skill:
- Update transaction and filesystem standards.

Reason:
The old transaction standard says to wrap multi-step writes in `DB::transaction()`. The old filesystem standard says to use `Storage`. This proposal adds the missing bridge: database rollbacks do not rollback files, so cleanup must be handled deliberately.

Evidence from source project:
- `app\Http\Controllers\DefectJerseyController.php:353`
- `app\Http\Controllers\DefectJerseyController.php:381`
- `app\Http\Controllers\DefectJerseyController.php:418`
- `app\Http\Controllers\DefectJerseyController.php:471`

Proof:
- `php artisan test` passed.
- No direct rollback/cleanup failure-path test exists.

Standard text:

```md
When a workflow writes database records and files in the same logical operation, account for the fact that database transactions do not rollback filesystem changes.

Track stored file paths during the workflow and delete them if the database transaction fails.
For delete flows, commit database/audit changes first, then delete files after the successful transaction unless the product requires the opposite failure mode.

Add tests for success, failed database write cleanup, and delete cleanup when the flow is important.
```

Generic example:

```php
$storedPaths = [];

try {
    DB::transaction(function () use ($request, &$storedPaths) {
        $order = Order::create([...]);

        foreach ($request->file('attachments', []) as $file) {
            $storedPaths[] = $file->store("orders/{$order->id}", 'public');
        }
    });
} catch (Throwable $exception) {
    Storage::disk('public')->delete($storedPaths);

    throw $exception;
}
```

Conflict notes:
- No conflict.
- This is an UPDATE because it merges existing transaction and filesystem standards into one side-effect consistency rule.

## Do Not Move As Standards

### Inline Large Validation Arrays In Controllers

Classification: CONFLICT

Decision:
- Do not move to `syarif-laravel-standards`.

Reason:
This conflicts with existing Form Request and controller-cleanup guidance.

Existing standards it conflicts with:
- `laravel:form-requests`
- `laravel:controller-cleanup`
- General guidance to avoid fat controllers.

Replacement guidance:

```md
For new or heavily edited flows, move validation and authorization into Form Request classes. Keep controllers focused on orchestration.
```

### Source Project Operational Notes

Classification: PROJECT_ONLY

Decision:
- Do not move to reusable Laravel standards.
- Put in the source project's `AGENTS.md` if desired.

Project-only notes:
- Do not run `vendor\bin\pint` or `vendor\bin\pint --fix` across the whole repository unless explicitly requested.
- Treat `.gitignore` as user-modified in the current worktree unless the user asks to change it.
- Keep source project route/view/domain names such as `bebas_cetak`, `grosir`, and `defect_jersey` local to this project.
- Keep Indonesian report labels local to this project.
- Treat defect panel names, costs, weights, roles, and report labels as business logic.
- Track local environment warnings separately: missing PHP `imagick` extension and deprecated PHPUnit XML schema.

### Whole-Repository Pint Baseline From This Project

Classification: REJECT

Decision:
- Do not move as a reusable standard.

Reason:
The reusable global standard should continue to prefer clean Pint/static-analysis/test gates, but this source project currently has a failing legacy Pint baseline. The local exception belongs in project guidance, not global standards.

## Migration-Ready Patch Plan For syarif-laravel-standards

1. Add a `Testing generated views and documents` section:
   - In-memory relation graphs for pure render/redirect tests.
   - HTML contract plus artifact-level assertions for PDFs/reports.
   - Redirect assertions with named routes.

2. Update Eloquent/rendering guidance:
   - Explicitly load relation graphs before rendering Blade reports, printable views, exports, or PDFs.

3. Update constants/configuration guidance:
   - Add bounded UI/validation options one-source-of-truth rule.
   - Keep enum-first wording, with constants as fallback for older projects.

4. Update routes guidance:
   - Add route-order collision rule.
   - Require route-list or feature-test verification for critical collision-prone routes.

5. Update consistency/filesystem guidance:
   - Add transaction plus filesystem cleanup rule.
   - Require failure-path tests for important flows.

6. Do not add:
   - Inline validation arrays in controllers.
   - Project-specific names, labels, roles, panel maps, costs, or warning workarounds.
   - Local Pint baseline exception.
