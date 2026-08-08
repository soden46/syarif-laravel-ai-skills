# Verification Depth Reference

Match verification to risk level. Run the smallest meaningful check that proves the change.

- **LOW**: syntax/static check.
- **MEDIUM**: targeted feature/unit test + affected callers.
- **HIGH**: targeted verification + affected regression surface + failure paths + relevant data/security/concurrency checks.

For Laravel, prefer:
```bash
php artisan test --filter=SpecificTest
```
over full suite for small tasks.

Run the full test suite only when it is cheap or explicitly justified.
