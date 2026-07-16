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

## Checklist

Before committing a new skill:

1. Create `skills/<skill-folder>/SKILL.md`.
2. Set frontmatter `name` to `<skill-folder>`.
3. Add the skill to one `skills.sh.json` grouping.
4. Add the skill to one `plugin-groups.json` plugin.
5. Keep root free of `SKILL.md`.
6. Keep nested folders free of extra `SKILL.md` files.
7. Run `npm run sync` when skills or plugin grouping changes so `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, `plugins/<plugin>/.claude-plugin/plugin.json`, and `plugins/` stay current.
8. Run `npm run validate`.
9. Run `npx skills add . --list` before pushing to preview discovery.
10. Run `npx skills add soden46/syarif-laravel-ai-skills --list` after pushing to verify GitHub discovery.
11. Run `npx skills add soden46/syarif-laravel-ai-skills -s "*" -y` after pushing a release so skills.sh telemetry sees the public repo.

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

## Checklist

Sebelum commit skill baru:

1. Buat `skills/<skill-folder>/SKILL.md`.
2. Set frontmatter `name` menjadi `<skill-folder>`.
3. Tambahkan skill ke satu grouping di `skills.sh.json`.
4. Tambahkan skill ke satu plugin di `plugin-groups.json`.
5. Pastikan root repo tidak punya `SKILL.md`.
6. Pastikan nested folder tidak punya `SKILL.md` tambahan.
7. Jalankan `npm run sync` kalau skill atau grouping plugin berubah supaya `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, `plugins/<plugin>/.claude-plugin/plugin.json`, dan `plugins/` tetap sinkron.
8. Jalankan `npm run validate`.
9. Jalankan `npx skills add . --list` sebelum push untuk preview discovery.
10. Jalankan `npx skills add soden46/syarif-laravel-ai-skills --list` setelah push untuk verifikasi discovery GitHub.
11. Jalankan `npx skills add soden46/syarif-laravel-ai-skills -s "*" -y` setelah push release supaya telemetry skills.sh melihat repo publik.

</details>
