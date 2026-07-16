# Contributing / Kontribusi

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

Thanks for improving this Laravel AI skill catalog. Keep contributions practical, reusable, and safe for public installation.

## Contribution Types

- Add a new Laravel skill under `skills/<skill-folder>/SKILL.md`.
- Improve an existing skill's instructions, workflow, or references.
- Add reusable docs under `docs/` or templates under `templates/`.
- Propose standards extracted from completed Laravel projects under `proposals/pending/`.
- Map missing public topic coverage from [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) without copying third-party skill body text.

## Ground Rules

- Do not include client names, internal URLs, credentials, secrets, private business rules, personal data, or temporary project workarounds.
- Keep skill folders lowercase kebab-case: `skills/example-skill/SKILL.md`.
- Keep skill names matching the folder: `name: example-skill`.
- Keep `description` as a plain single sentence between 40 and 180 characters.
- Do not add `SKILL.md` outside `skills/<skill-folder>/SKILL.md`.
- Keep user-facing Markdown bilingual using [docs/BILINGUAL_MARKDOWN.md](docs/BILINGUAL_MARKDOWN.md).

## Add Or Update A Skill

1. Read [docs/ADDING_SKILLS.md](docs/ADDING_SKILLS.md).
2. Create or edit `skills/<skill-folder>/SKILL.md`.
3. Use only this frontmatter shape:

```markdown
---
name: example-skill
description: Clear trigger description that explains what the skill does and when an assistant should use it.
---
```

4. Keep the body concise and action-oriented.
5. Add references only when the skill would otherwise become too long.
6. Run validation before handoff.

## Import Public Topic Skills

To sync missing topic skills from Superpowers Laravel:

```bash
npm run import:superpowers
npm run sync
npm run validate
npx skills add . --list
```

Review generated skills before committing. They should map the public topic into this repository's standards without copying upstream body text.

## Validate Before Commit

Run:

```bash
npm run validate
npm run list
npx skills add . --list
```

After pushing, verify GitHub discovery:

```bash
npx skills add soden46/syarif-laravel-ai-skills --list
```

Expected result: the CLI reports all installable skills and every skill has a readable folder-aligned name.

## Pull Request Checklist

- Skill frontmatter is valid.
- Local validation passes.
- `npx skills add . --list` shows the expected skill count.
- Public docs are bilingual when user-facing.
- No client-identifying or sensitive project details are included.
- README, release notes, mapping docs, or changelog are updated when the catalog changes.

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Makasih sudah bantu ningkatin katalog skill AI Laravel ini. Jaga kontribusi tetap praktis, reusable, dan aman untuk instalasi publik.

## Jenis Kontribusi

- Menambah skill Laravel baru di `skills/<skill-folder>/SKILL.md`.
- Memperbaiki instruksi, workflow, atau referensi skill yang sudah ada.
- Menambah dokumentasi reusable di `docs/` atau template di `templates/`.
- Mengusulkan standar dari proyek Laravel yang sudah selesai di `proposals/pending/`.
- Mapping cakupan topik publik yang belum ada dari [jpcaparas/superpowers-laravel](https://github.com/jpcaparas/superpowers-laravel) tanpa menyalin isi body skill pihak ketiga.

## Aturan Dasar

- Jangan memasukkan nama client, URL internal, kredensial, secret, aturan bisnis privat, data personal, atau workaround sementara dari proyek.
- Pakai folder skill lowercase kebab-case: `skills/example-skill/SKILL.md`.
- Pakai nama skill yang cocok dengan folder: `name: example-skill`.
- Buat `description` sebagai satu kalimat polos dengan panjang 40 sampai 180 karakter.
- Jangan menambah `SKILL.md` di luar `skills/<skill-folder>/SKILL.md`.
- Markdown user-facing harus bilingual memakai [docs/BILINGUAL_MARKDOWN.md](docs/BILINGUAL_MARKDOWN.md).

## Menambah Atau Mengubah Skill

1. Baca [docs/ADDING_SKILLS.md](docs/ADDING_SKILLS.md).
2. Buat atau edit `skills/<skill-folder>/SKILL.md`.
3. Pakai bentuk frontmatter ini saja:

```markdown
---
name: example-skill
description: Deskripsi trigger yang jelas tentang fungsi skill dan kapan assistant harus memakainya.
---
```

4. Buat body tetap ringkas dan action-oriented.
5. Tambah referensi hanya kalau skill akan terlalu panjang.
6. Jalankan validasi sebelum handoff.

## Import Skill Topik Publik

Untuk sync skill topik yang belum ada dari Superpowers Laravel:

```bash
npm run import:superpowers
npm run sync
npm run validate
npx skills add . --list
```

Review skill hasil generate sebelum commit. Skill harus memetakan topik publik ke standar repo ini tanpa menyalin body upstream.

## Validasi Sebelum Commit

Jalankan:

```bash
npm run validate
npm run list
npx skills add . --list
```

Setelah push, cek discovery dari GitHub:

```bash
npx skills add soden46/syarif-laravel-ai-skills --list
```

Hasil yang diharapkan: CLI menampilkan semua skill installable dan setiap skill punya nama yang cocok dengan folder.

## Checklist Pull Request

- Frontmatter skill valid.
- Validasi lokal berhasil.
- `npx skills add . --list` menampilkan jumlah skill yang sesuai.
- Dokumentasi publik bilingual kalau user-facing.
- Tidak ada detail client atau detail proyek sensitif.
- README, release notes, mapping docs, atau changelog diperbarui kalau katalog berubah.

</details>
