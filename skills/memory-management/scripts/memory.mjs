#!/usr/bin/env node
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const VERSION = "1.0.0";
const SCOPES = new Set(["conversation", "project", "user", "workflow", "global"]);
const DEFAULT_LIMIT = 5;

const SENSITIVE_PATTERNS = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/i, "private key block"],
  [/\b(api[_-]?key|access[_-]?token|auth[_-]?token|secret|password|passwd|db_password|database_url|session_cookie|private[_-]?key)\b\s*[:=]\s*\S+/i, "secret assignment"],
  [/\b(sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,})\b/i, "known token-like value"],
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, "raw email address"],
  [/\b\+\d[\d\s().-]{7,}\d\b|\b\d{3,4}[\s.]\d{3,4}[\s.-]\d{3,5}\b/, "raw phone-like number"],
];

main().catch((error) => {
  console.error(`memory: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const [command, ...argv] = process.argv.slice(2);
  const args = parseArgs(argv);

  if (!command || command === "help" || args.help) {
    printHelp();
    return;
  }

  switch (command) {
    case "auto":
      await auto(args);
      break;
    case "init":
      await init(args);
      break;
    case "status":
      await status(args);
      break;
    case "remember":
      await remember(args);
      break;
    case "checkpoint":
      await checkpoint(args);
      break;
    case "recall":
      await recall(args);
      break;
    case "audit":
      await audit(args);
      break;
    case "forget":
      await forget(args);
      break;
    default:
      throw new Error(`unknown command "${command}". Run "memory.mjs help".`);
  }
}

function printHelp() {
  console.log(`memory-management active backend v${VERSION}

Usage:
  node memory.mjs auto [--cwd <path>] [--query <text>] [--limit 5]
  node memory.mjs init [--project <alias>] [--root <path>]
  node memory.mjs remember --scope <scope> --type <type> --title <title> --content <text> [--project <alias>] [--tags a,b]
  node memory.mjs checkpoint --project <alias> --summary <text> [--pending <text>] [--files a,b]
  node memory.mjs recall [--project <alias>] [--query <text>] [--scope <scope>] [--limit 5]
  node memory.mjs audit [--root <path>]
  node memory.mjs forget --id <memory-id>
  node memory.mjs status

Root defaults to AI_MEMORY_ROOT or ~/.ai-memory.
Use --content-file, --summary-file, or --pending-file for long text.`);
}

function parseArgs(argv) {
  const args = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function memoryRoot(args) {
  return path.resolve(String(args.root || process.env.AI_MEMORY_ROOT || path.join(os.homedir(), ".ai-memory")));
}

async function auto(args) {
  const root = memoryRoot(args);
  const cwd = path.resolve(String(args.cwd || process.cwd()));
  const project = await detectProject(cwd, root);
  const query = String(args.query || project.query).trim();

  await ensureRoot(root);
  await ensureProject(root, project.alias);
  await updateIndex(root, (index) => {
    index.projects[project.alias] = index.projects[project.alias] || projectIndex(project.alias);
    index.projects[project.alias].repositories = mergeUnique(index.projects[project.alias].repositories || [], project.repositories);
    index.projects[project.alias].frameworks = mergeUnique(index.projects[project.alias].frameworks || [], project.frameworks);
    index.projects[project.alias].tags = mergeUnique(index.projects[project.alias].tags || [], project.tags);
    index.projects[project.alias].source_root_hint = project.rootHint;
    index.projects[project.alias].updated_at = new Date().toISOString();
    index.updated_at = new Date().toISOString();
  });

  console.log(`# Memory Preflight`);
  console.log(`root: ${root}`);
  console.log(`project: ${project.alias}`);
  console.log(`project_root: ${project.projectRoot}`);
  console.log(`frameworks: ${project.frameworks.join(", ") || "unknown"}`);
  console.log(`tags: ${project.tags.join(", ") || "none"}`);
  console.log(`query: ${query || "latest project context"}`);
  console.log("");

  await recall({
    ...args,
    root,
    project: project.alias,
    query,
    limit: args.limit || DEFAULT_LIMIT,
  });
}

async function init(args) {
  const root = memoryRoot(args);
  await ensureRoot(root);

  if (args.project) {
    await ensureProject(root, projectAlias(args.project));
  }

  console.log(`Memory root ready: ${root}`);
}

async function status(args) {
  const root = memoryRoot(args);
  const files = await markdownFiles(root).catch(() => []);
  const index = await readIndex(root).catch(() => defaultIndex());
  const projects = Object.keys(index.projects || {});

  console.log(JSON.stringify({
    root,
    version: index.version || VERSION,
    markdown_files: files.length,
    projects: projects.length,
    project_aliases: projects,
  }, null, 2));
}

async function remember(args) {
  const root = memoryRoot(args);
  await ensureRoot(root);

  const scope = String(args.scope || "").toLowerCase();
  if (!SCOPES.has(scope)) {
    throw new Error(`--scope must be one of: ${Array.from(SCOPES).join(", ")}`);
  }

  const title = required(args, "title");
  const type = required(args, "type");
  const content = await textArg(args, "content", true);
  const source = String(args.source || "agent observation");
  const confidence = String(args.confidence || "medium");
  const tags = parseCsv(args.tags);

  assertSafe(`${title}\n${type}\n${content}\n${source}\n${tags.join(",")}`);

  const target = await targetForRemember(root, scope, args);
  const id = memoryId(title);
  const now = today();
  const entry = [
    "",
    `## ${title}`,
    "",
    `- Memory ID: ${id}`,
    `- Type: ${type}`,
    `- Scope: ${scope}`,
    "- Status: active",
    `- Confidence: ${confidence}`,
    `- Source: ${source}`,
    `- Last verified: ${now}`,
    `- Tags: ${tags.length ? tags.join(", ") : "none"}`,
    "",
    content.trim(),
    "",
  ].join("\n");

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.appendFile(target, entry, "utf8");
  await updateIndex(root, (index) => {
    if (scope === "project") {
      const alias = projectAlias(args.project);
      index.projects[alias] = index.projects[alias] || projectIndex(alias);
      index.projects[alias].tags = mergeUnique(index.projects[alias].tags || [], tags);
      index.projects[alias].updated_at = new Date().toISOString();
    }

    index.memory_count = Number(index.memory_count || 0) + 1;
    index.updated_at = new Date().toISOString();
  });

  console.log(JSON.stringify({ id, file: relativeToRoot(root, target), root }, null, 2));
}

async function checkpoint(args) {
  const root = memoryRoot(args);
  await ensureRoot(root);

  const alias = projectAlias(required(args, "project"));
  await ensureProject(root, alias);

  const summary = await textArg(args, "summary", true);
  const pending = await textArg(args, "pending", false);
  const files = parseCsv(args.files);

  assertSafe(`${summary}\n${pending}\n${files.join(",")}`);

  const id = memoryId(`checkpoint-${alias}`);
  const target = path.join(root, "projects", alias, "current-state.md");
  const entry = [
    "",
    `## Checkpoint ${today()}`,
    "",
    `- Memory ID: ${id}`,
    "- Type: checkpoint",
    "- Scope: project",
    "- Status: active",
    "- Confidence: high",
    "- Source: agent handoff",
    `- Last verified: ${today()}`,
    `- Touched files: ${files.length ? files.join(", ") : "none recorded"}`,
    "",
    summary.trim(),
    pending ? `\nPending:\n${pending.trim()}\n` : "",
  ].join("\n");

  await fs.appendFile(target, entry, "utf8");
  await updateIndex(root, (index) => {
    index.projects[alias] = index.projects[alias] || projectIndex(alias);
    index.projects[alias].updated_at = new Date().toISOString();
    index.updated_at = new Date().toISOString();
  });

  console.log(JSON.stringify({ id, file: relativeToRoot(root, target), root }, null, 2));
}

async function recall(args) {
  const root = memoryRoot(args);
  const query = String(args.query || "").trim();
  const scope = args.scope ? String(args.scope).toLowerCase() : "";
  const limit = Number(args.limit || DEFAULT_LIMIT);
  const terms = tokenize(query);
  const files = await candidateFiles(root, args, scope);
  const results = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const score = terms.length ? scoreContent(content, terms) : 1;
    if (score <= 0) {
      continue;
    }

    results.push({
      file: relativeToRoot(root, file),
      score,
      snippet: snippet(content, terms),
    });
  }

  results.sort((left, right) => right.score - left.score || left.file.localeCompare(right.file));
  const selected = results.slice(0, Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT);

  if (!selected.length) {
    console.log("No relevant memory found.");
    return;
  }

  for (const result of selected) {
    console.log(`\n### ${result.file}`);
    console.log(`score: ${result.score}`);
    console.log(result.snippet);
  }
}

async function audit(args) {
  const root = memoryRoot(args);
  const files = await markdownFiles(root).catch(() => []);
  const findings = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const matches = detectSensitive(content);
    if (matches.length) {
      findings.push({ file: relativeToRoot(root, file), findings: matches });
    }
  }

  if (!findings.length) {
    console.log(`Memory audit passed: ${root}`);
    return;
  }

  console.log(JSON.stringify({ root, findings }, null, 2));
  process.exitCode = 1;
}

async function forget(args) {
  const root = memoryRoot(args);
  const id = required(args, "id");
  const files = await markdownFiles(root);

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const next = removeSectionByMemoryId(content, id);

    if (next !== content) {
      await fs.writeFile(file, next, "utf8");
      await updateIndex(root, (index) => {
        index.updated_at = new Date().toISOString();
      });
      console.log(JSON.stringify({ removed: id, file: relativeToRoot(root, file), root }, null, 2));
      return;
    }
  }

  throw new Error(`memory id not found: ${id}`);
}

async function ensureRoot(root) {
  await fs.mkdir(path.join(root, "global"), { recursive: true });
  await fs.mkdir(path.join(root, "conversations"), { recursive: true });
  await fs.mkdir(path.join(root, "projects"), { recursive: true });
  await fs.mkdir(path.join(root, "workflows"), { recursive: true });

  await touchFile(path.join(root, "global", "user-profile.md"), "# User Profile\n");
  await touchFile(path.join(root, "global", "coding-preferences.md"), "# Coding Preferences\n");
  await touchFile(path.join(root, "global", "reusable-patterns.md"), "# Reusable Patterns\n");

  const indexPath = path.join(root, "index.json");
  try {
    await fs.access(indexPath);
  } catch {
    await fs.writeFile(indexPath, JSON.stringify(defaultIndex(), null, 2), "utf8");
  }
}

async function ensureProject(root, alias) {
  const dir = path.join(root, "projects", alias);
  await fs.mkdir(dir, { recursive: true });

  await touchFile(path.join(dir, "overview.md"), `# ${alias} Overview\n`);
  await touchFile(path.join(dir, "architecture.md"), `# ${alias} Architecture\n`);
  await touchFile(path.join(dir, "decisions.md"), `# ${alias} Decisions\n`);
  await touchFile(path.join(dir, "conventions.md"), `# ${alias} Conventions\n`);
  await touchFile(path.join(dir, "known-issues.md"), `# ${alias} Known Issues\n`);
  await touchFile(path.join(dir, "current-state.md"), `# ${alias} Current State\n`);

  await updateIndex(root, (index) => {
    index.projects[alias] = index.projects[alias] || projectIndex(alias);
    index.projects[alias].updated_at = new Date().toISOString();
    index.updated_at = new Date().toISOString();
  });
}

async function detectProject(cwd, root) {
  const projectRoot = await findProjectRoot(cwd);
  const composer = await readJson(path.join(projectRoot, "composer.json"));
  const pkg = await readJson(path.join(projectRoot, "package.json"));
  const gitRemote = await readGitRemote(projectRoot);
  const folder = path.basename(projectRoot);
  const canonical = [
    gitRemote ? `git:${gitRemote}` : "",
    composer?.name ? `composer:${composer.name}` : "",
    pkg?.name ? `package:${pkg.name}` : "",
    `folder:${folder}`,
  ].filter(Boolean).join("|");
  const alias = `project-${await hmacIdentity(canonical || projectRoot)}`;
  const frameworks = detectFrameworks(composer, pkg, projectRoot);
  const tags = detectTags(composer, pkg);

  return {
    alias,
    projectRoot,
    rootHint: folder,
    repositories: [folder].filter(Boolean),
    frameworks,
    tags,
    query: [folder, ...frameworks, ...tags].join(" "),
  };
}

async function findProjectRoot(start) {
  let current = start;

  while (true) {
    if (await exists(path.join(current, "composer.json"))
      || await exists(path.join(current, "artisan"))
      || await exists(path.join(current, ".git"))
      || await exists(path.join(current, "package.json"))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return start;
    }
    current = parent;
  }
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function readGitRemote(projectRoot) {
  try {
    const gitConfig = await fs.readFile(path.join(projectRoot, ".git", "config"), "utf8");
    const match = gitConfig.match(/\[remote "origin"\][\s\S]*?url\s*=\s*(.+)/);
    return match ? match[1].trim() : "";
  } catch {
    return "";
  }
}

function detectFrameworks(composer, pkg, projectRoot) {
  const frameworks = [];
  const require = { ...(composer?.require || {}), ...(composer?.["require-dev"] || {}) };
  const dependencies = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };

  if (require["laravel/framework"] || require["laravel/octane"] || path.basename(projectRoot).toLowerCase().includes("laravel")) {
    frameworks.push("laravel", "php");
  }
  if (require["livewire/livewire"]) frameworks.push("livewire");
  if (require["laravel/nova"]) frameworks.push("nova");
  if (dependencies["@inertiajs/vue3"] || dependencies["@inertiajs/react"] || require["inertiajs/inertia-laravel"]) frameworks.push("inertia");
  if (dependencies.vue) frameworks.push("vue");
  if (dependencies.react) frameworks.push("react");
  if (dependencies.tailwindcss) frameworks.push("tailwind");

  return mergeUnique(frameworks, frameworks.length ? [] : ["unknown"]);
}

function detectTags(composer, pkg) {
  const text = JSON.stringify({ composer, pkg }).toLowerCase();
  const tags = [];

  for (const tag of ["api", "queue", "horizon", "billing", "approval", "notification", "import", "export", "admin"]) {
    if (text.includes(tag)) tags.push(tag);
  }

  return tags;
}

async function hmacIdentity(value) {
  const secret = process.env.AI_MEMORY_SECRET || await localIdentitySecret();
  return crypto.createHmac("sha256", secret).update(value).digest("hex").slice(0, 12);
}

async function localIdentitySecret() {
  const file = path.join(os.homedir(), ".ai-memory-key");

  try {
    return await fs.readFile(file, "utf8");
  } catch {
    const secret = crypto.randomBytes(32).toString("hex");
    await fs.writeFile(file, secret, { encoding: "utf8", mode: 0o600 });
    return secret;
  }
}

async function targetForRemember(root, scope, args) {
  if (scope === "project") {
    const alias = projectAlias(required(args, "project"));
    await ensureProject(root, alias);
    return path.join(root, "projects", alias, String(args.file || "conventions.md"));
  }

  if (scope === "user") {
    return path.join(root, "global", "user-profile.md");
  }

  if (scope === "workflow") {
    return path.join(root, "workflows", `${slug(String(args.workflow || args.title || "workflow-pattern"))}.md`);
  }

  if (scope === "conversation") {
    return path.join(root, "conversations", `${slug(String(args.conversation || args.title || "conversation"))}.md`);
  }

  return path.join(root, "global", "reusable-patterns.md");
}

async function candidateFiles(root, args, scope) {
  const all = await markdownFiles(root);
  const alias = args.project ? projectAlias(args.project) : "";

  return all.filter((file) => {
    const relative = relativeToRoot(root, file).replaceAll("\\", "/");

    if (scope && !relative.includes(`${scope}s/`) && !(scope === "user" && relative.startsWith("global/"))) {
      return false;
    }

    if (!alias) {
      return true;
    }

    return relative.startsWith("global/")
      || relative.startsWith("workflows/")
      || relative.startsWith(`projects/${alias}/`);
  });
}

async function markdownFiles(root) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  await walk(root);
  return files;
}

async function updateIndex(root, mutate) {
  const index = await readIndex(root).catch(() => defaultIndex());
  mutate(index);
  await fs.writeFile(path.join(root, "index.json"), JSON.stringify(index, null, 2), "utf8");
}

async function readIndex(root) {
  return JSON.parse(await fs.readFile(path.join(root, "index.json"), "utf8"));
}

function defaultIndex() {
  return {
    version: VERSION,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projects: {},
    memory_count: 0,
  };
}

function projectIndex(alias) {
  return {
    memory_path: `projects/${alias}`,
    frameworks: ["laravel", "php"],
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

async function touchFile(file, initialContent) {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, initialContent, "utf8");
  }
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function textArg(args, key, isRequired) {
  const fileKey = `${key}-file`;

  if (args[fileKey]) {
    return fs.readFile(path.resolve(String(args[fileKey])), "utf8");
  }

  if (args[key]) {
    return String(args[key]);
  }

  if (isRequired) {
    throw new Error(`missing --${key} or --${fileKey}`);
  }

  return "";
}

function required(args, key) {
  if (!args[key]) {
    throw new Error(`missing --${key}`);
  }

  return String(args[key]);
}

function projectAlias(value) {
  const alias = slug(String(value || ""));
  if (!alias) {
    throw new Error("missing --project");
  }

  return alias;
}

function slug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseCsv(value) {
  if (!value || value === true) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mergeUnique(left, right) {
  return Array.from(new Set([...left, ...right]));
}

function memoryId(title) {
  const seed = `${Date.now()}-${title}-${crypto.randomBytes(8).toString("hex")}`;
  return `mem_${Date.now()}_${crypto.createHash("sha256").update(seed).digest("hex").slice(0, 8)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function detectSensitive(text) {
  return SENSITIVE_PATTERNS
    .filter(([pattern]) => pattern.test(text))
    .map(([, reason]) => reason);
}

function assertSafe(text) {
  const findings = detectSensitive(text);
  if (findings.length) {
    throw new Error(`refusing to persist sensitive data: ${Array.from(new Set(findings)).join(", ")}. Store a safe reference instead.`);
  }
}

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((term) => term.length > 2);
}

function scoreContent(content, terms) {
  const lower = content.toLowerCase();
  return terms.reduce((score, term) => {
    const matches = lower.match(new RegExp(escapeRegExp(term), "g"));
    return score + (matches ? matches.length : 0);
  }, 0);
}

function snippet(content, terms) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!terms.length) {
    return lines.slice(-8).join("\n");
  }

  const firstMatch = lines.findIndex((line) => {
    const lower = line.toLowerCase();
    return terms.some((term) => lower.includes(term));
  });

  const start = Math.max(0, firstMatch - 2);
  return lines.slice(start, start + 8).join("\n");
}

function removeSectionByMemoryId(content, id) {
  const sections = content.split(/(?=^## )/m);
  const kept = sections.filter((section) => !section.includes(`- Memory ID: ${id}`));
  return kept.join("");
}

function relativeToRoot(root, file) {
  return path.relative(root, file);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
