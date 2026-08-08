# Laravel Root-Cause Trace

Laravel-specific execution path for root-cause debugging:

```
route
  → component/controller
    → validation
      → service/model
        → DB
          → event/job
            → response/view
```

Use this reference when the task involves debugging or tracing execution flow in Laravel or Livewire.
