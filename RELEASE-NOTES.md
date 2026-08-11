# Syarif Laravel AI Skills - Release Notes

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

## v0.2.0 (2026-08-11)

Sparse activation and routing reliability release for the Laravel skill catalog.

GitHub release body: [docs/releases/v0.2.0.md](docs/releases/v0.2.0.md).

### Added

- Sparse specialist activation for loading 0, 1, or 2 specialist skills depending on task need.
- Improved router/orchestrator guidance for choosing primary and supporting specialist context.
- Strict numeric JSON-schema router output contract for activation signals.
- Router schema validation with one schema-only format retry.
- Safer checkpoint/resume behavior for benchmark and regression workflows.
- Explicit truncation and runaway-generation failure handling.
- Final benchmark and freeze documentation for the internal V4 / V4.3.2 architecture revision.

### Changed

- Preserved the existing 72 specialist skills while making specialist loading more selective.
- Kept lightweight Laravel tasks on a smaller default path.
- Improved benchmark/regression validation artifacts without changing public installation flow.

### Validation

- `npm run validate`
- `npm run list`
- `python validate-v4-implementation.py`
- Static benchmark runner, validator, and grader self-tests

## v0.1.0 (2026-07-16)

Initial installable Laravel AI skill catalog for personal Laravel engineering standards.

GitHub release body: [docs/releases/v0.1.0.md](docs/releases/v0.1.0.md).

### Added

- 72 installable Laravel skills discoverable by `npx skills add`.
- Local core standards covering architecture, controllers, Form Requests, Actions/Services, Eloquent, transactions, queues, Livewire, security, testing, standards usage, standards extraction, and memory orchestration.
- 54 additional Laravel topic skills mapped from the public [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) catalog without copying third-party skill body text.
- 4 supplemental skills inspired by public Laravel Skills Cloud topics: Laravel specialist workflow, Laravel 11/12 app guidelines, Livewire development, and database optimization.
- Module-per-menu workflow for multi-page Laravel apps with one page per module, shared layouts/components, and dynamic database-backed data.
- UI Agent Browser workflow for stack-aware frontend/UI/UX implementation with agent-browser inspection, Playwright checks, and backend contract alignment.
- Stronger Playwright E2E guidance based on the official Microsoft Playwright source, plus cross-links from existing UI/browser skills into the new frontend workflow.
- Responsive UI testing skill for Laravel interfaces using Playwright across mobile, tablet, laptop, desktop, Livewire states, overflow, clipped content, forms, tables, modals, navigation, and dark mode.
- Active secure memory management skill for continuity across conversation, project, user, workflow, and codebase context with automatic preflight, stdio MCP tools, lifecycle hooks, global VS Code/GitHub Copilot and VS Code-family agent instructions, ACP Client for VS Code settings, safe installer/config generator aliases for four VS Code-family hosts, four AI agent tools, four popular editors, Antigravity, Kilo Code, Hermes Agent, Zed, a Hermes-style non-secret orchestrator profile, local file-backed commands, relevance-aware retrieval, and secret-safe guardrails.
- Bilingual Markdown switch pattern for user-facing docs.
- Proposal workflow under `proposals/pending`, `proposals/accepted`, and `proposals/rejected`.
- Local validation, listing, dry-run install, and Superpowers mapping scripts.
- Marketplace/plugin sync output matching the `awesome-ai-agent-skills` style: `plugin-groups.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and `plugins/laravel-app-skills`.
- Root Codex plugin artifact metadata at `.codex-plugin/plugin.json` for codex-marketplace.com submissions.
- Universal assistant metadata and usage docs through `agent-skills.json`, `docs/UNIVERSAL_USAGE.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`.
- README installation guide for `npx skills add soden46/syarif-laravel-ai-skills`.
- Codex plugin installation guide for `codex plugin marketplace add soden46/syarif-laravel-ai-skills --ref main`.
- Claude Code plugin package manifest for `claude --plugin-dir ./plugins/laravel-app-skills`.
- Mapping document at [docs/SUPERPOWERS_SKILL_MAPPING.md](docs/SUPERPOWERS_SKILL_MAPPING.md).

### Changed

- Converted the previous umbrella standards skill and reference files into focused installable skills.
- Aligned skill frontmatter names with folder names, while keeping filesystem folders Windows-safe kebab-case.
- Made `package.json` private so the documented install path stays focused on `npx skills add`.

### Validation

- `npm run validate`
- `npx skills add . --list`
- `npm run list`

### Reference

Documentation structure, granular skill layout, and release-note style are inspired by [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel).

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

## v0.2.0 (2026-08-11)

Release sparse activation dan peningkatan reliability routing untuk katalog skill Laravel.

Body release GitHub: [docs/releases/v0.2.0.md](docs/releases/v0.2.0.md).

### Ditambahkan

- Sparse specialist activation untuk memuat 0, 1, atau 2 skill specialist sesuai kebutuhan task.
- Guidance router/orchestrator yang lebih baik untuk memilih primary dan supporting specialist context.
- Kontrak output router JSON-schema numerik yang strict untuk activation signal.
- Validasi schema router dengan satu retry khusus format schema.
- Perilaku checkpoint/resume yang lebih aman untuk workflow benchmark dan regression.
- Penanganan truncation dan runaway generation yang eksplisit.
- Dokumentasi final benchmark dan freeze untuk revisi arsitektur internal V4 / V4.3.2.

### Diubah

- Mempertahankan 72 skill specialist yang sudah ada sambil membuat loading specialist lebih selektif.
- Task Laravel ringan tetap memakai jalur default yang lebih kecil.
- Meningkatkan artifact validasi benchmark/regression tanpa mengubah alur instalasi publik.

### Validasi

- `npm run validate`
- `npm run list`
- `python validate-v4-implementation.py`
- Self-test statis untuk benchmark runner, validator, dan grader

## v0.1.0 (2026-07-16)

Katalog awal skill AI Laravel yang bisa di-install untuk standar engineering Laravel pribadi.

Body release GitHub: [docs/releases/v0.1.0.md](docs/releases/v0.1.0.md).

### Ditambahkan

- 72 skill Laravel installable yang bisa ditemukan oleh `npx skills add`.
- Standar inti lokal untuk arsitektur, controller, Form Request, Action/Service, Eloquent, transaction, queue, Livewire, security, testing, penggunaan standar, ekstraksi standar, dan memory orchestration.
- 54 skill topik Laravel tambahan yang dimapping dari katalog publik [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) tanpa menyalin isi body skill pihak ketiga.
- 4 skill tambahan yang terinspirasi dari topik publik Laravel Skills Cloud: workflow Laravel specialist, guideline app Laravel 11/12, Livewire development, dan database optimization.
- Workflow module-per-menu untuk app Laravel multi-page dengan satu page per module, shared layout/component, dan data dinamis dari database.
- Workflow UI Agent Browser untuk implementasi frontend/UI/UX sesuai stack target, memakai inspeksi agent-browser, pengecekan Playwright, dan alignment kontrak backend.
- Guidance Playwright E2E yang lebih kuat berdasarkan sumber resmi Microsoft Playwright, plus cross-link dari skill UI/browser lama ke workflow frontend baru.
- Skill responsive UI testing untuk interface Laravel memakai Playwright di mobile, tablet, laptop, desktop, state Livewire, overflow, konten terpotong, form, tabel, modal, navigasi, dan dark mode.
- Skill active secure memory management untuk kontinuitas conversation, project, user, workflow, dan codebase context dengan automatic preflight, tool MCP stdio, lifecycle hook, instruksi global VS Code/GitHub Copilot dan agent keluarga VS Code, setting ACP Client for VS Code, alias installer/config generator aman untuk empat host keluarga VS Code, empat AI agent tools, empat editor populer, Antigravity, Kilo Code, Hermes Agent, Zed, command lokal file-backed, retrieval relevan, dan guardrail anti-secret.
- Pola switch Markdown bilingual untuk dokumentasi user-facing.
- Workflow proposal di `proposals/pending`, `proposals/accepted`, dan `proposals/rejected`.
- Script lokal untuk validasi, listing, dry-run install, dan mapping Superpowers.
- Output sync marketplace/plugin mengikuti gaya `awesome-ai-agent-skills`: `plugin-groups.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, dan `plugins/laravel-app-skills`.
- Metadata artifact plugin Codex root di `.codex-plugin/plugin.json` untuk submission codex-marketplace.com.
- Metadata dan panduan penggunaan assistant universal lewat `agent-skills.json`, `docs/UNIVERSAL_USAGE.md`, `CLAUDE.md`, dan `.github/copilot-instructions.md`.
- Panduan instalasi README untuk `npx skills add soden46/syarif-laravel-ai-skills`.
- Panduan instalasi plugin Codex untuk `codex plugin marketplace add soden46/syarif-laravel-ai-skills --ref main`.
- Manifest package plugin Claude Code untuk `claude --plugin-dir ./plugins/laravel-app-skills`.
- Dokumen mapping di [docs/SUPERPOWERS_SKILL_MAPPING.md](docs/SUPERPOWERS_SKILL_MAPPING.md).

### Diubah

- Mengubah umbrella standards skill dan reference lama menjadi skill installable yang lebih fokus.
- Menyamakan nama frontmatter skill dengan nama folder, dengan nama folder tetap aman untuk Windows memakai kebab-case.
- Membuat `package.json` private supaya jalur instalasi yang didokumentasikan tetap fokus ke `npx skills add`.

### Validasi

- `npm run validate`
- `npx skills add . --list`
- `npm run list`

### Referensi

Struktur dokumentasi, layout skill granular, dan gaya release notes terinspirasi dari [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel).

</details>
