# GitHub Copilot Instructions

This repository packages reusable Laravel AI skills.

- Use `AGENTS.md` for repository rules and source-of-truth paths.
- Start Laravel work with `skills/using-laravel-standards/SKILL.md`.
- Load focused skills from `skills/<skill-name>/SKILL.md` only when the task needs them.
- Canonical skill edits belong in `skills/`, not generated copies under `plugins/`.
- Run `npm run sync` after changing skills or grouping metadata.
- Run `npm run validate` before committing skill or packaging changes.
- Use `docs/UNIVERSAL_USAGE.md` for assistant-agnostic installation and prompt examples.
