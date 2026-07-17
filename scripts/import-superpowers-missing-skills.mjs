#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");
const docsRoot = path.join(root, "docs");
const upstreamUrl = "https://github.com/jpcaparas/superpowers-laravel.git";
const upstreamWebUrl = "https://github.com/jpcaparas/superpowers-laravel";
const upstreamRoot = path.join(os.tmpdir(), "superpowers-laravel-skills-source");
const mergedSkillTargets = new Map([
  ["bootstrap-check", "runner-selection"],
  ["queues-and-horizon", "queues-and-jobs"],
  ["transactions-and-consistency", "database-transactions"],
  ["using-laravel-superpowers", "using-laravel-standards"]
]);

ensureUpstream();

const upstreamSkills = listSkills(path.join(upstreamRoot, "skills"));
const localSkillNames = new Set(listSkills(skillsRoot).map((skill) => skill.name));
const added = [];
const skipped = [];

for (const upstream of upstreamSkills) {
  const normalizedFolder = normalizeTargetFolder(upstream.name);
  const targetFolder = targetFolderFor(upstream.name);
  const targetName = `${targetFolder}`;

  if (localSkillNames.has(targetName)) {
    const reason = targetFolder === normalizedFolder
      ? "already exists"
      : `merged into ${targetName}`;
    skipped.push({ ...upstream, targetFolder, targetName, reason });
    continue;
  }

  const targetDir = path.join(skillsRoot, targetFolder);
  const targetFile = path.join(targetDir, "SKILL.md");

  if (existsSync(targetFile)) {
    skipped.push({ ...upstream, targetFolder, targetName, reason: "target file exists" });
    continue;
  }

  mkdirSync(targetDir, { recursive: true });
  writeFileSync(targetFile, renderSkill(upstream, targetFolder, targetName), "utf8");
  localSkillNames.add(targetName);
  added.push({ ...upstream, targetFolder, targetName });
}

writeMapping(upstreamSkills, added, skipped);

console.log(`Upstream skills: ${upstreamSkills.length}`);
console.log(`Added skills: ${added.length}`);
console.log(`Skipped skills: ${skipped.length}`);

function ensureUpstream() {
  const skillsPath = path.join(upstreamRoot, "skills");

  if (existsSync(skillsPath)) {
    execFileSync("git", ["-C", upstreamRoot, "pull", "--ff-only"], { stdio: "ignore" });
    return;
  }

  execFileSync("git", ["clone", "--depth", "1", upstreamUrl, upstreamRoot], { stdio: "inherit" });
}

function listSkills(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const skillFile = path.join(directory, entry.name, "SKILL.md");
      if (!existsSync(skillFile)) return null;

      const fields = parseFrontmatter(readFileSync(skillFile, "utf8"));
      return {
        description: fields.description ?? descriptionFromFolder(entry.name),
        folder: entry.name,
        name: fields.name ?? `${entry.name}`
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fields = {};

  if (!match) return fields;

  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;

    fields[field[1]] = field[2].trim().replace(/^["']|["']$/g, "");
  }

  return fields;
}

function normalizeTargetFolder(name) {
  return name
    .replace(/^laravel:/, "")
    .replaceAll(":", "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function targetFolderFor(name) {
  const normalized = normalizeTargetFolder(name);
  return mergedSkillTargets.get(normalized) ?? normalized;
}

function descriptionFromFolder(folder) {
  return `Apply Laravel ${titleFromFolder(folder)} standards with project conventions, focused tests, and safe boundaries.`;
}

function titleFromFolder(folder) {
  return folder
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderSkill(upstream, targetFolder, targetName) {
  const title = titleFromFolder(targetFolder);
  const description = normalizeDescription(upstream.description, targetFolder);
  const sourceName = upstream.name;

  return `---
name: ${targetName}
description: ${description}
tags:
  - laravel
  - php
---

# ${title}

Use this skill when a Laravel task involves ${plainTopic(targetFolder)}.

This skill is adapted to the personal Laravel standards in this repository. It maps the public \`${sourceName}\` topic from \`jpcaparas/superpowers-laravel\` into the local \`${targetName}\` catalog without copying third-party skill body text.

## Syarif Defaults

- Follow Laravel conventions before introducing custom abstractions.
- Prefer project-local patterns when they are explicit and tested.
- Keep controllers focused on HTTP orchestration.
- Put validation, authorization, transactions, side effects, and integrations at clear boundaries.
- Keep client names, credentials, internal URLs, provider secrets, and project-specific business rules out of reusable standards.
- Verify important behavior with the smallest meaningful tests and quality checks.

## Workflow

1. Detect the Laravel version, PHP version, runner, package manager, and existing project conventions.
2. Identify the smallest local skill set that overlaps this topic.
3. Implement or review the change using Laravel-native APIs first.
4. Add abstractions only when they reduce real complexity or protect a meaningful boundary.
5. Run targeted tests and available quality checks before handoff.

## Checkpoints

- Authorization and validation boundaries are explicit.
- Query shape, transactions, queues, cache, files, and external calls are intentional when touched.
- User-facing behavior has feature, unit, browser, or integration tests at the right level.
- Logs and errors are useful without exposing secrets or unnecessary personal data.
- Documentation or proposals avoid importing source-project names or one-off business rules.

## Related Skills

- \`using-laravel-standards\`
- \`architecture\`
- \`testing\`
- \`security\`
`;
}

function normalizeDescription(description, targetFolder) {
  const fallback = descriptionFromFolder(targetFolder);
  const cleaned = String(description || fallback)
    .replace(/[“”]/g, "\"")
    .replace(/[’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length >= 40 && cleaned.length <= 180 && !/[\[\]\r\n]/.test(cleaned)) {
    return cleaned;
  }

  return fallback;
}

function plainTopic(folder) {
  return folder.replaceAll("-", " ");
}

function writeMapping(upstreamSkills, addedSkills, skippedSkills) {
  const mappedSkills = upstreamSkills.map((skill) => {
    const targetFolder = targetFolderFor(skill.name);
    return {
      ...skill,
      targetFolder,
      targetName: `${targetFolder}`
    };
  });

  const lines = [
    "# Superpowers Laravel Skill Mapping / Mapping Skill Superpowers Laravel",
    "",
    "Language: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)",
    "",
    "<a id=\"english\"></a>",
    "",
    "<details open>",
    "<summary><strong>English</strong></summary>",
    "",
    "This document maps the public `jpcaparas/superpowers-laravel` skill catalog into this repository's folder-aligned skill catalog.",
    "",
    `Source: ${upstreamWebUrl}/tree/main/skills`,
    "",
    `Upstream skills scanned: ${upstreamSkills.length}.`,
    `Local mapped skills: ${mappedSkills.length}.`,
    `New local skills added this run: ${addedSkills.length}.`,
    `Existing local skills skipped this run: ${skippedSkills.length}.`,
    "",
    "If this script is rerun after the initial import, `New local skills added this run` can be `0` because the mapped skills already exist locally.",
    "",
    "## Mapped Skills",
    "",
    "| Upstream skill | Local skill | Local folder |",
    "| --- | --- | --- |",
    ...mappedSkills.map((skill) => `| \`${skill.name}\` | \`${skill.targetName}\` | \`skills/${skill.targetFolder}/\` |`),
    "",
    "## Existing Or Skipped Skills",
    "",
    "| Upstream skill | Local skill | Reason |",
    "| --- | --- | --- |",
    ...skippedSkills.map((skill) => `| \`${skill.name}\` | \`${skill.targetName}\` | ${skill.reason} |`),
    "",
    "</details>",
    "",
    "<a id=\"bahasa-indonesia\"></a>",
    "",
    "<details>",
    "<summary><strong>Bahasa Indonesia</strong></summary>",
    "",
    "Dokumen ini memetakan katalog skill publik `jpcaparas/superpowers-laravel` ke katalog skill berbasis nama folder di repository ini.",
    "",
    `Sumber: ${upstreamWebUrl}/tree/main/skills`,
    "",
    `Skill upstream yang discan: ${upstreamSkills.length}.`,
    `Skill lokal yang dimapping: ${mappedSkills.length}.`,
    `Skill lokal baru yang ditambahkan pada run ini: ${addedSkills.length}.`,
    `Skill lokal yang sudah ada/dilewati pada run ini: ${skippedSkills.length}.`,
    "",
    "Kalau script ini dijalankan ulang setelah import awal, `Skill lokal baru yang ditambahkan pada run ini` bisa bernilai `0` karena skill hasil mapping sudah ada secara lokal.",
    "",
    "## Skill Yang Dimapping",
    "",
    "| Skill upstream | Skill lokal | Folder lokal |",
    "| --- | --- | --- |",
    ...mappedSkills.map((skill) => `| \`${skill.name}\` | \`${skill.targetName}\` | \`skills/${skill.targetFolder}/\` |`),
    "",
    "## Skill Yang Sudah Ada Atau Dilewati",
    "",
    "| Skill upstream | Skill lokal | Alasan |",
    "| --- | --- | --- |",
    ...skippedSkills.map((skill) => `| \`${skill.name}\` | \`${skill.targetName}\` | ${skill.reason} |`),
    "",
    "</details>",
    ""
  ];

  writeFileSync(path.join(docsRoot, "SUPERPOWERS_SKILL_MAPPING.md"), lines.join("\n"), "utf8");
}
