# Syarif Laravel AI Skills - Release Notes

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

## v0.1.0 (2026-07-16)

Initial installable Laravel AI skill catalog for personal Laravel engineering standards.

GitHub release body: [docs/releases/v0.1.0.md](docs/releases/v0.1.0.md).

### Added

- 71 installable Laravel skills discoverable by `npx skills add`.
- 12 local core standards covering architecture, controllers, Form Requests, Actions/Services, Eloquent, transactions, queues, Livewire, security, testing, standards usage, and standards extraction.
- 55 additional Laravel topic skills mapped from the public [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) catalog without copying third-party skill body text.
- 4 supplemental skills inspired by public Laravel Skills Cloud topics: Laravel specialist workflow, Laravel 11/12 app guidelines, Livewire development, and database optimization.
- Bilingual Markdown switch pattern for user-facing docs.
- Proposal workflow under `proposals/pending`, `proposals/accepted`, and `proposals/rejected`.
- Local validation, listing, dry-run install, and Superpowers mapping scripts.
- Marketplace/plugin sync output matching the `awesome-ai-agent-skills` style: `plugin-groups.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and `plugins/laravel-app-skills`.
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

## v0.1.0 (2026-07-16)

Katalog awal skill AI Laravel yang bisa di-install untuk standar engineering Laravel pribadi.

Body release GitHub: [docs/releases/v0.1.0.md](docs/releases/v0.1.0.md).

### Ditambahkan

- 71 skill Laravel installable yang bisa ditemukan oleh `npx skills add`.
- 12 standar inti lokal untuk arsitektur, controller, Form Request, Action/Service, Eloquent, transaction, queue, Livewire, security, testing, penggunaan standar, dan ekstraksi standar.
- 55 skill topik Laravel tambahan yang dimapping dari katalog publik [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) tanpa menyalin isi body skill pihak ketiga.
- 4 skill tambahan yang terinspirasi dari topik publik Laravel Skills Cloud: workflow Laravel specialist, guideline app Laravel 11/12, Livewire development, dan database optimization.
- Pola switch Markdown bilingual untuk dokumentasi user-facing.
- Workflow proposal di `proposals/pending`, `proposals/accepted`, dan `proposals/rejected`.
- Script lokal untuk validasi, listing, dry-run install, dan mapping Superpowers.
- Output sync marketplace/plugin mengikuti gaya `awesome-ai-agent-skills`: `plugin-groups.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, dan `plugins/laravel-app-skills`.
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
