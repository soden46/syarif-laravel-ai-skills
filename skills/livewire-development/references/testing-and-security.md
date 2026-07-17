# Livewire Testing And Security

Use this reference when a Livewire task mutates data, accepts model identifiers, handles uploads, integrates browser JavaScript, or needs a focused test plan.

## Secure Action Pattern

Treat action arguments and public properties as client-controlled.

```php
public function save(UpdateRecord $update): void
{
    $this->authorize('update', $this->record);

    $data = $this->validate();

    $update->handle($this->record, $data);

    $this->dispatch('record-saved');
}

public function delete(int $recordId, DeleteRecord $delete): void
{
    $record = Record::query()->findOrFail($recordId);

    $this->authorize('delete', $record);

    $delete->handle($record);
}
```

Do not authorize only during `mount()`. Every later mutating request must enforce the relevant decision because component state and action parameters cross the client boundary.

## Component Test Matrix

Cover the risks the component owns:

```php
use Livewire\Livewire;

test('an authorized user can update a record', function () {
    $user = User::factory()->create();
    $record = Record::factory()->for($user, 'owner')->create();

    Livewire::actingAs($user)
        ->test(EditRecord::class, ['record' => $record])
        ->set('name', 'Updated name')
        ->call('save')
        ->assertHasNoErrors()
        ->assertDispatched('record-saved');

    expect($record->refresh()->name)->toBe('Updated name');
});

test('another user cannot update the record', function () {
    $user = User::factory()->create();
    $record = Record::factory()->create();

    Livewire::actingAs($user)
        ->test(EditRecord::class, ['record' => $record])
        ->set('name', 'Unauthorized change')
        ->call('save')
        ->assertForbidden();
});
```

Adapt assertions to the installed Livewire and test-framework version. Prefer behavior assertions over component internals.

## Upload Checks

- Validate MIME type, size, and domain constraints server-side.
- Use `Storage::fake()` in component tests.
- Authorize the owning model before storing or deleting a file.
- Track temporary and permanent file lifecycle deliberately.
- Do not expose private files through predictable public URLs.
- Use browser tests for drag/drop, preview, progress, focus, and JavaScript-only behavior.

## Performance Checks

- Assert pagination and filters with realistic record counts.
- Inspect query counts when a component renders nested relationships or repeated children.
- Avoid broad `assertSee()` loops that hide an N+1 query introduced by the view.
- Test cached or persisted computed properties with authorization scopes and invalidation in mind.

## Browser-Test Boundary

Use a browser test when correctness depends on:

- Alpine or third-party JavaScript;
- focus, keyboard navigation, or modal trapping;
- Livewire navigation and history state;
- upload previews, progress, or drag/drop;
- loading indicators and duplicate-submit prevention;
- responsive overflow, clipping, or conditional navigation.
