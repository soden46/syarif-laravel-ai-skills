# Resume: Syarif Laravel AI Skills - Layered Protocol & least-code Integration

## Ringkasan Perubahan

Repository ini telah diubah dari kumpulan skill independen menjadi sistem berlapis yang saling melengkapi. Tujuan utamanya adalah meminimalkan token usage tanpa menurunkan kualitas output, serta memastikan setiap task melewati urusan yang benar sebelum kode ditulis atau diubah.

Perubahan ini mencakup:
- penambahan skill `least-code` sebagai layer minimization kedua,
- penguatan `memory-management` menjadi conditional preflight infrastructure,
- redesign `using-laravel-standards` menjadi strict orchestrator 5 lapis,
- restructuring `skills.sh.json` menjadi layer-based grouping,
- penambahan `Context Efficiency` footer ke skill inti,
- sinkronisasi metadata `agent-skills.json` dan `plugin-groups.json`.

## Daftar Perubahan File

### File Baru
- `skills/least-code/SKILL.md` — skill minimization baru berbasis konsep Graphify-Labs/ponytail, diadaptasi untuk Laravel
- `skills/memory-management/references/graph-memory.md` — referensi graph memory commands dan format

### File Diubah
- `AGENTS.md` — ditambahkan `Layered Protocol` sebagai master workflow
- `skills/using-laravel-standards/SKILL.md` — diubah menjadi strict layered orchestrator
- `skills/memory-management/SKILL.md` — dipangkas menjadi lean; detail dipindah ke references
- `skills/laravel-specialist/SKILL.md` — menambahkan deklarasi asumsi layer 0-2 sudah dijalankan
- `skills/brainstorming/SKILL.md` — menambahkan deklarasi asumsi layer 0-1 sudah dijalankan
- `skills/architecture/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/controller-cleanup/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/eloquent-patterns/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/actions-and-services/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/form-requests/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/database-transactions/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/testing/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/tdd-with-pest/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills/quality-checks/SKILL.md` — ditambahkan `Context Efficiency` footer
- `skills.sh.json` — diorganisir per layer: Preflight, Minimization, Orchestration, Implementation, Verification, Prompting, Daily Workflow, Security
- `plugin-groups.json` — `least-code` ditambahkan ke plugin `laravel-app-skills`
- `agent-skills.json` — entri `least-code` ditambahkan
- `skills/ponytail/SKILL.md` — di-rename dan diubah menjadi `skills/least-code/SKILL.md`
- Semua referensi "ponytail" diganti menjadi "least-code" di seluruh file `.md` dan `.json`

## Kemampuan Skill

### memory-management (Conditional Infrastructure)
- Automatic project detection dan anonymous project ID
- Memory preflight conditional dengan recall budget terbatas
- Graph memory: query, path, explain, god-nodes, communities, consolidate
- MCP stdio server untuk tool calls
- Lifecycle hooks untuk preflight dan checkpoint
- Safe memory writes dengan secret/personal-data guard
- Markdown + JSON graph backend

### least-code (Layer 1)
- YAGNI gate: menolak kebutuhan spekulatif sebelum kode ditulis
- Reuse gate: mencari helper/pattern yang sudah ada di codebase
- Stdlib gate: memilih standard library sebelum custom code
- Native platform gate: memilih PHP/Laravel built-in sebelum dependency
- Dependency gate: memilih installed dependency sebelum menambah baru
- One-liner gate: memaksa solusi satu baris jika memungkinkan
- Minimum working code gate: hanya menulis kode minimum yang bekerja
- Root-cause bug fixing: grep semua caller sebelum edit
- Output discipline: code first, maksimal 3 baris penjelasan

### using-laravel-standards (Layer 2)
- Strict layered protocol enforcement
- Stack detection: Laravel version, PHP, Sail/container, frontend, test framework, queue, quality tools
- Skill selection: memilih smallest relevant skill set
- Context efficiency rules: load hanya yang dibutuhkan, never load all skills
- Graph-aware recall: prefer graph query jika graph tersedia

### Skill Inti Lain (Layer 3)
Setiap skill inti memiliki `Context Efficiency` footer yang menentukan:
- Layer mana skill ini berada
- Kapan skill ini harus di-load
- Prinsip minimalisasi untuk skill tersebut

### testing / quality-checks / tdd-with-pest (Layer 4)
- Smallest meaningful verification set
- Behavior-focused tests, bukan implementation mirroring
- RED-GREEN-REFACTOR tight cycle
- Quality gates: Pint, static analysis, E2E

## Standar Skill

Semua skill mengikuti standar ini:
- **SKILL.md only**: frontmatter `name`, `description`, optional `tags`
- **Context Efficiency footer**: setiap skill menyatakan layer dan when-to-load
- **No client names/secrets**: semua contoh aman dan generic
- **References on demand**: detail panjang dipindah ke `references/`
- **Layer declaration**: setiap skill menyatakan layer di header atau footer
- **Delegation over duplication**: skill orchestrator delegasi ke focused skill, tidak menduplikasi

## Flow Skill

```text
User Request
    |
    v
Conditional memory preflight
    |  run only when prior project/session/workflow/decision context materially matters
    |  skip for self-contained tasks; SKIP is success
    |  memory-management does not consume specialist slots
    v
Layer 1: least-code activation
    |  YAGNI -> reuse -> stdlib -> native -> dependency -> one-liner -> minimum code
    v
Layer 2: using-laravel-standards
    |  stack detection -> skill selection -> load only focused skills
    v
Layer 3: Focused Implementation Skills
    |  architecture / eloquent-patterns / controller-cleanup / ...
    v
Layer 4: Verification
    |  testing / quality-checks / tdd-with-pest
    v
Handoff: memory-management checkpoint only for durable reusable knowledge
```

## Dampak Penggunaan

### Token Usage
- Preflight menggunakan `--limit 5` sehingga memory recall terbatas
- Graph query menggantikan loading semua file Markdown
- Skill hanya di-load ketika relevan, tidak ada bulk loading
- Context budget default: ~6000 tokens dengan alokasi per scope

### Kualitas Output
- Setiap task melewati validasi sebelum implementasi
- YAGNI memaksa pertanyaan "apakah ini benar-benar dibutuhkan?"
- Bug fix mengarah ke root cause, bukan gejala
- Verifikasi menggunakan smallest meaningful test set

### Keamanan
- Secret detection otomatis sebelum memory persist
- Personal-data classification sebelum disimpan
- Anonymization untuk cross-project sharing
- Audit trail untuk semua memory writes

### Maintainability
- Skill terorganisir per layer, mudah ditambah atau diubah
- Metadata terpusat di `agent-skills.json` dan `plugin-groups.json`
- Validation otomatis via `npm run validate`
- Sync otomatis via `npm run sync`

### Performa
- Graph memory untuk relationship tracing tanpa LLM call
- Local-first storage, tidak ada dependency eksternal untuk preflight
- MCP server ringan, stdio-based
- Lifecycle hooks untuk automation
