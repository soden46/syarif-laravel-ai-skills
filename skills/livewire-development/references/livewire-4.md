# Livewire 4 Reference

Load this reference only for Livewire v4 projects or explicit v4 upgrade work. Verify exact syntax against the installed package and current official documentation before editing production code.

## Component Formats

Livewire v4 supports three component formats:

| Format | Default location | Prefer when |
| --- | --- | --- |
| Single-file | `resources/views/components/...` | The component is small or medium and benefits from colocated PHP and Blade. |
| Multi-file | A component directory under `resources/views/components/...` | The component has substantial PHP, JavaScript, CSS, or colocated tests. |
| Class-based | `app/Livewire/...` plus a Blade view | The project follows v2/v3 conventions or benefits from traditional class/view separation. |

Use the project's configured defaults. Do not convert formats just to adopt novelty.

```bash
php artisan make:livewire post.create
php artisan make:livewire pages::post.create
php artisan make:livewire post.create --mfc
php artisan make:livewire post.create --class
php artisan livewire:convert post.create --mfc
```

The lightning-bolt filename prefix used by view-based components is optional and configurable. Avoid renaming existing components unless all references, tests, and deployment filesystem behavior are understood.

## Pages And Routing

Use `Route::livewire()` for v4 full-page components, especially view-based components.

```php
Route::livewire('/posts/create', 'pages::post.create')
    ->middleware('auth')
    ->name('posts.create');
```

Keep route middleware and authorization requirements explicit. Route model binding does not replace action-level authorization.

## Binding And Request Timing

Plain `wire:model` synchronizes state when an action is submitted. Add network traffic only when the UX needs it:

```blade
<input wire:model="title">
<input wire:model.live.debounce.300ms="search">
<input wire:model.blur.live="email">
<select wire:model.change.live="status">
```

Livewire v4 adds or expands modifiers such as `.enter`, `.deep`, `.renderless`, and `.preserve-scroll`. Confirm them in the v4 directive documentation before use. When upgrading from v3, review event propagation because v4 model binding ignores bubbled child events by default.

## Attributes

Use attributes only when they clarify behavior and are supported by the installed v4 release:

- `#[Validate]` for property validation;
- `#[Computed]` for derived state;
- `#[Locked]` for client-immutable properties;
- `#[Reactive]` and `#[Modelable]` for explicit parent-child synchronization;
- `#[On]` for event listeners;
- `#[Lazy]` for deferred component loading;
- `#[Session]` and `#[Url]` for intentional persistence;
- `#[Renderless]` when an action should skip rendering;
- `#[Layout]` and `#[Title]` for page components;
- `#[Async]` only for independent side effects that do not mutate rendered component state;
- `#[Js]` only for reusable client-side actions that need no server round trip.

Do not use `#[Async]` for state mutations or operations that require ordered responses; parallel requests can race.

## Loading And JavaScript

Livewire v4 automatically adds `data-loading` to request-triggering elements. Prefer it when the project's CSS or Tailwind version supports the required variants; use `wire:loading` and `wire:target` for explicit show/hide behavior.

Single-file and multi-file components can use component scripts directly. Class-based component views require the Livewire script directive expected by the installed version. Keep third-party widget setup scoped to the component and safe across DOM morphs.

## Upgrade Checks

- Prefer `Route::livewire()` for full-page routing.
- Close Livewire component tags correctly because v4 supports slots.
- Review `wire:model` event propagation and update timing.
- Check component discovery paths and custom namespaces.
- Verify Alpine, Flux, Filament, Volt, and testing-package compatibility before upgrading.
- Run component and browser tests around navigation, uploads, nested components, and JavaScript hooks.

## Official Documentation

- https://livewire.laravel.com/docs/4.x/components
- https://livewire.laravel.com/docs/4.x/wire-model
- https://livewire.laravel.com/docs/4.x/actions
- https://livewire.laravel.com/docs/4.x/security
- https://livewire.laravel.com/docs/4.x/testing
- https://livewire.laravel.com/docs/4.x/upgrading
