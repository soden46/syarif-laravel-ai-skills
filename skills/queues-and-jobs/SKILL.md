---
name: queues-and-jobs
description: Design Laravel queues, jobs, workers, schedules, and Horizon usage for retry safety, visibility, and operational reliability.
---

# Queues And Jobs

Use queues for work that can happen outside the request cycle: notifications, imports, exports, media processing, integration callbacks, long-running calculations, and retryable external operations.

## Job Design

Queued jobs should be safe to retry.

Prefer:

- passing IDs or small scalar payloads;
- reloading models in `handle()`;
- explicit `tries`, backoff, timeout, and failure behavior when the job is important;
- idempotency keys or state checks for external side effects;
- after-commit dispatch when jobs depend on committed records.

```php
final class ProcessRecord implements ShouldQueue
{
    public function __construct(public int $recordId)
    {
    }

    public function handle(): void
    {
        $record = Record::query()->findOrFail($this->recordId);

        if ($record->processed_at !== null) {
            return;
        }

        // Perform idempotent work.
    }
}
```

## Dispatching

Dispatch after commit when a queued job needs database writes to be visible.

```php
ProcessRecord::dispatch($record->id)->afterCommit();
```

## Failure Handling

Separate transient failures from permanent failures. Retry network and temporary provider issues; fail fast for invalid state or bad input.

Log failures with redacted context. Do not log secrets, tokens, signatures, full payloads, or unnecessary personal data.

## Horizon And Workers

Do not force Horizon on every project. Use Horizon or equivalent visibility when queue volume, failed jobs, throughput, or production support justifies it.

Worker configuration should account for:

- queue priorities;
- memory limits;
- timeouts;
- retry/backoff;
- graceful restarts;
- failed job storage.

## Scheduling

Scheduled tasks should use overlap protection for long-running or non-reentrant work.

```php
Schedule::command('records:process')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onOneServer();
```

Keep scheduled commands testable independently from cron.

## Testing

Use `Queue::fake()` or `Bus::fake()` to assert dispatching. Test job behavior directly when the job contains meaningful logic.
