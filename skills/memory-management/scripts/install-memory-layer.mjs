#!/usr/bin/env node
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverName = "syarif-memory-management";
const mcpServerScript = path.join(__dirname, "mcp-server.mjs");
const hookScript = path.join(__dirname, "memory-hook.mjs");
const args = parseArgs(process.argv.slice(2));
const command = args._[0] || "help";

main().catch((error) => {
  console.error(`install-memory-layer: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  switch (command) {
    case "help":
      printHelp();
      break;
    case "detect":
      await detect();
      break;
    case "print":
      await printConfig();
      break;
    case "install":
      await install();
      break;
    default:
      throw new Error(`unknown command "${command}". Run "install-memory-layer.mjs help".`);
  }
}

function printHelp() {
  console.log(`Memory MCP/hook installer

Usage:
  node install-memory-layer.mjs detect
  node install-memory-layer.mjs print [--target codex|claude|json|hooks|all]
  node install-memory-layer.mjs install --target codex|claude|json|hooks|all [--apply] [--config <path>]

Defaults:
  install runs in dry-run mode unless --apply is present.
  memory root defaults to AI_MEMORY_ROOT or ~/.ai-memory.

Examples:
  node install-memory-layer.mjs print --target all
  node install-memory-layer.mjs install --target codex --apply
  node install-memory-layer.mjs install --target claude --apply
  node install-memory-layer.mjs install --target json --config .mcp.json --apply`);
}

async function detect() {
  const candidates = await detectTargets();
  console.log(JSON.stringify(candidates, null, 2));
}

async function printConfig() {
  const target = String(args.target || "all");
  const snippets = await snippetsFor(target);
  console.log(snippets.join("\n\n"));
}

async function install() {
  const target = String(args.target || "all");
  const apply = Boolean(args.apply);
  const tasks = expandTargets(target);
  const results = [];

  for (const item of tasks) {
    if (item === "codex") {
      results.push(await installCodex(apply));
    } else if (item === "claude") {
      results.push(await installJsonConfig(claudeConfigPath(), apply, "claude"));
    } else if (item === "json") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".mcp.json");
      results.push(await installJsonConfig(config, apply, "json"));
    } else if (item === "hooks") {
      const config = args.config ? path.resolve(String(args.config)) : path.join(memoryRoot(), "hooks.json");
      results.push(await installHookManifest(config, apply));
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

async function installCodex(apply) {
  const commandLine = [
    "codex",
    "mcp",
    "add",
    serverName,
    "--env",
    `AI_MEMORY_ROOT=${memoryRoot()}`,
    "--",
    "node",
    mcpServerScript,
  ];

  if (!apply) {
    return { target: "codex", mode: "dry-run", command: commandLine.join(" ") };
  }

  const list = await run("codex", ["mcp", "list"]).catch(() => "");
  if (list.includes(serverName)) {
    return {
      target: "codex",
      mode: "apply",
      status: "already-present",
      note: `Run "codex mcp remove ${serverName}" first if you want to replace it.`,
    };
  }

  const output = await run(commandLine[0], commandLine.slice(1));
  return { target: "codex", mode: "apply", status: "installed", output: output.trim() };
}

async function installJsonConfig(file, apply, target) {
  const next = await mergedMcpJson(file);

  if (!apply) {
    return { target, mode: "dry-run", file, config: next };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { target, mode: "apply", status: "written", file };
}

async function installHookManifest(file, apply) {
  const manifest = {
    name: "syarif-memory-management-hooks",
    preflight: {
      command: "node",
      args: [hookScript, "preflight", "--cwd", "${projectRoot}", "--query", "${taskIntent}"],
      env: { AI_MEMORY_ROOT: memoryRoot() },
    },
    checkpoint: {
      command: "node",
      args: [hookScript, "checkpoint", "--cwd", "${projectRoot}", "--summary", "${handoffSummary}"],
      env: { AI_MEMORY_ROOT: memoryRoot() },
    },
  };

  if (!apply) {
    return { target: "hooks", mode: "dry-run", file, config: manifest };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return { target: "hooks", mode: "apply", status: "written", file };
}

async function mergedMcpJson(file) {
  const current = await readJson(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  next.mcpServers = next.mcpServers && typeof next.mcpServers === "object" ? next.mcpServers : {};
  next.mcpServers[serverName] = mcpServerConfig();
  return next;
}

function mcpServerConfig() {
  return {
    command: "node",
    args: [mcpServerScript],
    env: {
      AI_MEMORY_ROOT: memoryRoot(),
    },
  };
}

async function snippetsFor(target) {
  const selected = expandTargets(target);
  const snippets = [];

  for (const item of selected) {
    if (item === "codex") {
      snippets.push([
        "# Codex CLI",
        `codex mcp add ${serverName} --env AI_MEMORY_ROOT=${quoteShell(memoryRoot())} -- node ${quoteShell(mcpServerScript)}`,
      ].join("\n"));
    } else if (item === "claude") {
      snippets.push([
        "# Claude Desktop / Claude-compatible JSON MCP",
        `# ${claudeConfigPath()}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "json") {
      snippets.push([
        "# Generic MCP JSON",
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "hooks") {
      snippets.push([
        "# Generic lifecycle hooks",
        `node ${quoteShell(hookScript)} preflight --cwd <project-root> --query "<task intent>"`,
        `node ${quoteShell(hookScript)} checkpoint --cwd <project-root> --summary "<handoff summary>"`,
      ].join("\n"));
    }
  }

  return snippets;
}

async function detectTargets() {
  return {
    platform: process.platform,
    memoryRoot: memoryRoot(),
    scripts: {
      mcpServer: mcpServerScript,
      hook: hookScript,
    },
    codex: {
      available: await commandExists("codex"),
      install: `codex mcp add ${serverName} --env AI_MEMORY_ROOT=${memoryRoot()} -- node ${mcpServerScript}`,
    },
    claude: {
      config: claudeConfigPath(),
      exists: await exists(claudeConfigPath()),
    },
    genericJson: {
      defaultConfig: path.resolve(".mcp.json"),
    },
    hooks: {
      manifest: path.join(memoryRoot(), "hooks.json"),
    },
  };
}

function expandTargets(target) {
  if (target === "all") {
    return ["codex", "claude", "json", "hooks"];
  }

  const targets = target.split(",").map((item) => item.trim()).filter(Boolean);
  const allowed = new Set(["codex", "claude", "json", "hooks"]);

  for (const item of targets) {
    if (!allowed.has(item)) {
      throw new Error(`unsupported target "${item}"`);
    }
  }

  return targets;
}

function claudeConfigPath() {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "Claude", "claude_desktop_config.json");
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  }

  return path.join(os.homedir(), ".config", "Claude", "claude_desktop_config.json");
}

function memoryRoot() {
  return path.resolve(String(args["memory-root"] || process.env.AI_MEMORY_ROOT || path.join(os.homedir(), ".ai-memory")));
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`cannot parse JSON config ${file}: ${error.message}`);
  }
}

async function backupIfExists(file) {
  if (!await exists(file)) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.copyFile(file, `${file}.bak-${stamp}`);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function commandExists(commandName) {
  const checker = process.platform === "win32" ? "where" : "which";
  return run(checker, [commandName]).then(() => true).catch(() => false);
}

function run(commandName, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(commandName, commandArgs, {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error((stderr || stdout || `${commandName} exited with code ${code}`).trim()));
      }
    });
  });
}

function quoteShell(value) {
  const text = String(value);
  return text.includes(" ") ? `"${text.replaceAll('"', '\\"')}"` : text;
}

function parseArgs(tokens) {
  const parsed = { _: [] };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) {
      parsed._.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}
