# Bilingual Markdown / Markdown Bilingual

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

Use this pattern for human-facing Markdown files that should be readable in English and Bahasa Indonesia.

## Pattern

```markdown
# Document Title / Judul Dokumen

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

English content goes here.

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Konten Bahasa Indonesia ditulis di sini.

</details>
```

## Rules

- Keep the English and Indonesian sections equivalent in meaning.
- Keep commands and literal skill names identical in both languages.
- Do not translate code, file paths, package names, class names, or command flags.
- Use English as the default open section for compatibility with most tooling.
- Use this pattern for README, docs, templates, and other user-facing Markdown files.
- Keep `SKILL.md` files concise; add bilingual text only when it helps human users without bloating assistant context.

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Gunakan pola ini untuk file Markdown yang dibaca manusia dan perlu tersedia dalam Bahasa Inggris serta Bahasa Indonesia.

## Pola

```markdown
# Document Title / Judul Dokumen

Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

<a id="english"></a>

<details open>
<summary><strong>English</strong></summary>

English content goes here.

</details>

<a id="bahasa-indonesia"></a>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

Konten Bahasa Indonesia ditulis di sini.

</details>
```

## Aturan

- Pastikan bagian English dan Bahasa Indonesia setara maknanya.
- Command dan nama skill literal harus sama di kedua bahasa.
- Jangan menerjemahkan code, path file, package name, class name, atau command flag.
- Jadikan English sebagai section default yang terbuka agar kompatibel dengan kebanyakan tooling.
- Gunakan pola ini untuk README, docs, templates, dan file Markdown user-facing lain.
- Jaga `SKILL.md` tetap ringkas; tambahkan bilingual text hanya jika membantu manusia tanpa membengkakkan context assistant.

</details>
