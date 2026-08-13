# Syarif Laravel AI Skills - Release Notes

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

## v0.3.0 (2026-08-13)

Smarter sparse routing, automatic project memory flow, and Codex marketplace packaging validation for the Laravel skill catalog.

GitHub release body: [docs/releases/v0.3.0.md](docs/releases/v0.3.0.md).

### Added

- Production routing policy `family_gated_sparse_routing` with family-gated primary specialist selection.
- Support specialist compatibility so cross-cutting context is loaded only when useful.
- Public release evidence for routing heldout, capability, and token-efficiency validation.
- Codex marketplace package-surface file-count validation.

### Changed

- Reduced unnecessary specialist activation while preserving the 0-2 specialist cap per task.
- Kept memory preflight as conditional infrastructure; `memory-management` does not consume specialist slots.
- Kept all 72 canonical skills available.

### Benchmark Summary

- Routing heldout improved mode accuracy from 56.3% to 83.3%, primary family from 36.1% to 72.2%, primary skill from 30.6% to 69.4%, support precision from 45.5% to 100%, support recall from 83.3% to 91.7%, overactivation from 37.5% to 14.6%, average specialists from 1.313 to 1.125, and utility from 0.574 to 0.800.
- Fresh capability benchmark: baseline 58.9%, old policy49 57.3%, new routing 58.3%. New routing was non-inferior to baseline and +1.0 pp versus policy49; promotion gate PASS.
- Token-efficiency benchmark: baseline 60.8%, corrected load_all 59.2%, old policy49 52.5%, new routing 62.5%. Candidate B token-efficiency gate PASS.

### Packaging

- Codex marketplace file-count validation now counts the actual plugin package surface instead of the entire tracked repository.
- The 128-file guard remains in place.
- Current package surface is 94 files.

### Validation

- `npm run validate`
- `npm run sync`
- `node scripts/validate-production-routing-policy.mjs`
- `node scripts/validate-skills.mjs --memory-flow-only`
- `npx skills add . --list`
- `git diff --check`

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

## v0.3.0 (2026-08-13)

Release ini menambahkan sparse routing yang lebih pintar, automatic project memory flow, dan validasi packaging Codex marketplace untuk katalog skill Laravel.

Body release GitHub: [docs/releases/v0.3.0.md](docs/releases/v0.3.0.md).

### Ditambahkan

- Policy routing production `family_gated_sparse_routing` dengan pemilihan primary specialist berbasis family.
- Kompatibilitas support specialist supaya context lintas domain hanya dimuat saat berguna.
- Evidence publik untuk validasi routing heldout, capability, dan token-efficiency.
- Validasi file-count berdasarkan surface package Codex marketplace.

### Diubah

- Mengurangi aktivasi specialist yang tidak perlu sambil tetap menjaga batas 0-2 specialist per task.
- Memory preflight tetap menjadi infrastructure kondisional; `memory-management` tidak memakai slot specialist.
- Semua 72 skill canonical tetap tersedia.

### Ringkasan Benchmark

- Routing heldout meningkat: mode accuracy 56.3% ke 83.3%, primary family 36.1% ke 72.2%, primary skill 30.6% ke 69.4%, support precision 45.5% ke 100%, support recall 83.3% ke 91.7%, overactivation 37.5% ke 14.6%, average specialists 1.313 ke 1.125, dan utility 0.574 ke 0.800.
- Fresh capability benchmark: baseline 58.9%, policy49 lama 57.3%, routing baru 58.3%. Routing baru non-inferior terhadap baseline dan +1.0 pp dibanding policy49; promotion gate PASS.
- Token-efficiency benchmark: baseline 60.8%, corrected load_all 59.2%, policy49 lama 52.5%, routing baru 62.5%. Candidate B token-efficiency gate PASS.

### Packaging

- Validasi file-count Codex marketplace sekarang menghitung surface package plugin yang sebenarnya, bukan seluruh repository tracked.
- Guard 128 file tetap dipertahankan.
- Surface package saat ini 94 file.

### Validasi

- `npm run validate`
- `npm run sync`
- `node scripts/validate-production-routing-policy.mjs`
- `node scripts/validate-skills.mjs --memory-flow-only`
- `npx skills add . --list`
- `git diff --check`

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
