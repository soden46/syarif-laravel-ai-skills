# Universal AI Usage / Penggunaan AI Universal

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

Use this repository as a universal Laravel skill pack. The canonical source is plain Markdown:

```text
skills/<skill-name>/SKILL.md
```

Any AI assistant that can read repository files can use the skills, even when it does not support `skills.sh`, Codex plugins, or Claude Code plugins natively.

## Universal Prompt

Paste this into any coding assistant after opening or attaching this repository:

```text
Read AGENTS.md, then use skills/using-laravel-standards/SKILL.md as the entry skill for this Laravel repo. Load focused skills from skills/<skill-name>/SKILL.md only when relevant to the task. Do not edit generated plugin copies under plugins/.
```

For a focused task:

```text
Use skills/form-requests/SKILL.md to move controller validation into a Form Request.
Use skills/laravel-database-optimization/SKILL.md to review this query flow.
Use skills/quality-checks/SKILL.md before final handoff.
```

## Native Install Paths

Install all skills through skills.sh-compatible tooling:

```bash
npx skills add soden46/syarif-laravel-ai-skills -s "*" -y
```

Install globally for Codex:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y
```

Install as a Codex plugin:

```bash
codex plugin marketplace add soden46/syarif-laravel-ai-skills --ref main
codex plugin add syarif-laravel-ai-skills@syarif-laravel-ai-skills
```

Run as a local Claude Code plugin:

```bash
claude --plugin-dir ./plugins/laravel-app-skills
/reload-plugins
/laravel-app-skills:using-laravel-standards
```

## Generic Assistants

For Cursor, Windsurf, Cline, Aider, GitHub Copilot Chat, Gemini CLI, OpenCode, and other assistants:

- Add this repository to the assistant workspace or attach the relevant files.
- Point the assistant at `AGENTS.md`, `agent-skills.json`, and `skills/using-laravel-standards/SKILL.md`.
- Ask it to load only the focused `skills/<skill-name>/SKILL.md` files needed for the current Laravel task.
- Keep edits in canonical `skills/`; generated plugin copies under `plugins/` are refreshed by `npm run sync`.

## Universal Manifest

`agent-skills.json` is a neutral manifest for tools that want machine-readable metadata. It lists the repository, entry skill, install commands, integration targets, plugin packages, and every canonical skill path.

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Gunakan repository ini sebagai paket skill Laravel universal. Sumber canonical-nya adalah Markdown biasa:

```text
skills/<skill-name>/SKILL.md
```

AI assistant apa pun yang bisa membaca file repository bisa memakai skill ini, walaupun belum punya support native untuk `skills.sh`, plugin Codex, atau plugin Claude Code.

## Prompt Universal

Tempel ini ke AI coding assistant setelah membuka atau attach repository ini:

```text
Read AGENTS.md, then use skills/using-laravel-standards/SKILL.md as the entry skill for this Laravel repo. Load focused skills from skills/<skill-name>/SKILL.md only when relevant to the task. Do not edit generated plugin copies under plugins/.
```

Untuk task spesifik:

```text
Use skills/form-requests/SKILL.md to move controller validation into a Form Request.
Use skills/laravel-database-optimization/SKILL.md to review this query flow.
Use skills/quality-checks/SKILL.md before final handoff.
```

## Jalur Install Native

Install semua skill lewat tooling yang kompatibel dengan skills.sh:

```bash
npx skills add soden46/syarif-laravel-ai-skills -s "*" -y
```

Install global untuk Codex:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y
```

Install sebagai plugin Codex:

```bash
codex plugin marketplace add soden46/syarif-laravel-ai-skills --ref main
codex plugin add syarif-laravel-ai-skills@syarif-laravel-ai-skills
```

Jalankan sebagai plugin lokal Claude Code:

```bash
claude --plugin-dir ./plugins/laravel-app-skills
/reload-plugins
/laravel-app-skills:using-laravel-standards
```

## Assistant Generik

Untuk Cursor, Windsurf, Cline, Aider, GitHub Copilot Chat, Gemini CLI, OpenCode, dan assistant lain:

- Masukkan repository ini ke workspace assistant atau attach file yang relevan.
- Arahkan assistant ke `AGENTS.md`, `agent-skills.json`, dan `skills/using-laravel-standards/SKILL.md`.
- Minta assistant hanya membaca file `skills/<skill-name>/SKILL.md` yang relevan dengan task Laravel saat itu.
- Edit hanya di `skills/`; copy generated di `plugins/` dibuat ulang dengan `npm run sync`.

## Manifest Universal

`agent-skills.json` adalah manifest netral untuk tool yang butuh metadata machine-readable. Isinya repository, entry skill, command install, target integrasi, package plugin, dan semua path skill canonical.

</details>
