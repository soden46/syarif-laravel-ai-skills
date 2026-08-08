# Overengineering Control Reference

## Decision gate

Before creating any new file, class, service, repository, DTO, Form Request, middleware, helper, trait, abstraction, or dependency:
- determine whether the existing execution path can solve the task safely
- if yes, reuse it
- if no, create only the smallest justified abstraction

Semantic necessity matters more than LOC.

## Ladder

Stop at the first rung that holds:

1. Does this need to exist at all? Speculative need = skip it.
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature covers it? Use it.
5. Already-installed dependency solves it? Use it.
6. Can this be one line? Make it one line.
7. Only then: minimum code that works.

## False reuse protection

Reuse only when semantics match, not merely because code looks similar.

## Boundaries

Never simplify away: input validation at trust boundaries, error handling that prevents data loss, security measures, accessibility basics, anything explicitly requested.
