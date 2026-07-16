# Laravel Skills Roadmap

Created: 2026-07-16

Purpose: bahan awal untuk skill Laravel berikutnya di repository `syarif-laravel-standards`. File ini menggabungkan hasil audit proyek ini, proposal standar sebelumnya, referensi `asyrafhussin/agent-skills`, dan artikel service class Laravel 12.

References:

- https://github.com/asyrafhussin/agent-skills
- https://medium.com/@zulfikarditya/how-to-use-service-classes-in-laravel-12-for-a-clean-and-maintainable-codebase-8dcad19bec72
- `docs/standards-final-proposal.md`

## Prinsip Utama

Skill Laravel berikutnya harus membantu agent menghasilkan proyek yang:

- controller-nya tipis dan fokus pada HTTP orchestration;
- business workflow ada di service/action class yang reusable;
- validasi dan authorization masuk Form Request, Policy, Gate, atau middleware boundary;
- query dan database schema dibuat dengan performa sadar indeks, eager loading, pagination, dan transaction;
- UI/UX punya standar aksesibilitas, responsive behavior, state feedback, dan polish;
- SEO punya checklist teknis untuk Blade dan Inertia/React;
- testing selalu membuktikan behavior penting melalui feature/unit tests dan Laravel fakes;
- skill tetap modular, ringkas, dan memakai reference files untuk detail panjang.

## Skill Yang Layak Dibuat Atau Ditingkatkan

### 1. `laravel-service-architecture`

Goal: memastikan setiap proyek Laravel memakai pola controller + Form Request + Service/Action class secara konsisten tanpa over-engineering.

Trigger:

- membuat controller CRUD/workflow;
- memindahkan business logic dari controller/model;
- membuat reusable service class;
- merancang struktur aplikasi Laravel baru.

Core rules:

- Controller hanya menerima request, memanggil service/action, lalu mengembalikan response/redirect/resource.
- Form Request menangani validation dan authorization input.
- Service class menangani workflow yang punya business rules, transaksi, integrasi eksternal, file parsing, nomor dokumen, atau side effects.
- Gunakan interface hanya bila ada lebih dari satu implementasi, external provider/port, testing boundary yang jelas, atau kontrak lintas modul. Jangan wajibkan interface untuk service sederhana.
- Repository pattern hanya untuk data-access complexity yang nyata. Jangan bungkus Eloquent CRUD biasa hanya demi pattern.
- Service boleh dispatch event, tapi job/event yang queued harus memakai after-commit saat bergantung pada transaksi.
- Service method harus punya input/output yang jelas. Untuk workflow kompleks, gunakan DTO atau typed array shape yang terdokumentasi.

Suggested structure:

```text
app/
  Http/
    Controllers/
    Requests/
  Services/
    Orders/
      CreateOrderService.php
      CancelOrderService.php
  Actions/
    Orders/
      ApproveOrder.php
  Data/
    Orders/
      CreateOrderData.php
```

Generic controller pattern:

```php
public function store(StoreOrderRequest $request, CreateOrderService $service): RedirectResponse
{
    $order = $service->create($request->validated(), $request->user());

    return redirect()->route('orders.show', $order);
}
```

Generic service pattern:

```php
final class CreateOrderService
{
    public function create(array $data, User $actor): Order
    {
        return DB::transaction(function () use ($data, $actor) {
            $order = Order::create([
                'user_id' => $actor->id,
                'status' => OrderStatus::Draft,
            ]);

            $order->items()->createMany($data['items']);

            return $order->fresh(['items']);
        }, 3);
    }
}
```

Source notes:

- Artikel Medium menekankan service class untuk SRP, controller bersih, reusable logic, testability, injection ke controller, event dispatching, dan transaksi.
- Artikel juga membahas interface dan repository; bagian ini harus diambil selektif, bukan dijadikan kewajiban global.

### 2. `laravel-productivity-stack`

Goal: skill composer yang memilih skill relevan sesuai pekerjaan Laravel.

Core behavior:

- Saat task backend Laravel: aktifkan architecture, form request, authorization, database optimization, testing, quality checks.
- Saat task UI: aktifkan Blade/Inertia, Tailwind, web design/accessibility, Playwright bila perlu.
- Saat task SEO: aktifkan SEO audit/checklist dan performance SEO.
- Saat task performance: aktifkan database optimization, caching, eager loading, queues, frontend build optimization.

Recommended source inspiration from `asyrafhussin/agent-skills`:

- `laravel-best-practices`: architecture, service classes, action classes, DTO, value objects, feature folders, controllers, validation.
- `laravel-testing`: framework detection, HTTP tests, factories, facade fakes.
- `laravel-database-optimization`: N+1, indexing, Redis/cache, cursor pagination, transactions/locking.
- `seo-best-practices`: Core Web Vitals, meta tags, canonical, structured data, Open Graph, mobile-first, Blade vs Inertia detection.
- `web-design-guidelines`: WCAG/accessibility, semantic HTML, keyboard navigation, forms, performance.
- `tailwind-best-practices`: Tailwind version detection, responsive design, dark mode, component variants, spacing/typography.
- `laravel-inertia-react`: Inertia page props, useForm, shared data, layouts, file uploads.
- `technical-debt` and `code-slop`: audit mode for maintainability and AI-generated code smell.

### 3. `laravel-ui-ux-quality`

Goal: menghasilkan UI Laravel yang usable, accessible, dan konsisten.

Core rules:

- Deteksi stack: Blade-only, Blade + Alpine, Livewire, Inertia + React/Vue.
- Gunakan semantic HTML, label form jelas, error state terlihat, focus state keyboard, touch target cukup besar.
- Komponen form harus punya loading/disabled state, validation feedback, old input/preserved state, dan success/error flash.
- Dashboard/admin harus dense tapi scannable, bukan landing-page style.
- Table/list harus punya search/filter/sort/pagination yang ergonomis bila datanya besar.
- Gunakan Tailwind responsive mobile-first dan hindari class arbitrary tanpa alasan.
- Jalankan screenshot/Playwright check untuk perubahan UI besar.

### 4. `laravel-performance-seo`

Goal: menggabungkan backend performance, frontend performance, dan SEO untuk Laravel Blade/Inertia.

Core rules:

- Backend: eager loading, selected columns, `withCount`, indeks sesuai query, cursor pagination untuk dataset besar.
- Database write: transaction pendek, retry deadlock, row lock untuk counter/saldo, idempotent jobs.
- Cache: cache query mahal dengan invalidation jelas; jangan cache data user-sensitive tanpa key yang benar.
- Frontend: image dimension, WebP/AVIF, lazy loading, preload hero/LCP asset, font-display, no layout shift.
- SEO Blade: title, description, canonical, robots, sitemap, semantic heading, JSON-LD.
- SEO Inertia/React: SSR/SSG untuk halaman indexable, `<Head>`, `head-key`, Open Graph/Twitter Card.

### 5. `laravel-project-audit`

Goal: audit lengkap setelah implementasi selesai.

Audit categories:

- architecture: controller/service/request/policy boundaries;
- database: N+1, indexes, migration safety, soft delete/historical data;
- tests: feature tests, service unit tests, fakes, missing denial paths;
- security: authorization, mass assignment, CSRF, upload validation, rate limit;
- performance: query count, pagination, cache, queue;
- UI/UX: accessibility, responsive, empty/loading/error states;
- SEO: meta, structured data, Core Web Vitals;
- docs: AGENTS.md project-only decisions, standards proposal, cleanup of temporary docs.

Output format:

- findings first, ordered by severity;
- file/line references;
- recommendation and test/quality check;
- classify as `FIX_NOW`, `STANDARDIZE`, `PROJECT_ONLY`, or `IGNORE`.

## Skill Design Notes

Ikuti style skill creator:

- `SKILL.md` harus ringkas dan berisi workflow inti.
- Detail panjang masuk `references/`.
- Untuk skill besar, gunakan progressive disclosure:

```text
laravel-service-architecture/
  SKILL.md
  references/
    controller-service-request.md
    service-boundaries.md
    transactions-events.md
    anti-overengineering.md
```

Suggested references for `laravel-service-architecture`:

- `controller-service-request.md`: controller, Form Request, service/action patterns.
- `service-boundaries.md`: kapan service perlu dibuat, kapan cukup model/query scope.
- `transactions-events.md`: DB transaction, lock, dispatch after commit.
- `anti-overengineering.md`: kapan tidak perlu interface, repository, DTO, atau feature folders.

## Standards To Adopt From References

Adopt:

- service class untuk business workflow non-trivial;
- Form Request untuk validasi/authorization;
- dependency injection ke controller/action;
- transaction di service untuk multi-write;
- event dispatching untuk side effects yang perlu decoupling;
- repository hanya bila data access kompleks atau ada multiple backend;
- Laravel fakes untuk Mail/Queue/Event/Notification/Storage;
- SEO audit mode dengan PASS/FAIL/N/A;
- stack detection sebelum memberi advice UI/SEO/Tailwind/Inertia;
- rule categories by priority.

Revise before adopting:

- Jangan wajibkan interface untuk semua service. Jadikan conditional.
- Jangan jadikan repository pattern default.
- Jangan copy format skill external yang terlalu panjang ke `SKILL.md`; pindahkan detail ke references.
- Jangan hardcode Laravel 13 bila target proyek masih Laravel 12/13 campuran. Buat skill mendeteksi versi dari `composer.json`.

Reject:

- Controller yang berisi business logic berat.
- Service yang hanya membungkus satu baris Eloquent tanpa alasan reuse/testability.
- Inline validation sebagai standar global.
- UI yang hanya "kelihatan bagus" tapi tidak punya accessibility, state feedback, dan responsive behavior.

## Next Action When Moving To `syarif-laravel-standards`

1. Create or update `laravel-service-architecture`.
2. Merge relevant sections from `docs/standards-final-proposal.md`.
3. Add references listed above.
4. Add a project stack detection checklist for Laravel version, Blade/Inertia/Livewire, Tailwind version, testing framework.
5. Validate skill folder with skill creator tooling.
