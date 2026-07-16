#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const skills = await listSkills();

if (args.list || (!args.agent && !args.target)) {
  printSkillList(skills);
  process.exit(0);
}

const selected = selectSkills(skills, args.skill);
const target = resolveTarget(args);

if (!args.yes && !args.dryRun) {
  console.error("Refusing to install without --yes. Re-run with --yes after checking the target.");
  console.error(`Target: ${target}`);
  process.exit(1);
}

await mkdir(target, { recursive: true });

for (const skill of selected) {
  const source = path.join(skillsRoot, skill.folder);
  const destination = path.join(target, skill.folder);

  if (args.dryRun) {
    console.log(`[dry-run] ${skill.name}: ${source} -> ${destination}`);
    continue;
  }

  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
  console.log(`Installed ${skill.name} -> ${destination}`);
}

function parseArgs(argv) {
  const parsed = {
    skill: "*"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--list") parsed.list = true;
    else if (arg === "--yes" || arg === "-y") parsed.yes = true;
    else if (arg === "--dry-run") parsed.dryRun = true;
    else if (arg === "--agent" || arg === "-a") {
      parsed.agent = requireValue(arg, next);
      index += 1;
    } else if (arg === "--skill" || arg === "-s") {
      parsed.skill = requireValue(arg, next);
      index += 1;
    } else if (arg === "--target" || arg === "-t") {
      parsed.target = requireValue(arg, next);
      index += 1;
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  return parsed;
}

function requireValue(flag, value) {
  if (!value || value.startsWith("-")) {
    console.error(`${flag} requires a value.`);
    process.exit(1);
  }

  return value;
}

async function listSkills() {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillFile = path.join(skillsRoot, entry.name, "SKILL.md");
    try {
      const skillStat = await stat(skillFile);
      if (skillStat.isFile()) {
        const fields = parseFrontmatter(await readFile(skillFile, "utf8"));
        found.push({
          description: fields.description ?? "",
          folder: entry.name,
          name: fields.name ?? entry.name
        });
      }
    } catch {
      // Ignore folders that are not skills.
    }
  }

  return found.sort((left, right) => left.name.localeCompare(right.name));
}

function printSkillList(found) {
  console.log("Available skills:");
  for (const skill of found) {
    console.log(`- ${skill.name}`);
    if (skill.description) {
      console.log(`  ${skill.description}`);
    }
  }
}

function selectSkills(found, requested) {
  if (requested === "*" || requested === "all") return found;

  const requestedSkills = requested.split(",").map((skill) => skill.trim()).filter(Boolean);
  const selected = [];
  const missing = [];

  for (const requestedSkill of requestedSkills) {
    const match = found.find((skill) => skill.name === requestedSkill || skill.folder === requestedSkill);

    if (match) {
      selected.push(match);
    } else {
      missing.push(requestedSkill);
    }
  }

  if (missing.length > 0) {
    console.error(`Unknown skill: ${missing.join(", ")}`);
    console.error(`Available skills: ${found.map((skill) => skill.name).join(", ")}`);
    process.exit(1);
  }

  return selected;
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

function resolveTarget(options) {
  if (options.target) return path.resolve(options.target);

  const home = os.homedir();
  const agent = options.agent.toLowerCase();

  if (agent === "codex") return path.join(home, ".codex", "skills");
  if (agent === "claude" || agent === "claude-code") return path.join(home, ".claude", "skills");

  console.error(`Unknown agent: ${options.agent}`);
  console.error("Use --agent codex, --agent claude, or provide --target <directory>.");
  process.exit(1);
}

function printHelp() {
  console.log(`Laravel AI Skills installer

Usage:
  syarif-laravel-ai-skills --list
  syarif-laravel-ai-skills --agent codex --skill "*" --yes
  syarif-laravel-ai-skills --agent claude --skill form-requests --yes
  syarif-laravel-ai-skills --target ./skills --skill "*" --yes

Options:
  --list              List bundled skills
  -a, --agent         codex or claude
  -s, --skill         Skill name, comma-separated names, "*" or "all"
  -t, --target        Custom install directory
  -y, --yes           Confirm installation
  --dry-run           Show copy operations without writing
  -h, --help          Show this help
`);
}
