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
Use skills/least-code/SKILL.md to make the smallest possible change.
Use skills/form-requests/SKILL.md to move controller validation into a Form Request.
Use skills/laravel-database-optimization/SKILL.md to review this query flow.
Use skills/ui-agent-browser/SKILL.md to design and implement this frontend against the Laravel backend contract.
Use skills/memory-management/SKILL.md to recall relevant project, workflow, and conversation memory before implementing this related feature.
Use skills/quality-checks/SKILL.md before final handoff.
```

## Memory Continuity

Use `skills/memory-management/SKILL.md` when an assistant needs continuity across chats, repositories, or related feature patterns. The skill tells the assistant to retrieve only relevant memory, verify it against the current Laravel codebase, anonymize cross-project knowledge, preserve provenance, and never persist secrets.

The skill includes an active local backend at `skills/memory-management/scripts/memory.mjs`. Any assistant with file and Node.js access can run `auto`, `init`, `remember`, `recall`, `checkpoint`, `audit`, `forget`, and `status`; memory defaults to `~/.ai-memory` or `AI_MEMORY_ROOT`.

For automatic long-term memory, keep `using-laravel-standards` as the session entrypoint. It instructs the assistant to run `memory.mjs auto --cwd <project-root> --query "<task intent>"` before broad exploration, then write a checkpoint at handoff when durable project knowledge changed.

For assistants that support MCP, register `skills/memory-management/scripts/mcp-server.mjs` as a stdio MCP server. For assistants that support lifecycle hooks, run `skills/memory-management/scripts/memory-hook.mjs preflight` at session start and `memory-hook.mjs checkpoint` at handoff.

For Hermes-style long-running orchestration, read `skills/memory-management/references/hermes-orchestrator-profile.md`. It keeps memory as facts/context, skills as on-demand procedures, and provider fallback, task delegation, context compression, external memory sync, API serving, messaging gateways, and ACP behavior as host-owned capabilities.

Use `skills/memory-management/scripts/install-memory-layer.mjs` to detect supported local targets, print config snippets, or install with backups. It supports Codex CLI through `codex mcp add`, Claude Code user/project MCP registration, Gemini CLI settings, OpenCode settings, VS Code user or workspace `mcp.json`, global VS Code/GitHub Copilot and VS Code-family agent instructions, ACP Client for VS Code agent settings, Antigravity global or workspace `mcp_config.json`, Cursor, Windsurf, Zed, Cline, Roo Code project config, Continue workspace YAML config, Kilo Code global or workspace config, Hermes Agent YAML config, Claude-compatible JSON MCP config, generic JSON MCP config, a non-secret orchestrator profile, and a generic hook manifest.

If the skills were installed globally with `npx skills add ... -g`, register Codex memory from the installed skills directory. On Windows PowerShell:

```powershell
$SkillsRoot = "$env:USERPROFILE\.agents\skills"
$MemoryRoot = "$env:USERPROFILE\.ai-memory"

codex mcp remove syarif-memory-management
codex mcp add syarif-memory-management --env AI_MEMORY_ROOT=$MemoryRoot -- node "$SkillsRoot\memory-management\scripts\mcp-server.mjs"
codex mcp list
```

The final list should show `syarif-memory-management` as `enabled`. Relative `node skills/...` commands only work after you `cd` into a repository or install directory that contains `skills/`.

For VS Code-family editors and agents, install the MCP server, broader agent instructions, and ACP Client settings when you use that extension:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-family --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-agent-instructions --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-acp-client --apply
```

For the requested four-agent and four-editor coverage, use the aggregate targets:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target ai-agent-tools --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target popular-editors --apply
```

`ai-agent-tools` covers Codex CLI, Claude Code, Gemini CLI, and OpenCode. `popular-editors` covers VS Code, Cursor, Windsurf, and Zed.

For Antigravity, Kilo Code, and Hermes Agent, use their native config targets:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target hermes --apply
```

For portable fallback, delegation, compression, external memory provider, and multi-interface policy shared by those surfaces:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target orchestrator-profile --apply
```

Native skill install only copies the skill files. Run the memory installer explicitly after install to enable the active MCP or hook layer for a local agent.

This is especially useful when a task refers to previous work, such as "build this approval flow like the one from another project" or "continue the feature we paused last session." It can also delegate structural code questions to a local codebase memory MCP when one is available.

## Native Install Paths

Install all skills through skills.sh-compatible tooling:

```bash
npx skills add soden46/syarif-laravel-ai-skills -s "*" -y
```

Install globally for Codex:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y
```

Update installed Codex skills and refresh the active memory MCP registration:

```powershell
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y

$SkillsRoot = "$env:USERPROFILE\.agents\skills"
$MemoryRoot = "$env:USERPROFILE\.ai-memory"

codex mcp remove syarif-memory-management
codex mcp add syarif-memory-management --env AI_MEMORY_ROOT=$MemoryRoot -- node "$SkillsRoot\memory-management\scripts\mcp-server.mjs"
codex mcp list
```

If the MCP entry did not exist yet, ignore the remove error and run the add command. The final list should show `syarif-memory-management` as `enabled`.

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

For Cursor, Windsurf, Zed, Cline, Roo Code, Continue, Kilo Code, Hermes Agent, Aider, GitHub Copilot Chat, OpenAI Codex/GPT, Claude Code, Antigravity, Gemini CLI, OpenCode, and other assistants:

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
Use skills/least-code/SKILL.md to make the smallest possible change.
Use skills/form-requests/SKILL.md to move controller validation into a Form Request.
Use skills/laravel-database-optimization/SKILL.md to review this query flow.
Use skills/ui-agent-browser/SKILL.md to design and implement this frontend against the Laravel backend contract.
Use skills/memory-management/SKILL.md to recall relevant project, workflow, and conversation memory before implementing this related feature.
Use skills/quality-checks/SKILL.md before final handoff.
```

## Kontinuitas Memory

Gunakan `skills/memory-management/SKILL.md` ketika assistant butuh kontinuitas lintas chat, repository, atau pola fitur yang saling terkait. Skill ini mengarahkan assistant untuk mengambil hanya memory yang relevan, memverifikasi terhadap codebase Laravel saat ini, menganonimkan knowledge lintas proyek, menjaga provenance, dan tidak pernah menyimpan secret.

Skill ini membawa backend lokal aktif di `skills/memory-management/scripts/memory.mjs`. Assistant apa pun yang punya akses file dan Node.js bisa menjalankan `auto`, `init`, `remember`, `recall`, `checkpoint`, `audit`, `forget`, dan `status`; memory default ke `~/.ai-memory` atau `AI_MEMORY_ROOT`.

Untuk long-term memory otomatis, jadikan `using-laravel-standards` sebagai entrypoint session. Skill itu menginstruksikan assistant menjalankan `memory.mjs auto --cwd <project-root> --query "<task intent>"` sebelum eksplorasi luas, lalu menulis checkpoint saat handoff kalau ada knowledge proyek yang berubah.

Untuk assistant yang support MCP, daftarkan `skills/memory-management/scripts/mcp-server.mjs` sebagai stdio MCP server. Untuk assistant yang support lifecycle hook, jalankan `skills/memory-management/scripts/memory-hook.mjs preflight` saat session start dan `memory-hook.mjs checkpoint` saat handoff.

Gunakan `skills/memory-management/scripts/install-memory-layer.mjs` untuk detect target lokal, print snippet config, atau install dengan backup. Script ini support Codex CLI lewat `codex mcp add`, registrasi MCP user/project Claude Code, settings Gemini CLI, settings OpenCode, `mcp.json` user/workspace VS Code, instruksi global VS Code/GitHub Copilot dan agent keluarga VS Code, setting ACP Client for VS Code, config global/workspace Antigravity `mcp_config.json`, Cursor, Windsurf, Zed, Cline, config project Roo Code, config YAML workspace Continue, config global/workspace Kilo Code, config YAML Hermes Agent, config MCP JSON kompatibel Claude, config MCP JSON generik, dan manifest hook generik.

Kalau skill di-install global dengan `npx skills add ... -g`, register memory Codex dari folder skill yang sudah terpasang. Di Windows PowerShell:

```powershell
$SkillsRoot = "$env:USERPROFILE\.agents\skills"
$MemoryRoot = "$env:USERPROFILE\.ai-memory"

codex mcp remove syarif-memory-management
codex mcp add syarif-memory-management --env AI_MEMORY_ROOT=$MemoryRoot -- node "$SkillsRoot\memory-management\scripts\mcp-server.mjs"
codex mcp list
```

Output akhir harus menampilkan `syarif-memory-management` sebagai `enabled`. Command relatif `node skills/...` hanya jalan setelah masuk dengan `cd` ke repository atau folder install yang punya subfolder `skills/`.

Untuk editor dan agent keluarga VS Code, pasang MCP server, instruksi agent yang lebih luas, dan setting ACP Client kalau ekstensi itu dipakai:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-family --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-agent-instructions --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target vscode-acp-client --apply
```

Untuk cakupan 4 agent dan 4 editor yang diminta, pakai target agregat:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target ai-agent-tools --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target popular-editors --apply
```

`ai-agent-tools` mencakup Codex CLI, Claude Code, Gemini CLI, dan OpenCode. `popular-editors` mencakup VS Code, Cursor, Windsurf, dan Zed.

Untuk Antigravity, Kilo Code, dan Hermes Agent, gunakan target config native masing-masing:

```bash
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target antigravity-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target kilo-workspace --apply
node skills/memory-management/scripts/install-memory-layer.mjs install --target hermes --apply
```

Install skill native hanya memasang file skill. Jalankan installer memory secara eksplisit setelah install untuk mengaktifkan layer MCP atau hook di agent lokal.

Ini berguna ketika task merujuk pekerjaan lama, misalnya "buat approval flow ini seperti proyek lain" atau "lanjutkan fitur yang kemarin kita pause." Skill ini juga bisa mendelegasikan pertanyaan struktur kode ke codebase memory MCP lokal jika tersedia.

## Jalur Install Native

Install semua skill lewat tooling yang kompatibel dengan skills.sh:

```bash
npx skills add soden46/syarif-laravel-ai-skills -s "*" -y
```

Install global untuk Codex:

```bash
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y
```

Update skill Codex yang sudah terpasang dan refresh registrasi MCP memory yang aktif:

```powershell
npx skills add soden46/syarif-laravel-ai-skills -g -a codex -s "*" -y

$SkillsRoot = "$env:USERPROFILE\.agents\skills"
$MemoryRoot = "$env:USERPROFILE\.ai-memory"

codex mcp remove syarif-memory-management
codex mcp add syarif-memory-management --env AI_MEMORY_ROOT=$MemoryRoot -- node "$SkillsRoot\memory-management\scripts\mcp-server.mjs"
codex mcp list
```

Kalau entry MCP belum ada, abaikan error dari remove dan lanjutkan command add. Output akhir harus menampilkan `syarif-memory-management` sebagai `enabled`.

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

Untuk Cursor, Windsurf, Zed, Cline, Roo Code, Continue, Kilo Code, Hermes Agent, Aider, GitHub Copilot Chat, OpenAI Codex/GPT, Claude Code, Antigravity, Gemini CLI, OpenCode, dan assistant lain:

- Masukkan repository ini ke workspace assistant atau attach file yang relevan.
- Arahkan assistant ke `AGENTS.md`, `agent-skills.json`, dan `skills/using-laravel-standards/SKILL.md`.
- Minta assistant hanya membaca file `skills/<skill-name>/SKILL.md` yang relevan dengan task Laravel saat itu.
- Edit hanya di `skills/`; copy generated di `plugins/` dibuat ulang dengan `npm run sync`.

## Manifest Universal

`agent-skills.json` adalah manifest netral untuk tool yang butuh metadata machine-readable. Isinya repository, entry skill, command install, target integrasi, package plugin, dan semua path skill canonical.

</details>
