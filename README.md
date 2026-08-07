# Syarif Laravel AI Skills

<p align="center">
  <img src="docs/assets/readme-hero.svg" alt="Syarif Laravel AI Skills - 71 Skills, Codex Plugin, Claude Code, Universal AI" width="100%">
</p>

<p align="center">
  <a href="https://github.com/soden46/syarif-laravel-ai-skills/releases"><img alt="Version" src="https://img.shields.io/badge/version-0.1.0-2563EB?style=for-the-badge&labelColor=0F172A"></a>
  <a href="https://github.com/soden46/syarif-laravel-ai-skills/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-0284C7?style=for-the-badge&labelColor=0F172A"></a>
  <a href="https://github.com/soden46/syarif-laravel-ai-skills/tree/main/skills"><img alt="Skills" src="https://img.shields.io/badge/skills-72-0EA5E9?style=for-the-badge&labelColor=0F172A"></a>
  <a href="https://www.codex-marketplace.com/plugins/syarif-laravel-ai-skills"><img alt="Codex Marketplace" src="https://img.shields.io/badge/codex_marketplace-approved-06B6D4?style=for-the-badge&labelColor=0F172A"></a>
  <a href="https://github.com/soden46/syarif-laravel-ai-skills/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/syarif-laravel-ai-skills?style=for-the-badge&label=stars&labelColor=0F172A&color=38BDF8"></a>
</p>

Laravel-focused AI skills for Codex, Claude Code, and any AI coding assistant that can read Markdown files. Install them with `npx skills add`, use the generated plugin packages, or point a generic assistant at the universal manifest and canonical `skills/` folder. The catalog now includes secure memory orchestration, a least-code minimization gate, risk-aware verification, adaptive depth, bounded exploration, and memory discipline so agents can recall useful project context, write the smallest possible diff, match trace and test depth to task risk, and avoid over-exploration or stale memory poisoning.

Skills follow the [Agent Skills](https://agentskills.io/) format.

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

## What You Get

- **72 installable Laravel skills** - a focused Laravel skill catalog with overlapping topics consolidated into stronger canonical skills.
- **Least-code minimization gate** - `least-code` enforces YAGNI, reuse, stdlib, native features, installed dependencies, one-liners, and minimum working code before any implementation skill runs.
- **Risk-aware verification** - tasks are classified LOW/MEDIUM/HIGH so trace depth, test scope, and regression surface match the actual risk instead of always running the full suite.
- **Adaptive depth** - small tasks stay small; high-risk tasks get full trace, behavior preservation checks, and failure-path verification without over-exploring.
- **Bounded exploration** - agents stop once the execution path, affected callers, contract, and verification surface are understood, instead of grepping the entire repository.
- **Memory discipline** - memory entries carry lifecycle states, source precedence prevents stale or inferred memory from overriding current code, and checkpoints store only reusable decisions instead of every task result.
- **Personal core standards** - local standards extracted from reviewed Laravel projects and ongoing AI workflows, with client details removed.
- **Public topic coverage** - 54 additional topics mapped from public Laravel skill catalogs without copying third-party skill body text.
- **Responsive UI testing** - a focused Playwright skill for mobile, tablet, desktop, overflow, clipping, tables, modals, navigation, and Livewire state checks.
- **UI Agent Browser workflow** - a frontend/UI/UX skill that combines agent-browser inspection, Playwright checks, target-stack implementation, and backend contract alignment.
- **Active Secure Memory** - `memory-management` routes conversation, project, user, workflow, and codebase memory through relevance-aware retrieval, local file-backed commands, provenance, anonymization, and secret-safe guardrails.
- **Simple discovery** - `npx skills add <repo> --list` reads each `skills/<folder>/SKILL.md`.
- **Universal assistant support** - usable by Codex, Claude Code, Copilot, OpenAI Codex/GPT, Antigravity, Cursor, Windsurf, Zed, Cline, Roo Code, Continue, Kilo Code, Hermes Agent, Aider, OpenCode, Gemini CLI, and generic agents that can read files.

## Memory Orchestrator

The `memory-management` skill is the continuity layer for long-running Laravel work. It helps an agent remember durable decisions, understand related project patterns, continue from a previous checkpoint, and adapt when the current repository proves old memory stale.

It is designed to reduce token waste by retrieving only relevant memory: user preferences, project conventions, workflow patterns, conversation checkpoints, and targeted codebase intelligence from a local MCP backend when available. It also ships an active local backend at `skills/memory-management/scripts/memory.mjs`, with `auto`, `init`, `remember`, `recall`, `checkpoint`, `audit`, `forget`, and `status` commands that default to `~/.ai-memory` or `AI_MEMORY_ROOT`.

Memory entries carry lifecycle states (`CURRENT`, `STALE`, `SUPERSEDED`, `TEMPORARY`) so stale architecture decisions do not poison later implementation. Source precedence keeps current code authoritative over memory: current code > current config > project docs > explicit project memory > conversation memory > inferred memory. Checkpoints store only reusable durable knowledge—architectural decisions, non-obvious constraints, reusable bug root causes, project conventions, and environment quirks—not every task result. Decision memory records why a choice was made, not just what happened.

Automatic mode is wired into `using-laravel-standards`: the entrypoint tells agents to run `memory.mjs auto --cwd <project-root> --query "<task intent>"` before broad exploration, then checkpoint durable decisions at handoff when reusable knowledge was produced. The skill also ships `scripts/mcp-server.mjs` for stdio MCP tool access and `scripts/memory-hook.mjs` for lifecycle preflight/checkpoint hooks. For always-on code graph indexing and background watchers, pair this skill with a local codebase memory MCP such as `codebase-memory-mcp`.

For Hermes-style orchestration, the skill includes `references/hermes-orchestrator-profile.md` and an `orchestrator-profile` installer target. This documents portable policy for cross-session memory, external memory providers, skills-on-demand, provider failover, delegated workers, context compression, auxiliary providers, OpenAI-compatible API fronts, messaging gateways, VS Code ACP, Antigravity, and other editor/agent interfaces. The generated profile is non-secret routing metadata; the active host still owns provider switching, subagent execution, compression, and external sync.

Privacy stays first-class: anonymize cross-project knowledge, preserve provenance, verify against source code, and never persist secrets.

Example MCP config:

```json
{
  "mcpServers": {
    "syarif-memory-management": {
      "command": "node",
      "args": ["skills/memory-management/scripts/mcp-server.mjs"],
      "env": {
        "AI_MEMORY_ROOT": "~/.ai-memory"
      }
    }
  }
}
```

Installer/generator:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs detect
node skills/memory-management/scripts/install-memory-layer.mjs print --target all
node skills/memory-management/scripts/install-memory-layer.mjs install --target codex --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target ai-agent-tools --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-family --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-copilot-instructions --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-agent-instructions --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-acp-client --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target cursor --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target popular-editors --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target windsurf --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target cline --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target roo-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target continue-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target hermes --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target claude-code --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target gemini-cli --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target opencode --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target zed --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target claude --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target orchestrator-profile --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target hooks --apply
```

Note: `npx skills add ...` installs the skill files only. To enable the memory MCP/hook layer in a local editor or agent, run the memory installer above explicitly after the skill is installed.

For broad local coverage, `vscode-family` installs VS Code Stable, VS Code Insiders, VSCodium, and Code - OSS user MCP configs; `vscode-acp-client` prepares ACP Client for GitHub Copilot, Claude Code, Gemini CLI, and Codex CLI; `ai-agent-tools` covers Codex CLI, Claude Code, Gemini CLI, and OpenCode; `popular-editors` covers VS Code, Cursor, Windsurf, and Zed. Use `antigravity`, `kilo`, and `hermes` for their native configs, then `orchestrator-profile` when you want portable fallback/delegation/compression policy shared by those surfaces.

## Installation

Browse the skills.sh page:

```text
https://skills.sh/soden46/syarif-laravel-ai-skills
```

List available skills:

```bash
npx skills add soden46/syarif-laravel-ai-skills --list
```

Install all skills:

```bash
npx skills add soden46/syarif-laravel-ai-skills -s "*" -y
```

Install all skills globally for Codex:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y
```

Interactive install prompt:

```text
Select the Laravel App Skills group to select every skill, then press Enter.
```

Install one skill:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s form-requests -y
```

Verify installation:

```bash
npx skills list --global --agent codex
```

## Codex Plugin

This repository can be submitted directly to codex-marketplace.com because the root `.codex-plugin/plugin.json` points to canonical `skills/`.

This repo also ships a Codex plugin marketplace:

```bash
codex plugin marketplace add soden46/syarif-laravel-ai-skills --ref main
codex plugin add syarif-laravel-ai-skills@syarif-laravel-ai-skills
```

For local development from this checkout:

```bash
codex plugin marketplace add .
codex plugin add syarif-laravel-ai-skills@syarif-laravel-ai-skills
```

## Claude Code Plugin

The generated Claude plugin package lives at `plugins/laravel-app-skills`:

```bash
claude --plugin-dir ./plugins/laravel-app-skills
```

Inside Claude Code, reload and call a skill:

```text
/reload-plugins
/laravel-app-skills:using-laravel-standards
```

For personal-only usage without a plugin package, install skills directly:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a claude-code -s "*" -y
```

## Universal AI Usage

For assistants without native skill/plugin support, add this repo to the workspace and start with:

```text
Read AGENTS.md, then use skills/using-laravel-standards/SKILL.md as the entry skill for this Laravel repo. Load focused skills from skills/<skill-name>/SKILL.md only when relevant to the task.
```

Machine-readable metadata lives in `agent-skills.json`. Full assistant-specific notes are in [docs/UNIVERSAL_USAGE.md](docs/UNIVERSAL_USAGE.md).

## Quick Start

After installation, ask your assistant to start with:

```text
Use using-laravel-standards for this Laravel repo.
```

For focused tasks, call a smaller skill directly:

```text
Use least-code to make the smallest possible change.
Use form-requests to move this validation out of the controller.
Use database-transactions to review this checkout flow.
Use ui-agent-browser to design and implement this frontend against the Laravel backend contract.
Use memory-management to recall relevant project and workflow memory before implementing this related feature.
Use quality-checks before final handoff.
```

## What's Inside

### Core Local Standards

- `using-laravel-standards` - entry point and skill selector.
- `memory-management` - active secure memory for conversation, project, user, workflow, and codebase context.
- `least-code` - minimization gate that enforces YAGNI, reuse, stdlib, native features, installed dependencies, one-liners, change surface budget, behavior preservation, risk classification, and root-cause confidence before implementation.
- `extract-laravel-standards` - audit finished projects and propose reusable standards.
- `architecture` - Laravel-native architecture decisions.
- `controller-cleanup` - thin controllers and route boundaries.
- `form-requests` - validation and request authorization.
- `actions-and-services` - use-case boundaries, services, and integrations.
- `database-transactions` - atomic writes, locks, and after-commit work.
- `eloquent-patterns` - explicit models, relationships, and query shape.
- `livewire-development` - version-aware Livewire components, state, security, performance, and tests.
- `queues-and-jobs` - jobs, schedules, workers, and operational safety.
- `security` - authorization, request forgery, uploads, secrets, and APIs.
- `testing` - focused tests and verification before handoff.

### Topic Coverage

- **Start Here** - `using-laravel-standards`, `runner-selection`, `daily-workflow`, `memory-management`, `brainstorming`, `writing-plans`, `executing-plans`, `laravel-specialist`, `laravel-11-12-app-guidelines`.
- **Architecture** - `architecture`, `module-per-menu`, `actions-and-services`, `controller-cleanup`, `routes-best-practices`, `ports-and-adapters`, `interfaces-and-di`, `strategy-pattern`, `template-method-and-plugins`, `complexity-guardrails`, `constants-and-configuration`, `custom-helpers`.
- **HTTP and Security** - `form-requests`, `api-resources-and-pagination`, `api-surface-evolution`, `policies-and-authorization`, `rate-limiting`, `request-forgery-protection`, `security`.
- **Data and Eloquent** - `migrations-and-factories`, `eloquent-patterns`, `eloquent-relationships`, `database-transactions`, `data-chunking-large-datasets`.
- **Performance** - `laravel-database-optimization`, `performance-caching`, `performance-eager-loading`, `performance-select-columns`.
- **UI and Admin** - `blade-components-and-layouts`, `ui-agent-browser`, `livewire-development`, `nova-resource-patterns`, `internationalization-and-translation`.
- **Ops and Integrations** - `queues-and-jobs`, `horizon-metrics-and-dashboards`, `task-scheduling`, `filesystem-uploads`, `http-client-resilience`, `integrate-whatsapp-baileys-laravel`, `exception-handling-and-logging`, `config-env-storage`.
- **Quality** - `testing`, `tdd-with-pest`, `controller-tests`, `e2e-playwright`, `responsive-ui-testing`, `quality-checks`, `documentation-best-practices`, `dependencies-trim-packages`.
- **Modern Laravel** - `ai-sdk`, `vector-search`, `php-attributes`, `upgrade-13`.
- **Prompting** - `effective-context`, `prompt-structure`, `debugging-prompts`, `code-review-requests`, `iterating-on-code`, `specifying-constraints`, `using-examples-in-prompts`, `laravel-prompting-patterns`, `extract-laravel-standards`.

Run the list command for the complete catalog, or read [docs/SUPERPOWERS_SKILL_MAPPING.md](docs/SUPERPOWERS_SKILL_MAPPING.md) and [docs/LARAVEL_SKILLS_CLOUD_MAPPING.md](docs/LARAVEL_SKILLS_CLOUD_MAPPING.md) for public-topic mapping.

## How It Works

1. Each installable skill lives at `skills/<skill-folder>/SKILL.md`.
2. The `name` frontmatter uses `<skill-folder>`.
3. The `description` frontmatter appears in `npx skills add <repo> --list`.
4. The `tags` frontmatter includes `laravel` and `php` for Laravel Skills import.
5. `skills.sh.json` groups the skills shown on the skills.sh repository page.
6. `plugin-groups.json` assigns every skill to an installable plugin bundle.
7. `agent-skills.json` exposes neutral metadata for generic AI assistants and integration tools.
8. `.codex-plugin/plugin.json` exposes the repo root as a codex-marketplace.com artifact and points directly to `skills/`.
9. `.agents/plugins/marketplace.json` exposes the repo as a Codex/ChatGPT plugin marketplace.
10. `plugins/laravel-app-skills/.claude-plugin/plugin.json` makes the generated bundle usable with `claude --plugin-dir` after `npm run sync`.
11. `npm run sync` regenerates `agent-skills.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and local generated plugin output.
12. Generated `plugins/<plugin>/skills/` copies are ignored in Git so marketplace submissions stay under the 128-file scan limit.
13. `package.json` is only for local helper scripts. Users install from GitHub with `npx skills add`, not `npm install`.

## Marketplace Indexing

This repository is designed for skills.sh and Laravel Skills discovery:

1. `skills.sh` sees GitHub repositories after someone installs from the repo with the `skills` CLI.
2. `skills.sh` repo pages are cached, so updates can take time after a valid install.
3. Each skill includes `laravel` and `php` tags for Laravel Skills classification.
4. `skills.laravel.cloud` imports from the skills.sh ecosystem and lists Laravel/PHP skills after its import and security-audit pass.
5. Run `npx skills add soden46/syarif-laravel-ai-skills -s "*" -y` after pushing a release to refresh skills.sh telemetry.

## Local Development

```bash
npm run validate
npm run list
npm run install:local
npm run sync
```

To sync missing public topics from Superpowers Laravel:

```bash
npm run import:superpowers
npm run validate
npx skills add . --list
```

Use [docs/ADDING_SKILLS.md](docs/ADDING_SKILLS.md) as the standard for every future skill.

For contribution rules, privacy checks, and PR checklist, read [CONTRIBUTING.md](CONTRIBUTING.md).

## Reference

This README follows the readable documentation pattern from [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel): clear summary, install commands, quick start, catalog overview, workflow notes, and release links.

Related files:

- [RELEASE-NOTES.md](RELEASE-NOTES.md)
- [CHANGELOG.md](CHANGELOG.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [docs/ADDING_SKILLS.md](docs/ADDING_SKILLS.md)
- [docs/BILINGUAL_MARKDOWN.md](docs/BILINGUAL_MARKDOWN.md)
- [docs/LARAVEL_SKILLS_CLOUD_MAPPING.md](docs/LARAVEL_SKILLS_CLOUD_MAPPING.md)
- [docs/UNIVERSAL_USAGE.md](docs/UNIVERSAL_USAGE.md)

## License

MIT License - see [LICENSE](LICENSE).

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Skill Laravel-focused AI untuk Codex, Claude Code, dan AI coding assistant yang bisa membaca file Markdown. Install dengan `npx skills add`, pakai package plugin yang di-generate, atau arahkan assistant generic ke universal manifest dan folder `skills/`. Katalog ini sekarang menyertakan memory orchestration yang aman, gate minimisasi least-code, verifikasi yang sadar risiko, kedalaman adaptif, eksplorasi yang dibatasi, dan disiplin memory sehingga agent bisa mengingat konteks proyek yang berguna, menulis diff terkecil yang benar, menyesuaikan kedalaman trace dan test dengan risiko task, dan menghindari over-exploration atau memory poisoning.

## Yang Didapat

- **72 skill Laravel installable** - katalog skill Laravel yang fokus dengan topik tumpang tindih digabung menjadi skill canonical yang lebih kuat.
- **Gate minimisasi least-code** - `least-code` menerapkan YAGNI, reuse, stdlib, fitur native, dependency terinstal, one-liner, change surface budget, behavior preservation, risk classification, dan root-cause confidence sebelum skill implementasi lain dijalankan.
- **Verifikasi yang sadar risiko** - task diklasifikasikan LOW/MEDIUM/HIGH sehingga kedalaman trace, scope test, dan regression surface sesuai dengan risiko aktual, bukan selalu menjalankan full suite.
- **Kedalaman adaptif** - task kecil tetap kecil; task berbahaya dapat full trace, behavior preservation checks, dan failure-path verification tanpa over-exploration.
- **Eksplorasi yang dibatasi** - agent berhenti ketika execution path, affected callers, contract, dan verification surface sudah dipahami, bukan menggrep seluruh repository.
- **Disiplin memory** - memory entries memiliki lifecycle states, source precedence mencegah stale/inferred memory meng override current code, dan checkpoint menyimpan hanya reusable decisions.
- **Standar inti pribadi** - standar lokal dari proyek Laravel yang sudah direview dan workflow AI yang terus berkembang, tanpa detail client.
- **Cakupan topik publik** - 54 topik tambahan yang dimapping dari katalog skill Laravel publik tanpa menyalin isi body skill pihak ketiga.
- **Responsive UI testing** - skill Playwright khusus untuk mobile, tablet, desktop, overflow, clipping, tabel, modal, navigasi, dan state Livewire.
- **Workflow UI Agent Browser** - skill frontend/UI/UX yang menggabungkan inspeksi agent-browser, pengecekan Playwright, implementasi sesuai stack target, dan alignment kontrak backend.
- **Active Secure Memory** - `memory-management` mengatur conversation, project, user, workflow, dan codebase memory dengan retrieval relevan, command lokal file-backed, provenance, anonymization, dan guardrail anti-secret.
- **Discovery sederhana** - `npx skills add <repo> --list` membaca setiap `skills/<folder>/SKILL.md`.
- **Support AI universal** - bisa dipakai Codex, Claude Code, Copilot, OpenAI Codex/GPT, Antigravity, Cursor, Windsurf, Zed, Cline, Roo Code, Continue, Kilo Code, Hermes Agent, Aider, OpenCode, Gemini CLI, dan agent generik yang bisa membaca file.

## Memory Orchestrator

Skill `memory-management` adalah lapisan kontinuitas untuk kerja Laravel yang panjang. Agent bisa mengingat keputusan tahan lama, memahami pola proyek terkait, melanjutkan dari checkpoint sebelumnya, dan beradaptasi ketika repository saat ini membuktikan memory lama sudah stale.

Skill ini dirancang untuk menghemat token dengan hanya mengambil memory yang relevan: preferensi user, konvensi proyek, pola workflow, checkpoint percakapan, dan codebase intelligence terarah dari backend MCP lokal ketika tersedia. Skill ini juga membawa backend lokal aktif di `skills/memory-management/scripts/memory.mjs`, dengan command `auto`, `init`, `remember`, `recall`, `checkpoint`, `audit`, `forget`, dan `status` yang default ke `~/.ai-memory` atau `AI_MEMORY_ROOT`.

Memory entries memiliki lifecycle states (`CURRENT`, `STALE`, `SUPERSEDED`, `TEMPORARY`) sehingga architecture decisions lama tidak menyesatkan implementasi berikutnya. Source precedence menjamin current code selalu di atas memory: current code > current config > project docs > explicit project memory > conversation memory > inferred memory. Checkpoint menyimpan hanya reusable durable knowledge—architectural decisions, non-obvious constraints, reusable bug root causes, project conventions, environment quirks—bukan semua hasil task. Decision memory records why a choice was made, bukan cuma what happened.

Mode otomatis sudah disambungkan ke `using-laravel-standards`: entrypoint meminta agent menjalankan `memory.mjs auto --cwd <project-root> --query "<task intent>"` sebelum eksplorasi luas, lalu checkpoint keputusan tahan lama saat handoff jika reusable knowledge dihasilkan. Skill ini juga membawa `scripts/mcp-server.mjs` untuk tool MCP stdio dan `scripts/memory-hook.mjs` untuk lifecycle hook preflight/checkpoint. Untuk indexing graph kode yang selalu hidup dan background watcher, pasangkan skill ini dengan MCP lokal seperti `codebase-memory-mcp`.

Privasi tetap jadi aturan utama: anonymize knowledge lintas proyek, simpan provenance, verifikasi terhadap source code, dan jangan pernah persist secret.

Contoh config MCP:

```json
{
  "mcpServers": {
    "syarif-memory-management": {
      "command": "node",
      "args": ["skills/memory-management/scripts/mcp-server.mjs"],
      "env": {
        "AI_MEMORY_ROOT": "~/.ai-memory"
      }
    }
  }
}
```

Installer/generator:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs detect
node skills/memory-management/scripts/install-memory-layer.mjs print --target all
node skills/memory-management/scripts/install-memory-layer.mjs install --target codex --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target ai-agent-tools --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-family --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-copilot-instructions --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-agent-instructions --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-acp-client --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target cursor --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target popular-editors --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target windsurf --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target cline --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target roo-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target continue-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target hermes --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target claude-code --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target gemini-cli --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target opencode --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target zed --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target claude --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target hooks --apply
```

Catatan: `npx skills add ...` hanya memasang file skill. Untuk mengaktifkan memory MCP/hook di editor atau agent lokal, jalankan installer memory di atas secara eksplisit setelah skill terpasang.

Untuk cakupan lokal yang luas, `vscode-family` memasang config MCP user untuk VS Code Stable, VS Code Insiders, VSCodium, dan Code - OSS; `vscode-acp-client` menyiapkan ACP Client untuk GitHub Copilot, Claude Code, Gemini CLI, dan Codex CLI; `ai-agent-tools` mencakup Codex CLI, Claude Code, Gemini CLI, dan OpenCode; `popular-editors` mencakup VS Code, Cursor, Windsurf, dan Zed. Pakai `antigravity`, `kilo`, dan `hermes` untuk config native masing-masing.

## Instalasi

Lihat halaman skills.sh:

```text
https://skills.sh/soden46/syarif-laravel-ai-skills
```

Lihat daftar skill:

```bash
npx skills add soden46/syarif-laravel-ai-skills --list
```

Install semua skill:

```bash
npx skills add soden46/syarif-laravel-ai-skills -s "*" -y
```

Install semua skill global untuk Codex:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y
```

Prompt install interaktif:

```text
Pilih group Laravel App Skills untuk memilih semua skill, lalu tekan Enter.
```

Install satu skill:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s form-requests -y
```

Cek hasil install:

```bash
npx skills list --global --agent codex
```

## Plugin Codex

Repository ini bisa langsung disubmit ke codex-marketplace.com karena root `.codex-plugin/plugin.json` menunjuk ke canonical `skills/`.

Repo ini juga menyediakan marketplace plugin Codex:

```bash
codex plugin marketplace add soden46/syarif-laravel-ai-skills --ref main
codex plugin add syarif-laravel-ai-skills@syarif-laravel-ai-skills
```

Untuk development lokal dari checkout ini:

```bash
codex plugin marketplace add .
codex plugin add syarif-laravel-ai-skills@syarif-laravel-ai-skills
```

## Plugin Claude Code

Package plugin Claude yang digenerate ada di `plugins/laravel-app-skills`:

```bash
claude --plugin-dir ./plugins/laravel-app-skills
```

Di dalam Claude Code, reload lalu panggil skill:

```text
/reload-plugins
/laravel-app-skills:using-laravel-standards
```

Kalau cuma dipakai sendiri tanpa package plugin, install skill langsung:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a claude-code -s "*" -y
```

## Penggunaan AI Universal

Untuk assistant yang belum punya support skill/plugin native, masukkan repo ini ke workspace lalu mulai dengan:

```text
Read AGENTS.md, then use skills/using-laravel-standards/SKILL.md as the entry skill for this Laravel repo. Load focused skills from skills/<skill-name>/SKILL.md only when relevant to the task.
```

Metadata machine-readable ada di `agent-skills.json`. Catatan lengkap per assistant ada di [docs/UNIVERSAL_USAGE.md](docs/UNIVERSAL_USAGE.md).

## Quick Start

Setelah install, minta assistant mulai dari:

```text
Use using-laravel-standards for this Laravel repo.
```

Untuk task yang lebih spesifik, panggil skill kecil langsung:

```text
Use least-code to make the smallest possible change.
Use form-requests to move this validation out of the controller.
Use database-transactions to review this checkout flow.
Use ui-agent-browser to design and implement this frontend against the Laravel backend contract.
Use memory-management to recall relevant project and workflow memory before implementing this related feature.
Use quality-checks before final handoff.
```

## Isi Repository

### Standar Inti Lokal

- `using-laravel-standards` - entry point dan pemilih skill.
- `memory-management` - memory aktif yang aman untuk conversation, project, user, workflow, dan codebase context.
- `least-code` - gate minimisasi yang menerapkan YAGNI, reuse, stdlib, fitur native, dependency terinstal, one-liner, change surface budget, behavior preservation, risk classification, dan root-cause confidence sebelum implementasi.
- `extract-laravel-standards` - audit proyek selesai dan usulkan standar reusable.
- `architecture` - keputusan arsitektur Laravel-native.
- `controller-cleanup` - controller tipis dan batas route.
- `form-requests` - validasi dan request authorization.
- `actions-and-services` - use-case boundary, service, dan integrasi.
- `database-transactions` - atomic write, lock, dan after-commit work.
- `eloquent-patterns` - model, relationship, dan query shape yang eksplisit.
- `livewire-development` - komponen Livewire version-aware, state, security, performa, dan test.
- `queues-and-jobs` - job, schedule, worker, dan operational safety.
- `security` - authorization, request forgery, upload, secret, dan API.
- `testing` - test yang fokus dan verifikasi sebelum handoff.

### Cakupan Topik

- **Mulai Di Sini** - `using-laravel-standards`, `runner-selection`, `daily-workflow`, `memory-management`, `brainstorming`, `writing-plans`, `executing-plans`, `laravel-specialist`, `laravel-11-12-app-guidelines`.
- **Arsitektur** - `architecture`, `module-per-menu`, `actions-and-services`, `controller-cleanup`, `routes-best-practices`, `ports-and-adapters`, `interfaces-and-di`, `strategy-pattern`, `template-method-and-plugins`, `complexity-guardrails`, `constants-and-configuration`, `custom-helpers`.
- **HTTP dan Security** - `form-requests`, `api-resources-and-pagination`, `api-surface-evolution`, `policies-and-authorization`, `rate-limiting`, `request-forgery-protection`, `security`.
- **Data dan Eloquent** - `migrations-and-factories`, `eloquent-patterns`, `eloquent-relationships`, `database-transactions`, `data-chunking-large-datasets`.
- **Performance** - `laravel-database-optimization`, `performance-caching`, `performance-eager-loading`, `performance-select-columns`.
- **UI dan Admin** - `blade-components-and-layouts`, `ui-agent-browser`, `livewire-development`, `nova-resource-patterns`, `internationalization-and-translation`.
- **Operasional dan Integrasi** - `queues-and-jobs`, `horizon-metrics-and-dashboards`, `task-scheduling`, `filesystem-uploads`, `http-client-resilience`, `integrate-whatsapp-baileys-laravel`, `exception-handling-and-logging`, `config-env-storage`.
- **Quality** - `testing`, `tdd-with-pest`, `controller-tests`, `e2e-playwright`, `responsive-ui-testing`, `quality-checks`, `documentation-best-practices`, `dependencies-trim-packages`.
- **Modern Laravel** - `ai-sdk`, `vector-search`, `php-attributes`, `upgrade-13`.
- **Prompting** - `effective-context`, `prompt-structure`, `debugging-prompts`, `code-review-requests`, `iterating-on-code`, `specifying-constraints`, `using-examples-in-prompts`, `laravel-prompting-patterns`, `extract-laravel-standards`.

Jalankan command list untuk katalog lengkap, atau baca [docs/SUPERPOWERS_SKILL_MAPPING.md](docs/SUPERPOWERS_SKILL_MAPPING.md) dan [docs/LARAVEL_SKILLS_CLOUD_MAPPING.md](docs/LARAVEL_SKILLS_CLOUD_MAPPING.md) untuk mapping topik publik.

## Cara Kerja

1. Setiap skill installable berada di `skills/<skill-folder>/SKILL.md`.
2. Frontmatter `name` memakai format `<skill-folder>`.
3. Frontmatter `description` tampil di `npx skills add <repo> --list`.
4. Frontmatter `tags` berisi `laravel` dan `php` untuk import Laravel Skills.
5. `skills.sh.json` mengelompokkan skill yang tampil di halaman repository skills.sh.
6. `plugin-groups.json` menempatkan setiap skill ke bundle plugin installable.
7. `agent-skills.json` menyediakan metadata netral untuk AI assistant generik dan tool integrasi.
8. `.codex-plugin/plugin.json` membuat root repo bisa discan sebagai artifact codex-marketplace.com dan langsung menunjuk ke `skills/`.
9. `.agents/plugins/marketplace.json` membuat repo ini bisa dipakai sebagai marketplace plugin Codex/ChatGPT.
10. `plugins/laravel-app-skills/.claude-plugin/plugin.json` membuat bundle generated bisa dipakai dengan `claude --plugin-dir` setelah `npm run sync`.
11. `npm run sync` membuat ulang `agent-skills.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, dan output plugin generated lokal.
12. Copy generated `plugins/<plugin>/skills/` di-ignore dari Git supaya submission marketplace tetap di bawah limit scan 128 file.
13. `package.json` hanya untuk helper script lokal. User install dari GitHub dengan `npx skills add`, bukan `npm install`.

## Indexing Marketplace

Repository ini disiapkan untuk discovery skills.sh dan Laravel Skills:

1. `skills.sh` melihat repository GitHub setelah ada yang install dari repo memakai `skills` CLI.
2. Halaman repo `skills.sh` memakai cache, jadi update bisa butuh waktu setelah install valid.
3. Setiap skill punya tag `laravel` dan `php` untuk klasifikasi Laravel Skills.
4. `skills.laravel.cloud` import dari ekosistem skills.sh dan menampilkan skill Laravel/PHP setelah proses import dan security audit lolos.
5. Jalankan `npx skills add soden46/syarif-laravel-ai-skills -s "*" -y` setelah push release untuk refresh telemetry skills.sh.

## Development Lokal

```bash
npm run validate
npm run list
npm run install:local
npm run sync
```

Untuk sync topik publik yang belum ada dari Superpowers Laravel:

```bash
npm run import:superpowers
npm run validate
npx skills add . --list
```

Gunakan [docs/ADDING_SKILLS.md](docs/ADDING_SKILLS.md) sebagai standar setiap kali menambah skill baru.

Untuk aturan kontribusi, pengecekan privasi, dan checklist PR, baca [CONTRIBUTING.md](CONTRIBUTING.md).

## Referensi

README ini mengikuti pola dokumentasi yang mudah dibaca dari [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel): ringkasan jelas, command install, quick start, overview katalog, catatan workflow, dan link release.

File terkait:

- [RELEASE-NOTES.md](RELEASE-NOTES.md)
- [CHANGELOG.md](CHANGELOG.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [docs/ADDING_SKILLS.md](docs/ADDING_SKILLS.md)
- [docs/BILINGUAL_MARKDOWN.md](docs/BILINGUAL_MARKDOWN.md)
- [docs/LARAVEL_SKILLS_CLOUD_MAPPING.md](docs/LARAVEL_SKILLS_CLOUD_MAPPING.md)
- [docs/UNIVERSAL_USAGE.md](docs/UNIVERSAL_USAGE.md)

## Lisensi

MIT License - lihat [LICENSE](LICENSE).

</details>
