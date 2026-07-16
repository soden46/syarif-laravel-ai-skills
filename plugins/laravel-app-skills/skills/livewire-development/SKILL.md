---
name: livewire-development
description: Laravel guidance to build and refactor Livewire components with version-aware state, validation, actions, events, rendering, pagination, and tests.
---

# Livewire Development

Use this skill for Livewire component implementation, refactoring, bug fixing, and review.

Pair with `livewire-patterns` for architectural boundaries and with `testing` for verification strategy.

## Version And Project Detection

1. Confirm the installed Livewire version from `composer.json`, lock files, or generated assets.
2. Inspect existing components before choosing syntax, event names, form objects, pagination style, or layout conventions.
3. Follow the project's Blade, Tailwind, Alpine, Volt, or Filament patterns when present.
4. Avoid mixing frontend frameworks unless the repo already does.

## Component Design

- Keep each component centered on one interactive surface.
- Store only UI state and request-shaped data in public properties.
- Move multi-model writes, integrations, and reusable business decisions to Actions or Services.
- Authorize mutating actions with Policies or clear gate checks.
- Wrap atomic multi-write operations in transactions outside the view layer.

## Validation And Forms

- Use Livewire validation for component-local forms.
- Extract shared validation rules when the same rules are used outside the component.
- Normalize numeric, date, boolean, and localized text input before validation.
- Preserve typed state when hydrating models, enums, and value objects.

## Rendering And Data

- Eager load relationships needed by the view.
- Paginate lists instead of storing unbounded collections in component state.
- Keep render methods predictable; avoid expensive repeated queries without caching or explicit constraints.
- Use stable keys for repeated child components and dynamic list items.

## Events And UX

- Dispatch events for UI notifications, browser interactions, and sibling component coordination.
- Keep event names local and intention-revealing.
- Use browser tests for modal focus, uploads, file previews, drag/drop, JavaScript-only behavior, and regressions that component tests cannot prove.

## Testing

Test component behavior for validation errors, authorization denial, successful persistence, dispatched events, redirects, pagination, and view state. Use factories and framework fakes instead of external services.
