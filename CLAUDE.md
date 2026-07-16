# Claude Instructions

This repository packages reusable Laravel AI skills.

## Start Here

- Read `AGENTS.md` for repository rules.
- Use `skills/using-laravel-standards/SKILL.md` as the entry skill for Laravel project work.
- Load focused skills from `skills/<skill-name>/SKILL.md` only when relevant to the current task.

## Claude Code Plugin

The generated Claude Code plugin package lives at:

```text
plugins/laravel-app-skills
```

Run it locally with:

```bash
claude --plugin-dir ./plugins/laravel-app-skills
/reload-plugins
/laravel-app-skills:using-laravel-standards
```

## Editing Rules

- Canonical skills live only under `skills/<skill-name>/SKILL.md`.
- Do not edit generated skill copies under `plugins/laravel-app-skills/skills/`; they are local build output and ignored in Git.
- After changing canonical skills or grouping metadata, run `npm run sync` and `npm run validate`.
- Use `docs/UNIVERSAL_USAGE.md` when adapting these skills for other assistants.
