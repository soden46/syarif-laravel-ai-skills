# Repository Instructions

This repository packages reusable Laravel AI skills.

## Source Of Truth

- Canonical skills live only under `skills/<skill-name>/SKILL.md`.
- Skill folder names and frontmatter `name` values must match exactly.
- Every skill must be assigned to exactly one plugin in `plugin-groups.json`.
- Generated marketplace/plugin output lives in `.claude-plugin/`, `.agents/plugins/`, and `plugins/`.
- Do not edit generated plugin skill copies directly; edit `skills/` and run `npm run sync`.

## Workflow

After changing skills or plugin grouping, run:

```bash
npm run sync
npm run validate
npx skills add . --list
```

Keep skill bodies concise, action-oriented, and free of client names, secrets, private URLs, personal data, and one-off business rules.
