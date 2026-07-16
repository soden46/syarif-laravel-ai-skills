#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");
const pluginsRoot = path.join(root, "plugins");
const pluginGroupsPath = path.join(root, "plugin-groups.json");
const claudeMarketplacePath = path.join(root, ".claude-plugin", "marketplace.json");
const codexMarketplacePath = path.join(root, ".agents", "plugins", "marketplace.json");
const repositoryUrl = "https://github.com/soden46/syarif-laravel-ai-skills";

const packageJson = parseJson(await readFile(path.join(root, "package.json"), "utf8"));
const skills = await listSkills();
const pluginGroups = await loadPluginGroups(skills);

await writeClaudeMarketplace(pluginGroups);
await writeCodexMarketplace(pluginGroups);
await writeCodexPlugins(pluginGroups);

console.log(`Synced ${pluginGroups.length} plugin group(s) with ${skills.length} skill(s).`);

async function listSkills() {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillFile = path.join(skillsRoot, entry.name, "SKILL.md");
    try {
      const skillStat = await stat(skillFile);
      if (!skillStat.isFile()) continue;

      const frontmatter = parseFrontmatter(await readFile(skillFile, "utf8"));
      if (!frontmatter.name || !frontmatter.description) {
        throw new Error("missing name or description");
      }

      found.push({
        folder: entry.name,
        name: frontmatter.name,
        description: frontmatter.description
      });
    } catch (error) {
      throw new Error(`${entry.name}: invalid skill metadata (${error.message})`);
    }
  }

  return found.sort((left, right) => left.folder.localeCompare(right.folder));
}

async function loadPluginGroups(knownSkills) {
  const known = new Set(knownSkills.map((skill) => skill.folder));
  const config = parseJson(await readFile(pluginGroupsPath, "utf8"));

  if (!Array.isArray(config.plugins) || config.plugins.length === 0) {
    throw new Error("plugin-groups.json must include a non-empty plugins array.");
  }

  const assigned = new Set();

  for (const plugin of config.plugins) {
    if (!plugin.name || !plugin.name.endsWith("-skills")) {
      throw new Error("Every plugin name must end with -skills.");
    }

    if (!plugin.description) {
      throw new Error(`${plugin.name}: missing description.`);
    }

    if (!Array.isArray(plugin.skills) || plugin.skills.length === 0) {
      throw new Error(`${plugin.name}: missing skills array.`);
    }

    for (const skill of plugin.skills) {
      if (!known.has(skill)) {
        throw new Error(`${plugin.name}: unknown skill ${skill}.`);
      }

      if (assigned.has(skill)) {
        throw new Error(`${skill} is assigned to multiple plugin groups.`);
      }

      assigned.add(skill);
    }
  }

  for (const skill of known) {
    if (!assigned.has(skill)) {
      throw new Error(`${skill} is not assigned to any plugin group.`);
    }
  }

  return config.plugins;
}

async function writeClaudeMarketplace(pluginGroups) {
  const marketplace = {
    name: packageJson.name,
    owner: {
      name: packageJson.author || "Syarif",
      email: ""
    },
    metadata: {
      description: packageJson.description,
      version: packageJson.version
    },
    plugins: pluginGroups.map((plugin) => ({
      name: plugin.name,
      description: plugin.description,
      source: "./",
      strict: false,
      skills: plugin.skills.map((skill) => `./skills/${skill}`)
    }))
  };

  await mkdir(path.dirname(claudeMarketplacePath), { recursive: true });
  await writeJson(claudeMarketplacePath, marketplace);
}

async function writeCodexMarketplace(pluginGroups) {
  const marketplace = {
    name: packageJson.name,
    interface: {
      displayName: "Syarif Laravel AI Skills"
    },
    plugins: pluginGroups.map((plugin) => ({
      name: plugin.name,
      source: {
        source: "local",
        path: `./plugins/${plugin.name}`
      },
      policy: {
        installation: "AVAILABLE",
        authentication: "ON_INSTALL"
      },
      category: "Productivity"
    }))
  };

  await mkdir(path.dirname(codexMarketplacePath), { recursive: true });
  await writeJson(codexMarketplacePath, marketplace);
}

async function writeCodexPlugins(pluginGroups) {
  await mkdir(pluginsRoot, { recursive: true });

  const expected = new Set(pluginGroups.map((plugin) => plugin.name));
  const existing = await readdir(pluginsRoot, { withFileTypes: true }).catch(() => []);

  for (const entry of existing) {
    if (entry.isDirectory() && !expected.has(entry.name)) {
      await rm(path.join(pluginsRoot, entry.name), { recursive: true, force: true });
    }
  }

  for (const plugin of pluginGroups) {
    const pluginRoot = path.join(pluginsRoot, plugin.name);
    const pluginSkillsRoot = path.join(pluginRoot, "skills");
    const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");

    await rm(pluginSkillsRoot, { recursive: true, force: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(pluginSkillsRoot, { recursive: true });

    await writeJson(manifestPath, buildCodexManifest(plugin));

    for (const skill of plugin.skills) {
      await cp(path.join(skillsRoot, skill), path.join(pluginSkillsRoot, skill), {
        recursive: true,
        filter: (source) => path.basename(source) !== ".DS_Store"
      });
    }
  }
}

function buildCodexManifest(plugin) {
  const displayName = titleCase(plugin.name);

  return {
    name: plugin.name,
    version: packageJson.version,
    description: plugin.description,
    homepage: repositoryUrl,
    repository: repositoryUrl,
    license: packageJson.license || "MIT",
    keywords: ["codex", "skills", "laravel", "php"],
    skills: "./skills/",
    interface: {
      displayName,
      shortDescription: plugin.description,
      longDescription: plugin.description,
      developerName: packageJson.author || "Syarif",
      category: "Productivity",
      capabilities: ["Read", "Write"],
      websiteURL: repositoryUrl,
      defaultPrompt: [
        `Use ${plugin.skills[0]} to guide this Laravel project task.`,
        `Apply ${plugin.name} to review this Laravel repository.`
      ],
      brandColor: "#F9322C"
    }
  };
}

function parseFrontmatter(content) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const fields = {};

  if (!frontmatter) return fields;

  for (const line of frontmatter[1].split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    fields[key] = rawValue.replace(/^["']|["']$/g, "").trim();
  }

  return fields;
}

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function writeJson(file, data) {
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

function parseJson(text) {
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}
