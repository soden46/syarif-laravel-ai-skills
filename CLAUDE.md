# Claude Code Instructions

Use `AGENTS.md` as the repository source of truth.

Canonical skills are in `skills/`. Generated plugin packages are in `plugins/` and should be regenerated with `npm run sync` instead of edited manually.

Before handoff, run:

```bash
npm run sync
npm run validate
npx skills add . --list
```
