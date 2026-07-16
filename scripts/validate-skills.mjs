#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");
const pluginsRoot = path.join(root, "plugins");
const folderNamePattern = /^[a-z0-9-]+$/;
const skillNamePattern = /^[a-z0-9-]+$/;
let failed = false;

await assertRequiredRootFiles();
await assertSkillFilesAreInstallable();

const entries = await readdir(skillsRoot, { withFileTypes: true });
const skillDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

if (skillDirs.length === 0) {
  fail("No skills found under skills/.");
}

for (const dir of skillDirs) {
  const skillFile = path.join(skillsRoot, dir, "SKILL.md");
  let content = "";

  try {
    content = await readFile(skillFile, "utf8");
  } catch {
    fail(`${dir}: missing SKILL.md`);
    continue;
  }

  if (!folderNamePattern.test(dir)) {
    fail(`${dir}: folder name must use lowercase letters, digits, and hyphens only.`);
  }

  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) {
    fail(`${dir}: missing YAML frontmatter.`);
    continue;
  }

  const fields = parseFrontmatter(frontmatter[1]);
  const expectedName = `${dir}`;
  if (fields.name !== expectedName) {
    fail(`${dir}: frontmatter name must be ${expectedName}.`);
  }

  if (fields.name && !skillNamePattern.test(fields.name)) {
    fail(`${dir}: frontmatter name must use lowercase kebab-case.`);
  }

  if (!fields.description || fields.description.length < 40) {
    fail(`${dir}: description is missing or too short.`);
  }

  if (fields.description && fields.description.length > 180) {
    fail(`${dir}: description is too long for clean --list output; keep it at 180 characters or fewer.`);
  }

  if (fields.description && /[\[\]\n\r]/.test(fields.description)) {
    fail(`${dir}: description must be plain single-line display text, not Markdown.`);
  }

  if (fields.description && /:\s/.test(fields.description)) {
    fail(`${dir}: description must not contain an unquoted colon-space sequence; it can break YAML discovery.`);
  }

  if (fields.description && !/\b(laravel|php)\b/i.test(fields.description)) {
    fail(`${dir}: description must mention Laravel or PHP so Laravel Skills can classify it.`);
  }

  if (!hasRequiredLaravelTags(frontmatter[1])) {
    fail(`${dir}: frontmatter tags must include laravel and php for Laravel Skills import.`);
  }

  const extraFields = Object.keys(fields).filter((field) => !["name", "description", "tags"].includes(field));
  if (extraFields.length > 0) {
    fail(`${dir}: unexpected frontmatter fields: ${extraFields.join(", ")}`);
  }
}

await assertPluginGroups(skillDirs);
await assertSkillsShConfig(skillDirs);
await assertGeneratedMarketplaces(skillDirs);
await assertPackageJsonPolicy();

if (failed) {
  process.exit(1);
}

console.log(`Validated ${skillDirs.length} skills.`);

async function assertRequiredRootFiles() {
  const rootEntries = await readdir(root);
  const required = ["README.md", "RELEASE-NOTES.md", "CHANGELOG.md", "LICENSE", "package.json", "skills.sh.json"];

  for (const file of required) {
    if (!rootEntries.includes(file)) {
      fail(`Missing required root file with exact name: ${file}`);
    }
  }
}

async function assertSkillsShConfig(skillDirs) {
  const configPath = path.join(root, "skills.sh.json");
  let config;

  try {
    config = parseJson(await readFile(configPath, "utf8"));
  } catch (error) {
    fail(`skills.sh.json is missing or invalid JSON: ${error.message}`);
    return;
  }

  if (config.$schema && config.$schema !== "https://skills.sh/schemas/skills.sh.schema.json") {
    fail("skills.sh.json $schema must be https://skills.sh/schemas/skills.sh.schema.json.");
  }

  if (config.notGrouped && !["top", "bottom"].includes(config.notGrouped)) {
    fail('skills.sh.json notGrouped must be "top" or "bottom".');
  }

  if (!Array.isArray(config.groupings) || config.groupings.length === 0) {
    fail("skills.sh.json must include at least one grouping.");
    return;
  }

  if (config.groupings.length > 50) {
    fail("skills.sh.json must use 50 groups or fewer.");
  }

  const knownSkills = new Set(skillDirs);
  const assigned = new Set();

  for (const [index, group] of config.groupings.entries()) {
    const label = `skills.sh.json group ${index + 1}`;

    if (!group || typeof group !== "object") {
      fail(`${label} must be an object.`);
      continue;
    }

    if (!group.title || typeof group.title !== "string") {
      fail(`${label} must include a non-empty title.`);
    }

    if (group.description && typeof group.description !== "string") {
      fail(`${label} description must be a string when present.`);
    }

    if (!Array.isArray(group.skills) || group.skills.length === 0) {
      fail(`${label} must include at least one skill.`);
      continue;
    }

    if (group.skills.length > 500) {
      fail(`${label} must list 500 skills or fewer.`);
    }

    for (const skill of group.skills) {
      if (typeof skill !== "string" || !skillNamePattern.test(skill)) {
        fail(`${label} includes invalid skill slug "${skill}".`);
        continue;
      }

      if (!knownSkills.has(skill)) {
        fail(`${label} references unknown skill "${skill}".`);
      }

      if (assigned.has(skill)) {
        fail(`skills.sh.json assigns "${skill}" to multiple groups.`);
      }

      assigned.add(skill);
    }
  }

  for (const skill of skillDirs) {
    if (!assigned.has(skill)) {
      fail(`skills.sh.json does not group "${skill}".`);
    }
  }
}

async function assertSkillFilesAreInstallable() {
  const skillFiles = await findSkillFiles(root);

  for (const file of skillFiles) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    const parts = relative.split("/");
    const isCanonicalSkill = parts.length === 3 && parts[0] === "skills" && parts[2] === "SKILL.md";
    const isPackagedSkill = parts.length === 5
      && parts[0] === "plugins"
      && parts[2] === "skills"
      && parts[4] === "SKILL.md";

    if (!isCanonicalSkill && !isPackagedSkill) {
      fail(`${relative}: SKILL.md files are allowed only at skills/<skill-name>/SKILL.md or generated plugin skill packages.`);
    }
  }
}

async function findSkillFiles(directory) {
  const ignored = new Set([".agents", ".git", "node_modules", ".tmp-skills"]);
  const found = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    if (entry.name.startsWith(".tmp-")) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      found.push(...await findSkillFiles(fullPath));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      found.push(fullPath);
    }
  }

  return found;
}

async function assertPluginGroups(skillDirs) {
  const groupsPath = path.join(root, "plugin-groups.json");
  let parsed;

  try {
    parsed = parseJson(await readFile(groupsPath, "utf8"));
  } catch (error) {
    fail(`plugin-groups.json is missing or invalid JSON: ${error.message}`);
    return;
  }

  if (!Array.isArray(parsed.plugins) || parsed.plugins.length === 0) {
    fail("plugin-groups.json must include a non-empty plugins array.");
    return;
  }

  const knownSkills = new Set(skillDirs);
  const assigned = new Set();

  for (const plugin of parsed.plugins) {
    if (!plugin.name || !plugin.name.endsWith("-skills")) {
      fail("plugin-groups.json plugin names must exist and end with -skills.");
    }

    if (!plugin.description) {
      fail(`plugin-groups.json plugin "${plugin.name ?? "(missing)"}" needs a description.`);
    }

    if (!Array.isArray(plugin.skills) || plugin.skills.length === 0) {
      fail(`plugin-groups.json plugin "${plugin.name ?? "(missing)"}" needs skills.`);
      continue;
    }

    for (const skill of plugin.skills) {
      if (!knownSkills.has(skill)) {
        fail(`plugin-groups.json references unknown skill "${skill}".`);
      }

      if (assigned.has(skill)) {
        fail(`plugin-groups.json assigns "${skill}" to multiple plugins.`);
      }

      assigned.add(skill);
    }
  }

  for (const skill of skillDirs) {
    if (!assigned.has(skill)) {
      fail(`plugin-groups.json does not assign "${skill}" to a plugin.`);
    }
  }
}

async function assertGeneratedMarketplaces(skillDirs) {
  const claudeMarketplacePath = path.join(root, ".claude-plugin", "marketplace.json");
  const codexMarketplacePath = path.join(root, ".agents", "plugins", "marketplace.json");

  try {
    parseJson(await readFile(claudeMarketplacePath, "utf8"));
  } catch (error) {
    fail(`${path.relative(root, claudeMarketplacePath)} is missing or invalid JSON: ${error.message}`);
  }

  await assertCodexMarketplace(codexMarketplacePath);

  try {
    await stat(pluginsRoot);
  } catch {
    fail("plugins/ directory is missing. Run npm run sync.");
    return;
  }

  const packagedSkillFiles = await findSkillFiles(pluginsRoot);
  if (packagedSkillFiles.length < skillDirs.length) {
    fail("plugins/ packaged skill copies are missing or incomplete. Run npm run sync.");
  }

  await assertCodexPluginManifests(skillDirs);
}

async function assertCodexMarketplace(codexMarketplacePath) {
  let marketplace;

  try {
    marketplace = parseJson(await readFile(codexMarketplacePath, "utf8"));
  } catch (error) {
    fail(`${path.relative(root, codexMarketplacePath)} is missing or invalid JSON: ${error.message}`);
    return;
  }

  if (marketplace.name !== "syarif-laravel-ai-skills") {
    fail("marketplace.json name must be syarif-laravel-ai-skills.");
  }

  if (!marketplace.interface || marketplace.interface.displayName !== "Syarif Laravel AI Skills") {
    fail("marketplace.json interface.displayName must be Syarif Laravel AI Skills.");
  }

  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    fail("marketplace.json must include at least one plugin entry.");
    return;
  }

  for (const plugin of marketplace.plugins) {
    if (!plugin.name || typeof plugin.name !== "string") {
      fail("marketplace.json plugin entries need a name.");
    }

    if (plugin.source?.source !== "local" || plugin.source?.path !== `./plugins/${plugin.name}`) {
      fail(`marketplace.json plugin "${plugin.name ?? "(missing)"}" must point to ./plugins/<plugin-name>.`);
    }

    if (plugin.policy?.installation !== "AVAILABLE" || plugin.policy?.authentication !== "ON_INSTALL") {
      fail(`marketplace.json plugin "${plugin.name ?? "(missing)"}" must include AVAILABLE/ON_INSTALL policy.`);
    }

    if (plugin.category !== "Productivity") {
      fail(`marketplace.json plugin "${plugin.name ?? "(missing)"}" category must be Productivity.`);
    }
  }
}

async function assertCodexPluginManifests() {
  const pluginDirs = await readdir(pluginsRoot, { withFileTypes: true }).catch(() => []);

  for (const entry of pluginDirs) {
    if (!entry.isDirectory()) continue;

    const manifestPath = path.join(pluginsRoot, entry.name, ".codex-plugin", "plugin.json");
    let manifest;

    try {
      manifest = parseJson(await readFile(manifestPath, "utf8"));
    } catch (error) {
      fail(`${path.relative(root, manifestPath)} is missing or invalid JSON: ${error.message}`);
      continue;
    }

    if (manifest.name !== entry.name) {
      fail(`${path.relative(root, manifestPath)} name must match plugin folder.`);
    }

    if (!manifest.author || typeof manifest.author !== "object" || !manifest.author.name) {
      fail(`${path.relative(root, manifestPath)} must include author.name for Codex plugin validation.`);
    }

    if (manifest.skills !== "./skills/") {
      fail(`${path.relative(root, manifestPath)} skills must be ./skills/.`);
    }

    if (!manifest.interface?.displayName || !Array.isArray(manifest.interface?.defaultPrompt)) {
      fail(`${path.relative(root, manifestPath)} must include interface displayName and defaultPrompt.`);
    }
  }
}

async function assertPackageJsonPolicy() {
  const packagePath = path.join(root, "package.json");

  try {
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));

    if (packageJson.private !== true) {
      fail("package.json must remain private; install users through `npx skills add`, not `npm install`.");
    }
  } catch (error) {
    fail(`package.json is not valid JSON: ${error.message}`);
  }
}

function parseFrontmatter(text) {
  const fields = {};

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    fields[key] = rawValue.replace(/^["']|["']$/g, "").trim();
  }

  return fields;
}

function hasRequiredLaravelTags(text) {
  const tagsBlock = text.match(/^tags:[^\S\r\n]*(?:\r?\n((?:[^\S\r\n]*-[^\S\r\n]+.+\r?\n?)+))?/m);

  if (!tagsBlock) return false;

  const inlineTags = text.match(/^tags:\s*\[(.*?)\]\s*$/m);
  const values = inlineTags
    ? inlineTags[1].split(",").map((tag) => tag.replace(/^["']|["']$/g, "").trim().toLowerCase())
    : (tagsBlock[1] ?? "")
      .split(/\r?\n/)
      .map((line) => line.match(/^[^\S\r\n]*-[^\S\r\n]+(.+?)\s*$/)?.[1])
      .filter(Boolean)
      .map((tag) => tag.replace(/^["']|["']$/g, "").trim().toLowerCase());

  return values.includes("laravel") && values.includes("php");
}

function fail(message) {
  failed = true;
  console.error(`ERROR: ${message}`);
}

function parseJson(text) {
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}
