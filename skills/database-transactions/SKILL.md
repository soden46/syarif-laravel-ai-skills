---
name: database-transactions
description: Wrap atomic Laravel write workflows in transactions and handle locks, retries, side effects, and after-commit work deliberately.
---

# Database Transactions

Use database transactions for write operations that must be atomic.

Transaction boundaries usually belong inside an Action or Service, not spread across controllers.

## Required Transaction Cases

Use `DB::transaction()` when a workflow:

- writes multiple related records;
- updates counters, balances, inventory, or state machines;
- coordinates audit records with domain writes;
- creates records and related child rows;
- must not partially succeed.

```php
final class CreateRecord
{
    public function handle(User $actor, array $data): Record
    {
        return DB::transaction(function () use ($actor, $data) {
            $record = Record::create([
                'owner_id' => $actor->id,
                'name' => $data['name'],
            ]);

            $record->items()->createMany($data['items'] ?? []);

            return $record->fresh(['items']);
        });
    }
}
```

## Filesystem Side Effects

Database rollbacks do not roll back files. Track stored paths and clean them up when the database write fails.

```php
$storedPaths = [];

try {
    DB::transaction(function () use ($request, &$storedPaths) {
        $record = Record::create([...]);

        foreach ($request->file('attachments', []) as $file) {
            $storedPaths[] = $file->store("records/{$record->id}", 'public');
        }
    });
} catch (Throwable $exception) {
    Storage::disk('public')->delete($storedPaths);

    throw $exception;
}
```

For delete flows, prefer committing database/audit changes first, then deleting files after the successful transaction unless the product explicitly requires the opposite failure mode.

## Locks And Retries

Use row locks for concurrent updates to shared counters, balances, or ordered state.

```php
DB::transaction(function () use ($recordId) {
    $record = Record::query()
        ->whereKey($recordId)
        ->lockForUpdate()
        ->firstOrFail();

    $record->increment('sequence');
});
```

Keep transactions short. Make retry behavior idempotent when deadlock retries are used.

## After-Commit Work

Dispatch queued jobs/events after commit when they depend on committed records.

Test:

- success path;
- rollback path;
- filesystem cleanup when applicable;
- after-commit behavior for important workflows.
