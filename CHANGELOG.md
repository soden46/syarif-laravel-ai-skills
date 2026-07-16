# Changelog

## Unreleased

Changed:
- expanded the installable catalog to 72 skills with `responsive-ui-testing` for Laravel responsive UI audits across mobile, tablet, desktop, Livewire states, overflow, clipping, tables, modals, and navigation;
- converted the previous umbrella standards skill and references into focused installable skills;
- built the catalog from 12 local core standards, mapped Superpowers Laravel topics, supplemental Laravel Skills Cloud topics, and focused project-quality skills;
- added `laravel-specialist`, `laravel-11-12-app-guidelines`, `livewire-development`, and `laravel-database-optimization`;
- added `plugin-groups.json`, marketplace files, and generated `plugins/laravel-app-skills` bundle to match the `awesome-ai-agent-skills` style;
- added `scripts/sync-marketplace.mjs` and `npm run sync` to regenerate marketplace/plugin output from canonical skills;
- added `scripts/import-superpowers-missing-skills.mjs` and `npm run import:superpowers` for future topic mapping;
- added `docs/SUPERPOWERS_SKILL_MAPPING.md` to track the public Superpowers Laravel skill mapping;
- preserved the extract standards workflow as `extract-laravel-standards`;
- added README installation instructions for `npx skills` and npm package usage;
- added npm package metadata, installer CLI, and skill validation script;
- added a portable `templates/AGENTS.md` instruction template.
- added `docs/ADDING_SKILLS.md` as the future standard for new skills;
- tightened validation so only `skills/<name>/SKILL.md` can define installable skills;
- made `package.json` a private local helper package to keep `npx skills add` as the documented install path.
- shortened skill descriptions so `npx skills add <repo> --list` renders cleanly like the `jpcaparas/superpowers-laravel` reference;
- documented the expected `--list` output and reference repository in README.
- rewrote README using the `jpcaparas/superpowers-laravel` documentation pattern;
- added `RELEASE-NOTES.md` with an initial release entry;
- updated installation commands to use `soden46/syarif-laravel-ai-skills`.
- restructured the catalog from 2 umbrella skills into granular folder-named skills;
- updated validation and local install tooling for folder-aligned skill names with Windows-safe folder names.
- added bilingual Markdown switch support for README, skill-adding guide, and AGENTS template.

## 2026-07-16

Initial custom Laravel standards skill implementation.

Added:
- concise `SKILL.md` entrypoint with reference routing and verification expectations;
- architecture guidance for Laravel-native layering and anti-overengineering;
- thin controller and route-boundary guidance;
- Form Request guidance for reusable/complex HTTP validation and authorization;
- Action and Service guidance with conditional interface/repository rules;
- transaction, filesystem side-effect, lock, and after-commit rules;
- Eloquent model contract, relation loading, bounded option, large-data, and historical snapshot rules;
- testing guidance for feature, unit, render, document, framework fake, browser E2E, and handoff verification;
- Livewire-specific conventions for component boundaries, validation, authorization, queries, and tests;
- queue, job, Horizon, schedule, retry, idempotency, and failure-handling guidance;
- security baseline for access control, CSRF/request forgery, rate limiting, uploads, secrets, logs, API responses, and dependency/configuration review.

Sources processed anonymously:
- project audit proposal A: render/report testing, route ordering, bounded options, transaction plus filesystem cleanup;
- project audit proposal B: route authorization, middleware configuration, idempotent seeders, model contracts, historical data, document snapshots;
- project audit proposal C: service architecture roadmap, UI quality, performance, SEO, testing, and audit categories;
- project audit proposal D: integration boundaries, workflow tests, cached settings, structured integration logs, route-cache-safe controllers;
- project audit proposal E: scoped access reuse, numeric input normalization, feature parity tests, explicit model contracts;
- external skill intake F: Laravel, PHP, testing, database, security, UI, SEO, technical-debt, code-quality, and documentation skills;
- external skill intake G: Laravel routing, validation, authorization, testing, transactions, queues, rate limiting, request forgery, runner selection, and quality-check skills.

Decisions:
- kept `SKILL.md` compact and moved detailed rules into `references/`;
- avoided project-specific names, provider quirks, URLs, credentials, copy, roles, permission strings, and business data maps;
- did not modify or copy upstream Laravel skills;
- did not require Repository Pattern globally;
- did not require interfaces for every service;
- kept Actions and Services conditional on concrete workflow needs;
- required database transactions for atomic write workflows;
- required relevant verification before work is considered complete.
