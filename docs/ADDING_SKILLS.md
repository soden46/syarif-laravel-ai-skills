# Adding Skills / Menambah Skill

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

Use this standard whenever adding or changing skills in this repository.

## Repository Rules

Installable skills must live only at:

```text
skills/<skill-folder>/SKILL.md
```

Folder names must use lowercase kebab-case without colons. The frontmatter `name` must match the folder suffix:

```markdown
---
name: example-skill
description: Clear trigger description that explains what the skill does and when an assistant should use it.
---
```

The `description` appears directly in `npx skills add <repo> --list`, so keep it readable as display text:

- Use one concise sentence.
- Aim for 40-180 characters.
- Do not use Markdown links or bullet formatting.
- Describe the reusable capability, not repository internals.

## Silent Execution

Apply orchestration internally. Do not recite layer names, protocol steps, checklists, or internal decision process unless the user explicitly asks for a plan or explanation. The normal output must focus on the requested code/task, not the framework.

## Layered Protocol

This repository uses a thin orchestrator with selective specialist activation. The always-loaded core is intentionally small; detailed knowledge stays in specialist skills loaded on demand.

### Core: Tiny Orchestrator

`using-laravel-standards` is the always-loaded entrypoint. It should remain approximately 150–300 tokens. Its job is routing, not knowledge delivery:

- Apply silently. Output only the minimal solution.
- Make the smallest safe change.
- Infer risk: LOW / MEDIUM / HIGH.
- Preserve unrelated behavior.
- Select only relevant specialist guidance.
- Verify proportionally to risk.
- Stop when complete.

### Specialist Activation

Load specialist skills only when the task domain requires them. Default to one primary skill and at most two supporting skills unless HIGH risk requires more.

- `least-code`: load for focused implementation, review, or refactor work when minimization discipline is needed.
- All other skills are on-demand execution skills.

### Conditional Memory Infrastructure

`memory-management` is not a specialist slot. `using-laravel-standards` may run sparse memory preflight before broad exploration when prior project, session, workflow, or decision context could materially affect correctness. Skip it for self-contained tasks. Prefer the active `syarif-memory-management` MCP server, fall back to `skills/memory-management/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5` when Node/file access exists, and continue normally when unavailable. Current code/config overrides memory.

### Risk Depth

- **LOW**: minimal local change. No new abstraction/dependency. No memory lookup unless prior context is necessary. One minimal targeted verification. No protocol narration.
- **MEDIUM**: trace affected execution path. Identify likely/confirmed root cause. Preserve affected contracts. Targeted regression verification. Load relevant specialist guidance.
- **HIGH**: inspect applicable security/data/concurrency/auth/migration/financial concerns. Failure paths. Affected regression surface. Explicit remaining uncertainty when meaningful. Load only relevant high-risk specialist guidance.

Do not load HIGH-risk guidance for LOW tasks.

## Conditional Memory

Run memory preflight only when the task depends on prior context, project history, or known conventions. For self-contained local tasks, skip memory entirely. Memory must remain subordinate to current code/config and outside the 0-2 specialist activation count.

## Risk Classification

Tasks must be classified before implementation. Risk level determines trace depth, verification depth, and review strictness:

- **LOW**: typo, Blade text, CSS kecil, rename lokal.
- **MEDIUM**: validation, query, Livewire state, controller/service refactor.
- **HIGH**: migration, auth, permission, payroll, financial calculation, concurrency, destructive action.

For HIGH risk, require full trace, regression verification, and explicit behavior preservation check.

## Behavior Preservation

Identify preservation constraints before editing. Expose them in user-visible output only when useful for handoff or HIGH-risk work. For LOW tasks, honor constraints silently without outputting a preservation list.

## Root-Cause Confidence

After tracing, classify confidence before patching:

- **CONFIRMED** — Evidence directly proves root cause.
- **LIKELY** — Evidence strongly suggests root cause but reproduction/test is incomplete.
- **UNKNOWN** — Insufficient evidence; do not perform speculative invasive fixes.

Never state "root cause is X" when confidence is LIKELY or UNKNOWN.

## Test Creation

Add or update a regression test only when:
- fixing a reproducible bug;
- changing business-critical behavior;
- changing authorization or validation boundaries;
- the affected behavior is not already adequately covered.

Prefer extending the nearest existing test over creating a new test structure.

## Change Surface Budget

Prefer, in order:
1. existing line/local expression
2. existing method
3. existing class/component
4. existing module boundary
5. new abstraction/file only when justified

Escalate the change surface only when the lower level cannot solve the root cause safely.

## Regression Surface

For HIGH risk, verify the affected regression surface, not necessarily the entire test suite. Run the full suite only when it is cheap or explicitly justified.

## Memory Checkpoint

Memory checkpoint is never a requirement for task completion. It occurs only when durable reusable knowledge was produced. If no reusable knowledge was generated, finish without checkpointing.

## Source Precedence

When memory conflicts with current evidence, trust: current code > current config > project docs > explicit project memory > conversation memory > inferred memory.

## Architecture Note

Keep the permanent control plane thin: Memory → Decision/minimization → Framework orchestration. Treat Laravel, Livewire, Database, Testing, Security, and API skills as on-demand execution skills, not permanent layers.

## Bilingual Markdown

Human-facing Markdown files should use the bilingual switch pattern from [docs/BILINGUAL_MARKDOWN.md](BILINGUAL_MARKDOWN.md). Skill `SKILL.md` files may stay concise in English when the text is meant primarily for assistant activation, but user-facing docs should include both languages.

## Importing Public Topic Skills

This repository keeps personal core standards and public topic coverage separate:

- Core standards should be written directly from this repository's Laravel conventions.
- Public reference topics may be mapped into local skills, but do not copy third-party skill body text.
- Use `docs/SUPERPOWERS_SKILL_MAPPING.md` to track which public topics were mapped.

To scan [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) and add missing topic skills:

```bash
npm run import:superpowers
npm run sync
npm run validate
npx skills add . --list
```

## Supporting Folders

These folders are repository support material, not skills:

```text
proposals/
scripts/
templates/
docs/
```

Do not place `SKILL.md` in those folders.

## skills.sh Page Grouping

The skills.sh repository page is controlled by root `skills.sh.json`.

- Use the skill slug from `skills/<skill-folder>` in each grouping.
- Keep group titles short.
- Put every public skill in exactly one group so the page stays easy to scan.
- `npm run validate` checks that every grouped skill exists and every skill is grouped.

## Universal Assistant Metadata

`agent-skills.json` is generated by `npm run sync`. It gives generic AI assistants and integration tools a stable map of the entry skill, canonical skill paths, install commands, and generated plugin packages.

Do not edit `agent-skills.json` manually. Update `skills/`, `skills.sh.json`, or `plugin-groups.json`, then run `npm run sync`.

Root `.codex-plugin/plugin.json` is also generated by `npm run sync` for codex-marketplace.com submissions. It points directly to canonical `skills/` so the marketplace artifact does not need generated plugin skill copies.

Root `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` are generated by `npm run sync` for Claude Code root usage. They also point to canonical `skills/`.

Generated `plugins/<plugin>/skills/` copies are local build output and are ignored in Git to keep the submitted artifact under the 128-file scan limit.

## Checklist

Before committing a new skill:

1. Search existing names, descriptions, triggers, and workflows; merge into a canonical skill when the topic substantially overlaps.
2. Create `skills/<skill-folder>/SKILL.md` only when no canonical skill already owns the workflow.
3. Set frontmatter `name` to `<skill-folder>`.
4. Add the skill to one `skills.sh.json` grouping.
5. Add the skill to one `plugin-groups.json` plugin.
6. Keep root free of `SKILL.md`.
7. Keep nested folders free of extra `SKILL.md` files.
8. Run `npm run sync` when skills or plugin grouping changes so `agent-skills.json`, `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, `plugins/<plugin>/.claude-plugin/plugin.json`, and local generated `plugins/` output stay current.
9. Run `npm run validate`.
10. Run `npx skills add . --list` before pushing to preview discovery.
11. Run `npx skills add soden46/syarif-laravel-ai-skills --list` after pushing to verify GitHub discovery.
12. Run `npx skills add soden46/syarif-laravel-ai-skills -s "*" -y` after pushing a release so skills.sh telemetry sees the public repo.

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Gunakan standar ini setiap kali menambah atau mengubah skill di repository ini.

## Aturan Repository

Skill yang bisa di-install hanya boleh berada di:

```text
skills/<skill-folder>/SKILL.md
```

Nama folder harus lowercase kebab-case tanpa titik dua. Frontmatter `name` harus cocok dengan suffix folder:

```markdown
---
name: example-skill
description: Deskripsi trigger yang jelas tentang fungsi skill dan kapan assistant harus memakainya.
---
```

`description` akan tampil langsung di `npx skills add <repo> --list`, jadi pastikan enak dibaca:

- Pakai satu kalimat ringkas.
- Target 40-180 karakter.
- Jangan pakai Markdown link atau bullet formatting.
- Jelaskan kemampuan reusable, bukan detail internal repo.

## Protokol Berlapis

Repository ini menggunakan orchestrator tipis dengan aktivasi specialist selektif. Always-loaded core sengaja kecil; knowledge detail tetap di specialist skills yang dimuat on-demand.

### Core: Tiny Orchestrator

`using-laravel-standards` adalah always-loaded entrypoint. Target ~150–300 token. Fungsinya routing, bukan knowledge delivery:

- Apply silently. Output only the minimal solution.
- Make the smallest safe change.
- Infer risk: LOW / MEDIUM / HIGH.
- Preserve unrelated behavior.
- Select only relevant specialist guidance.
- Verify proportionally to risk.
- Stop when complete.

### Specialist Activation

Load specialist skills hanya ketika task memerlukannya. Default: 1 primary skill, maksimum 1–2 supporting skills kecuali HIGH risk membutuhkan lebih.

- `least-code`: load untuk implementation, review, atau refactor yang butuh minimisasi.
- Skill lain: on-demand execution skills.

### Conditional Memory Infrastructure

`memory-management` bukan slot specialist. `using-laravel-standards` boleh menjalankan memory preflight yang sparse sebelum eksplorasi luas ketika konteks proyek, session, workflow, atau decision lama bisa mempengaruhi correctness. Skip untuk task self-contained. Utamakan MCP aktif `syarif-memory-management`, fallback ke `skills/memory-management/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>" --limit 5` jika Node/file access tersedia, dan lanjut normal jika unavailable. Current code/config tetap mengalahkan memory.

### Context Efficiency

- Keep the always-loaded orchestrator (`using-laravel-standards`) under 300 tokens.
- Keep specialist skill `SKILL.md` bodies under 500 lines.
- Move detailed tables, examples, and long guidance into `references/`.
- Link reference files directly from `SKILL.md`; avoid nested reference chasing.
- Prefer scripts for repeatable or fragile operations.
- Keep skill bodies concise, action-oriented, and free of client names, secrets, private URLs, personal data, and one-off business rules.

## Markdown Bilingual

File Markdown untuk manusia harus memakai pola switch bilingual dari [docs/BILINGUAL_MARKDOWN.md](BILINGUAL_MARKDOWN.md). File `SKILL.md` boleh tetap ringkas dalam bahasa Inggris jika tujuannya terutama untuk aktivasi assistant, tapi dokumentasi user-facing harus punya dua bahasa.

## Import Skill Topik Publik

Repository ini memisahkan standar inti pribadi dan cakupan topik publik:

- Standar inti harus ditulis langsung dari convention Laravel di repository ini.
- Topik referensi publik boleh dimapping ke skill lokal, tapi jangan menyalin isi body skill pihak ketiga.
- Pakai `docs/SUPERPOWERS_SKILL_MAPPING.md` untuk melacak topik publik yang sudah dimapping.

Untuk scan [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) dan menambahkan skill topik yang belum ada:

```bash
npm run import:superpowers
npm run sync
npm run validate
npx skills add . --list
```

## Folder Pendukung

Folder ini adalah material pendukung repository, bukan skill:

```text
proposals/
scripts/
templates/
docs/
```

Jangan menaruh `SKILL.md` di folder tersebut.

## Grouping Halaman skills.sh

Halaman repository di skills.sh dikontrol oleh `skills.sh.json` di root.

- Pakai slug skill dari `skills/<skill-folder>` di setiap grouping.
- Buat judul group tetap pendek.
- Masukkan setiap skill publik tepat ke satu group supaya halaman mudah discan.
- `npm run validate` mengecek setiap skill yang digroup memang ada dan semua skill sudah digroup.

## Metadata Assistant Universal

`agent-skills.json` digenerate oleh `npm run sync`. File ini memberi AI assistant generik dan tool integrasi peta stabil untuk entry skill, path skill canonical, command install, dan package plugin generated.

Jangan edit `agent-skills.json` manual. Update `skills/`, `skills.sh.json`, atau `plugin-groups.json`, lalu jalankan `npm run sync`.

Root `.codex-plugin/plugin.json` juga digenerate oleh `npm run sync` untuk submission codex-marketplace.com. File ini langsung menunjuk ke canonical `skills/` supaya artifact marketplace tidak perlu membawa copy skill generated.

Root `.claude-plugin/plugin.json` dan `.claude-plugin/marketplace.json` digenerate oleh `npm run sync` untuk penggunaan Claude Code dari root repo. Keduanya juga menunjuk ke canonical `skills/`.

Copy generated `plugins/<plugin>/skills/` adalah output build lokal dan di-ignore dari Git supaya artifact submission tetap di bawah limit scan 128 file.

## Checklist

Sebelum commit skill baru:

1. Cari nama, deskripsi, trigger, dan workflow yang sudah ada; merge ke skill canonical kalau topiknya banyak tumpang tindih.
2. Buat `skills/<skill-folder>/SKILL.md` hanya kalau belum ada skill canonical yang memiliki workflow tersebut.
3. Set frontmatter `name` menjadi `<skill-folder>`.
4. Tambahkan skill ke satu grouping di `skills.sh.json`.
5. Tambahkan skill ke satu plugin di `plugin-groups.json`.
6. Pastikan root repo tidak punya `SKILL.md`.
7. Pastikan nested folder tidak punya `SKILL.md` tambahan.
8. Jalankan `npm run sync` kalau skill atau grouping plugin berubah supaya `agent-skills.json`, `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, `plugins/<plugin>/.claude-plugin/plugin.json`, dan output lokal generated `plugins/` tetap sinkron.
9. Jalankan `npm run validate`.
10. Jalankan `npx skills add . --list` sebelum push untuk preview discovery.
11. Jalankan `npx skills add soden46/syarif-laravel-ai-skills --list` setelah push untuk verifikasi discovery GitHub.
12. Jalankan `npx skills add soden46/syarif-laravel-ai-skills -s "*" -y` setelah push release supaya telemetry skills.sh melihat repo publik.

</details>
