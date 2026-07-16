---
name: architecture
description: Apply Laravel-native architecture decisions without forcing unnecessary repositories, interfaces, DTOs, or custom layers.
---

# Architecture

Use Laravel conventions before adding custom architecture. A good default request path is:

```text
Route -> Controller -> Form Request -> Action/Service -> Eloquent/Integration -> Response
```

Do not force every layer into every feature. Add a boundary only when it makes behavior easier to test, reuse, reason about, or change.

## Layer Decisions

Use a controller for HTTP orchestration:

- receive the request;
- delegate validation and authorization;
- call the application workflow;
- return redirect, response, resource, view, or stream.

Use a Form Request when validation or authorization is complex, reused, or important enough to test independently.

Use an Action when a single use case needs a named command-style object.

Use a Service when a workflow coordinates multiple models, integrations, files, jobs, events, generated documents, or transactional writes.

Use a Policy or Gate for authorization rules. Keep authorization close to the boundary, but do not bury model-state rules in routes.

## Avoid Overengineering

Do not add repositories, interfaces, DTOs, feature folders, or value objects by default.

Add an interface when:

- there are multiple implementations;
- a provider may be swapped;
- the domain should not depend on a concrete integration;
- a stable contract is shared across modules;
- a test boundary is meaningful and not just mocking for its own sake.

Add a repository only when query/data-access complexity is real or storage implementation may vary. Plain Eloquent in an Action or Service is fine for normal CRUD.

## Version And Stack Detection

Before applying version-specific patterns, check:

- Laravel version in `composer.json` or `php artisan --version`;
- PHP version and supported syntax;
- installed testing framework;
- queue driver and Horizon presence;
- Blade, Livewire, Inertia, React, Vue, Tailwind, or Vite usage;
- Sail/container workflow versus host commands.

## Implementation Checklist

- Keep the public behavior small and testable.
- Prefer Laravel-native APIs over custom plumbing.
- Keep project-specific business names out of shared standards.
- Write focused tests around the behavior being changed.
- Run available quality checks before handoff.
