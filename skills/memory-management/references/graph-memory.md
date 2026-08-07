# Graph Memory Reference

Graph memory commands and formats for the `memory-management` skill.

## Commands

```bash
node <skill-dir>/scripts/memory.mjs graph init
node <skill-dir>/scripts/memory.mjs graph remember-edge --from <id> --to <id> --relation <relation> [--confidence EXTRACTED|INFERRED|AMBIGUOUS]
node <skill-dir>/scripts/memory.mjs graph query "<question>" [--limit 5]
node <skill-dir>/scripts/memory.mjs graph path <from-id> <to-id>
node <skill-dir>/scripts/memory.mjs graph explain <memory-id>
node <skill-dir>/scripts/memory.mjs graph god-nodes [--limit 10]
node <skill-dir>/scripts/memory.mjs graph communities
node <skill-dir>/scripts/memory.mjs graph consolidate
```

## Node format

```json
{
  "id": "mem_1723000001_abc12345",
  "title": "Use Laravel Actions for business logic",
  "type": "convention",
  "scope": "project",
  "confidence": "high",
  "source_file": "projects/project-f23ab1/conventions.md",
  "created_at": "2026-08-07T12:00:00.000Z",
  "updated_at": "2026-08-07T12:00:00.000Z",
  "tags": ["laravel", "actions"],
  "community": "laravel-patterns"
}
```

## Edge format

```json
{
  "id": "edge_1723000002",
  "source": "mem_1723000001_abc12345",
  "target": "mem_1723000003_def67890",
  "relation": "supersedes",
  "confidence": "EXTRACTED",
  "created_at": "2026-08-07T12:00:00.000Z"
}
```

Allowed relations: `depends_on`, `relates_to`, `supersedes`, `references`, `calls`, `imports`, `inherits`, `mixes_in`, `part_of`, `triggers`, `constrains`, `enables`.

## When to use graph memory

- Two concepts need relationship tracing across projects.
- The task asks "what connects X to Y?" or "what depends on this?".
- You need god nodes or communities to understand subsystem structure.

When graph memory is not needed, use regular recall.
