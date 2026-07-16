# Final Laravel Standards Proposal

Source audit: `docs/standards-proposal.md`

Target repository: `syarif-laravel-standards`

Status: proposal only. Do not apply to global skills yet.

Comparison baseline:

- `laravel:using-laravel-superpowers`
- `laravel:controller-cleanup`
- `laravel:controller-tests`
- `laravel:tdd-with-pest`
- `laravel:ports-and-adapters`
- `laravel:http-client-resilience`
- `laravel:performance-select-columns`
- `laravel:performance-eager-loading`
- `laravel:performance-caching`
- `laravel:exception-handling-and-logging`
- `laravel:routes-best-practices`
- `skill-creator`

Quality evidence from source project:

- `php artisan test` passed: 19 tests, 56 assertions.
- `npm run build` passed during the admin performance pass.
- `vendor/bin/pint --test` still reports existing style issues in `app/Http/Controllers/CheckoutController.php` and `app/Models/Coupon.php`; do not use this project as proof for a global "Pint clean" standard until those files are fixed.

## Classification Summary

| Proposal | Classification | Final recommendation | Target |
| --- | --- | --- | --- |
| External Integrations Belong In Small Services | UPDATE | Accept as refinement | Global standard |
| Use Feature Workflow Tests For User-Facing Flows | UPDATE | Accept as refinement | Global standard |
| Select Columns Explicitly On Admin Listings | DUPLICATE | Do not add as a new rule | Already covered globally |
| Cache Database-Backed Singleton Settings With Explicit Invalidation | UPDATE | Accept as refinement | Global standard |
| Use Structured Logs Around External Integrations | UPDATE | Revise, then accept | Global standard |
| Prefer Route-Cache-Safe Controllers For Public Utility Endpoints | UPDATE | Revise, then accept | Global standard |
| Keep JavaScript Page-Swap/Prefetch Behavior Project-Local | PROJECT_ONLY | Do not promote globally | Project `AGENTS.md` only |
| Keep Provider-Specific Payment And Message Copy Out Of Global Skills | NEW | Accept as standards-repo governance | Global standards repo |

## 1. External Integrations Belong In Small Services

Classification: UPDATE

Category: Architecture / Integration boundary

Existing global coverage:

- `laravel:controller-cleanup` already recommends small Actions/Services.
- `laravel:ports-and-adapters` already covers stable interfaces and adapters for external systems.
- `laravel:http-client-resilience` already covers outbound HTTP predictability and observability.

Why this is an update:

The existing global skills cover the pieces, but they do not explicitly define the middle path used in this project: start with a small integration service, then promote to a port/adapter only when multiple providers, framework-independent domain code, or provider swapping makes the extra interface useful.

Evidence in this project:

- `app/Services/DokuService.php`
- `app/Services/WhatsAppService.php`
- `app/Services/CartService.php`
- Controllers inject services instead of building provider payloads inline.

Quality check:

- `tests/Feature/CommerceTest.php` covers checkout/payment-link behavior with `Http::fake()`.
- `tests/Feature/WhatsAppConnectionTest.php` covers WhatsApp proxy behavior with `Http::fake()` and `Http::assertSent()`.
- `php artisan test` passed.

Ready-to-move standard text:

```md
## External Integration Boundary

Keep provider calls in focused services or adapters, not controllers, jobs, route files, or Blade templates.

- Use a small service when the app talks to one provider and the integration is not a domain abstraction yet.
- Use a port/interface plus adapters when the domain should not know the provider, when multiple providers are likely, or when provider selection is configuration-driven.
- Keep signatures, payload mapping, retries, response parsing, and provider error handling inside the integration boundary.
- Test user-facing flows with HTTP fakes and assert the outbound request shape when regressions would affect customers.
```

Generic example:

```php
final class GatewayService
{
    public function createPayment(Order $order): string
    {
        $response = Http::baseUrl(config('services.gateway.url'))
            ->timeout(5)
            ->retry(2, 200, throw: false)
            ->post('/payments', [
                'invoice' => $order->invoice_number,
                'amount' => $order->total,
            ]);

        throw_unless($response->successful(), RuntimeException::class);

        return $response->json('payment_url');
    }
}
```

Conflict with current standards:

- No conflict. This refines `controller-cleanup`, `ports-and-adapters`, and `http-client-resilience`.

Project-only notes:

- DOKU target paths, signature format, WhatsApp copy, and source project statuses must stay out of global standards.

## 2. Use Feature Workflow Tests For User-Facing Flows

Classification: UPDATE

Category: Testing / Regression safety

Existing global coverage:

- `laravel:controller-tests` already recommends HTTP assertions and keeping heavy logic in Actions/Services.
- `laravel:tdd-with-pest` already recommends feature tests for HTTP/controllers.

Why this is an update:

The existing skills mention feature tests broadly. This proposal adds a reusable convention for customer/admin workflows that cross routes, sessions, database writes, redirects, and outbound integrations.

Evidence in this project:

- `tests/Feature/CommerceTest.php`
- `tests/Feature/AdminProfileTest.php`
- `tests/Feature\SeederTest.php`
- `tests/Feature/WhatsAppConnectionTest.php`

Quality check:

- `php artisan test` passed.

Ready-to-move standard text:

```md
## Workflow Tests For User-Facing Flows

For checkout, account, admin, notification, and other user-facing workflows, prefer feature tests that exercise the route and framework behavior end to end.

- Cover middleware, session state, validation, redirects, database writes, and response output.
- Use `Http::fake()` for external calls and assert important outbound payload fields with `Http::assertSent()`.
- Keep exact brand copy assertions local unless the copy is part of a contractual or customer-critical behavior.
```

Generic example:

```php
Http::fake([
    'https://api.example.test/send' => Http::response(['ok' => true]),
]);

$this->actingAs($admin)
    ->patch(route('orders.update', $order), [
        'status' => 'shipped',
        'tracking_number' => 'ABC123',
    ])
    ->assertSessionHasNoErrors()
    ->assertRedirect();

Http::assertSent(fn ($request) => str_contains($request['message'], 'ABC123'));
```

Conflict with current standards:

- No conflict. This sharpens the existing testing guidance.

Project-only notes:

- Exact customer message wording belongs in the project.

## 3. Select Columns Explicitly On Admin Listings

Classification: DUPLICATE

Category: Performance / Eloquent querying

Existing global coverage:

- `laravel:performance-select-columns` already says to select only required columns for base queries and relations.
- `laravel:performance-eager-loading` already says to select required relation columns and avoid N+1 queries.

Why this is duplicate:

The proposal is correct, proven, and reusable, but the current global skill already covers it directly.

Evidence in this project:

- Admin order, product, coupon, and dashboard queries select only table/detail fields used by the views.

Quality check:

- `php artisan test` passed after the query changes.

Ready-to-move action:

Do not add a new standalone rule. If the standards repository has examples, this can be used as an example under the existing select-columns standard.

Generic example already covered:

```php
$orders = Order::query()
    ->select(['id', 'invoice_number', 'total', 'status', 'created_at'])
    ->latest()
    ->paginate(20);
```

Conflict with current standards:

- No conflict.

Project-only notes:

- Which columns a Blade table needs is project-specific.

## 4. Cache Database-Backed Singleton Settings With Explicit Invalidation

Classification: UPDATE

Category: Performance / Configuration

Existing global coverage:

- `laravel:performance-caching` already covers stable keys, scope dimensions, and explicit invalidation.
- `laravel:constants-and-configuration` includes settings/cache examples, but not as a concise singleton-settings convention.

Why this is an update:

The existing caching standard is broad. This proposal adds a common Laravel pattern for database-backed singleton settings shared across many views.

Evidence in this project:

- `app/Models/SiteSetting.php` has `current()`, `clearCache()`, and `defaultInstance()`.
- `app/Providers/AppServiceProvider.php` shares cached settings with views.
- Admin settings and promo writes call `SiteSetting::clearCache()`.

Quality check:

- `tests/Feature/CommerceTest.php` verifies settings update, homepage section update, and favicon upload behavior.
- `php artisan test` passed.

Ready-to-move standard text:

```md
## Database-Backed Singleton Settings

For low-frequency settings shared across many requests, use a stable cache key and explicit invalidation after writes.

- Keep cache access behind a model method or small settings service.
- Provide an explicit `clearCache()` or equivalent invalidation method.
- Include tenant, locale, team, or user scope in the key when settings are not truly global.
- Do not cache highly dynamic settings without a freshness plan.
```

Generic example:

```php
final class AppSetting extends Model
{
    private const CACHE_KEY = 'app_settings:current';

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

Conflict with current standards:

- No conflict.
- Caveat: this must not override the global warning about scoped cache keys.

Project-only notes:

- Branding fields, section names, fallback copy, and promo behavior belong to the project.

## 5. Use Structured Logs Around External Integrations

Classification: UPDATE

Category: Observability / Debugging

Existing global coverage:

- `laravel:exception-handling-and-logging` already says to add structured context and avoid secrets.
- `laravel:http-client-resilience` already says to add request/response context to logs and redact sensitive data.

Why this is an update:

The existing guidance is broad. This proposal adds a specific integration-debugging pattern: log high-risk provider transitions with local IDs, provider IDs, status codes, and sanitized summaries.

Evidence in this project:

- `app/Services/DokuService.php`
- `app/Http/Controllers/CheckoutController.php`
- `app/Http/Controllers/PaymentNotificationController.php`
- `app/Services/WhatsAppService.php`

Quality check:

- Workflow tests cover the surrounding integration behavior.
- Logs themselves are not asserted, so this should be accepted as a revised standard rather than as fully proven logging-test guidance.

Ready-to-move standard text:

```md
## Structured Logs For External Integrations

Log important integration transitions with structured context that helps production debugging without exposing secrets.

- Include local IDs, public IDs, provider IDs, status codes, target operation names, and sanitized response summaries.
- Do not log tokens, signatures, card data, full payment payloads, or unnecessary PII.
- Prefer stable event names that make logs searchable across a single workflow.
- Add tests for behavior; assert logs only when the log entry itself is part of the expected contract or incident workflow.
```

Generic example:

```php
Log::info('payment.gateway.create.completed', [
    'order_id' => $order->id,
    'invoice_number' => $order->invoice_number,
    'provider_status' => $response->status(),
]);
```

Conflict with current standards:

- No conflict.

Project-only notes:

- Project prefixes such as `TRANSACTION_FLOW`, provider field names, and WhatsApp status labels belong in project docs.

## 6. Prefer Route-Cache-Safe Controllers For Public Utility Endpoints

Classification: UPDATE

Category: Routing / Deployment readiness

Existing global coverage:

- `laravel:routes-best-practices` already says routes should map to controllers and notes route caching.
- `laravel:controller-cleanup` already recommends invokable controllers for one-off endpoints.

Why this is an update:

The source proposal turns an existing general rule into a deployment-readiness convention for small public utility endpoints that still need Laravel behavior.

Evidence in this project:

- `app/Http/Controllers/CsrfTokenController.php`
- `/csrf-token` route maps to an invokable controller.

Quality check:

- `tests/Feature/CommerceTest.php` verifies JSON response and no-store cache headers.
- `php artisan test` passed.

Ready-to-move standard text:

```md
## Route-Cache-Safe Utility Endpoints

For committed production endpoints, prefer controller actions over route closures when the endpoint needs framework behavior, tests, middleware, sessions, cache headers, or deployment route caching.

- Use invokable controllers for focused one-off endpoints.
- Keep route closures limited to static views, redirects, prototypes, or temporary debugging.
- Do not force every simple static page into a controller.
```

Generic example:

```php
Route::get('/csrf-token', CsrfTokenController::class)->name('csrf-token');

final class CsrfTokenController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()
            ->json(['token' => csrf_token()])
            ->header('Cache-Control', 'no-store');
    }
}
```

Conflict with current standards:

- No conflict if phrased as a production/deployment guideline.
- Potential conflict if phrased as "never use route closures"; the existing route standard allows closures for static views, redirects, temporary debugging, and prototypes.

Project-only notes:

- The stale-CSRF add-to-cart workaround is project-specific.

## 7. Keep JavaScript Page-Swap/Prefetch Behavior Project-Local

Classification: PROJECT_ONLY

Category: Frontend UX / Project convention

Existing global coverage:

- No installed Laravel skill currently standardizes admin page-swap or prefetch behavior.

Why this should remain project-only:

The implementation depends on this app's admin layout, route shape, runtime scripts, and pages that are safe to swap. Promoting it globally could break pages with polling, uploads, third-party widgets, previews, or page-specific event state.

Evidence in this project:

- `resources/js/app.js`
- `resources/views/layouts/admin.blade.php`
- `resources/css/app.css`

Quality check:

- `npm run build` passed.
- No browser or E2E test currently proves runtime navigation behavior.

Ready-to-move action:

Do not add this to global Laravel standards. Store as a project convention only if the project keeps the pattern.

Suggested project `AGENTS.md` text:

```md
## Admin Page Prefetch

This project uses admin-only HTML prefetch/page swapping for perceived navigation speed. Keep exclusions for pages with complex runtime state, file previews, polling, third-party widgets, or forms that should perform a full page load.
```

Conflict with current standards:

- Potential conflict with general frontend reliability if used blindly.

Project-only notes:

- Route exclusions and swap-safe selectors belong in this project.

## 8. Keep Provider-Specific Payment And Message Copy Out Of Global Skills

Classification: NEW

Category: Standards governance / Scope control

Existing global coverage:

- `skill-creator` says skills should contain only essential information for the job and should avoid unnecessary context.
- The Laravel skills do not currently state a direct scope rule for excluding project-specific provider details from global Laravel standards.

Why this is new:

This is not a Laravel coding pattern; it is a standards-repository hygiene rule. It prevents reusable Laravel standards from absorbing one project's payment provider quirks, brand voice, staging problems, and message copy.

Evidence in this project:

- DOKU request paths, signatures, payment status mapping, and check-status fallbacks live in project services.
- WhatsApp message bodies live in the project service and tests.

Quality check:

- Feature tests verify project behavior, but that does not make the provider details reusable.

Ready-to-move standard text:

```md
## Scope Boundary For Laravel Standards

Promote reusable patterns, not project-specific business details.

- Global standards may describe boundaries, testing strategy, logging shape, caching shape, and Laravel conventions.
- Keep provider-specific payload fields, exact customer message copy, brand tone, staging URLs, operational workarounds, and XAMPP or local environment quirks in project docs or project tests.
- When a project proves a pattern, extract the generic rule and replace proper nouns with neutral examples before promoting it.
```

Generic example:

```php
// Promote this:
// "Keep provider payload mapping inside an integration service."

// Do not promote this:
// "Use ProviderX target path /checkout-link-v2 with BrandY WhatsApp wording."
```

Conflict with current standards:

- No conflict.

Project-only notes:

- DOKU notes, WhatsApp copy, staging incidents, XAMPP warnings, and source project admin UX preferences belong in this project's `AGENTS.md`.

## Final Move Plan

Recommended changes for `syarif-laravel-standards`:

1. Add the UPDATE rules as refinements under existing standards, not as duplicate standalone skills:
   - External Integration Boundary
   - Workflow Tests For User-Facing Flows
   - Database-Backed Singleton Settings
   - Structured Logs For External Integrations
   - Route-Cache-Safe Utility Endpoints
2. Do not add a new select-columns rule; reference the current global select-columns/eager-loading guidance.
3. Do not promote the admin page-swap/prefetch JavaScript behavior globally.
4. Add the NEW scope-boundary rule as repository governance for future standards extraction.
5. Before applying globally, decide whether `syarif-laravel-standards` stores these as one consolidated Laravel standards skill or as smaller reference files loaded by a concise SKILL.md.

## External Reference Intake: Laravel Service Classes

Reference:

- Zulfikar Ditya, "How to Use Service Classes in Laravel 12 for a Clean and Maintainable Codebase", Medium, 18 Mar 2025: `https://medium.com/@zulfikarditya/how-to-use-service-classes-in-laravel-12-for-a-clean-and-maintainable-codebase-8dcad19bec72`

Useful ideas to promote:

- Keep controllers thin: receive HTTP requests, call a service, return an HTTP response.
- Put validation and authorization in `FormRequest` classes before calling services.
- Put reusable business operations in domain-named service classes under `app/Services`.
- Use constructor injection so controllers depend on explicit collaborators.
- Bind interfaces to implementations in a service provider when an abstraction is truly useful.
- Wrap multi-model writes in `DB::transaction()` inside the service boundary.
- Dispatch events from services after meaningful domain actions, preferably after writes succeed.
- Unit test service behavior separately when the logic is complex, and keep feature tests around the user-facing route.

Validated local command notes:

- This project runs Laravel 12.63.0.
- `php artisan make:class` exists for generating service classes.
- `php artisan make:interface` exists for service contracts.
- `php artisan make:provider` exists for explicit binding providers.

Do not promote blindly:

- Do not require an interface for every service class. Use interfaces when there are multiple implementations, provider swapping, a stable domain port, or meaningful test isolation.
- Do not require repositories by default. Prefer Eloquent directly in services until repeated query behavior, storage swapping, or complex data access justifies a repository.
- Do not put validation inside services when the input comes from HTTP; keep HTTP validation in Form Requests and let services enforce domain invariants.
- Do not create a generic `ServiceServiceProvider` name. Prefer clear names such as `IntegrationServiceProvider`, `DomainServiceProvider`, or use `AppServiceProvider` for small apps.

Ready-to-move standard text:

```md
## Controller-Service Workflow

For non-trivial Laravel workflows, structure the request path as Controller -> FormRequest -> Service -> Model/Integration.

- Keep controllers focused on HTTP orchestration: authorize/validate through Form Requests, call a service, return a response.
- Put reusable business operations in service classes named after the domain workflow.
- Use constructor injection for service dependencies.
- Add an interface only when the service represents a stable port, has multiple implementations, or benefits from provider swapping.
- Wrap multi-write operations in transactions at the service boundary.
- Dispatch events from services after successful domain actions.
- Test the route with feature tests and the service with unit tests when logic is complex.
```

Generic example:

```php
final class RegisterCustomerService
{
    public function register(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            $customer = Customer::create([
                'name' => $data['name'],
                'email' => $data['email'],
            ]);

            CustomerRegistered::dispatch($customer);

            return $customer;
        });
    }
}

final class CustomerController extends Controller
{
    public function store(StoreCustomerRequest $request, RegisterCustomerService $service): RedirectResponse
    {
        $customer = $service->register($request->validated());

        return redirect()->route('customers.show', $customer);
    }
}
```

Classification:

- UPDATE to `External Integrations Belong In Small Services`
- UPDATE to `Use Feature Workflow Tests For User-Facing Flows`
- NEW candidate for a dedicated `Controller-Service Workflow` rule in `syarif-laravel-standards`
