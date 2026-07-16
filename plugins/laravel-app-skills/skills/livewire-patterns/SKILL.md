---
name: livewire-patterns
description: Laravel guidance to keep Livewire components focused on UI state while delegating reusable workflows, authorization, queries, and tests deliberately.
---

# Livewire Patterns

Apply Livewire rules only when the project uses Livewire. Detect the installed version and existing component conventions before changing components.

## Component Boundaries

Keep Livewire components focused on one interactive surface. Move reusable business workflows into Actions or Services when logic grows beyond component state and UI orchestration.

A component may:

- hold UI state;
- validate user input;
- call Actions/Services;
- dispatch browser or Livewire events;
- render a focused view.

A component should not:

- contain long multi-model workflows;
- build provider payloads inline;
- duplicate domain authorization that belongs in Policies;
- bypass transactions for atomic writes.

## Validation

Use Livewire validation APIs for component-local forms. Use shared rule objects, enums, helpers, or Form Request-like methods when rules are reused outside the component.

Normalize human-formatted input before numeric validation.

## Authorization

Authorize actions that mutate data. Use Policies for model-state decisions.

```php
public function save(UpdateRecord $update): void
{
    $this->authorize('update', $this->record);

    $data = $this->validate();

    $update->handle($this->record, $data);

    $this->dispatch('record-saved');
}
```

## Queries And Rendering

Eager load relations needed by the component view. Use pagination for lists and avoid loading unbounded datasets into component state.

Keep computed properties and render methods free of expensive repeated queries unless cached or intentionally scoped.

## Testing

Test Livewire components for:

- validation errors;
- authorization denial;
- emitted/dispatched events;
- database changes;
- interactions that are not covered by normal feature tests.

Use browser E2E tests for behavior that depends on JavaScript, focus, modals, uploads, or browser-only state.
