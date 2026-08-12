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
  node install-memory-layer.mjs print [--target codex|claude-code|gemini-cli|opencode|vscode|vscode-insiders|vscodium|code-oss|vscode-workspace|vscode-copilot-instructions|vscode-agent-instructions|vscode-acp-client|vscode-acp-client-workspace|antigravity|antigravity-workspace|cursor|cursor-workspace|windsurf|cline|cline-cli|roo-workspace|continue-workspace|kilo|kilo-workspace|hermes|zed|zed-workspace|claude|json|orchestrator-profile|hooks|vscode-family|ai-agent-tools|popular-editors|all]
  node install-memory-layer.mjs install --target codex|claude-code|gemini-cli|opencode|vscode|vscode-insiders|vscodium|code-oss|vscode-workspace|vscode-copilot-instructions|vscode-agent-instructions|vscode-acp-client|vscode-acp-client-workspace|antigravity|antigravity-workspace|cursor|cursor-workspace|windsurf|cline|cline-cli|roo-workspace|continue-workspace|kilo|kilo-workspace|hermes|zed|zed-workspace|claude|json|orchestrator-profile|hooks|vscode-family|ai-agent-tools|popular-editors|all [--apply] [--config <path>] [--settings <path>]

Defaults:
  install runs in dry-run mode unless --apply is present.
  memory root defaults to AI_MEMORY_ROOT or ~/.ai-memory.

Examples:
  node install-memory-layer.mjs print --target all
  node install-memory-layer.mjs install --target codex --apply
  node install-memory-layer.mjs install --target ai-agent-tools --apply
  node install-memory-layer.mjs install --target vscode-family --apply
  node install-memory-layer.mjs install --target vscode --apply
  node install-memory-layer.mjs install --target vscode-copilot-instructions --apply
  node install-memory-layer.mjs install --target vscode-agent-instructions --apply
  node install-memory-layer.mjs install --target vscode-acp-client --apply
  node install-memory-layer.mjs install --target vscode-workspace --apply
  node install-memory-layer.mjs install --target antigravity --apply
  node install-memory-layer.mjs install --target antigravity-workspace --apply
  node install-memory-layer.mjs install --target cursor --apply
  node install-memory-layer.mjs install --target popular-editors --apply
  node install-memory-layer.mjs install --target windsurf --apply
  node install-memory-layer.mjs install --target cline --apply
  node install-memory-layer.mjs install --target roo-workspace --apply
  node install-memory-layer.mjs install --target continue-workspace --apply
  node install-memory-layer.mjs install --target kilo --apply
  node install-memory-layer.mjs install --target kilo-workspace --apply
  node install-memory-layer.mjs install --target hermes --apply
  node install-memory-layer.mjs install --target claude --apply
  node install-memory-layer.mjs install --target orchestrator-profile --apply
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
    } else if (item === "claude-code") {
      results.push(await installClaudeCode(apply, "user"));
    } else if (item === "claude-code-workspace") {
      results.push(await installClaudeCode(apply, "project"));
    } else if (item === "gemini-cli") {
      const config = args.config ? path.resolve(String(args.config)) : geminiCliConfigPath();
      results.push(await installJsonConfig(config, apply, "gemini-cli"));
    } else if (item === "gemini-cli-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".gemini", "settings.json");
      results.push(await installJsonConfig(config, apply, "gemini-cli-workspace"));
    } else if (item === "opencode") {
      const config = args.config ? path.resolve(String(args.config)) : opencodeConfigPath();
      results.push(await installOpenCodeConfig(config, apply, "opencode"));
    } else if (item === "opencode-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".opencode", "opencode.jsonc");
      results.push(await installOpenCodeConfig(config, apply, "opencode-workspace"));
    } else if (item === "vscode") {
      const config = args.config ? path.resolve(String(args.config)) : vscodeUserConfigPath();
      results.push(await installVsCodeConfig(config, apply, "vscode"));
    } else if (item === "vscode-insiders") {
      const config = args.config ? path.resolve(String(args.config)) : vscodeUserConfigPath("insiders");
      results.push(await installVsCodeConfig(config, apply, "vscode-insiders"));
    } else if (item === "vscodium") {
      const config = args.config ? path.resolve(String(args.config)) : vscodeUserConfigPath("vscodium");
      results.push(await installVsCodeConfig(config, apply, "vscodium"));
    } else if (item === "code-oss") {
      const config = args.config ? path.resolve(String(args.config)) : vscodeUserConfigPath("code-oss");
      results.push(await installVsCodeConfig(config, apply, "code-oss"));
    } else if (item === "vscode-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".vscode", "mcp.json");
      results.push(await installVsCodeConfig(config, apply, "vscode-workspace"));
    } else if (item === "vscode-copilot-instructions") {
      const file = args.config ? path.resolve(String(args.config)) : vscodeCopilotInstructionsPath();
      const settings = args.settings ? path.resolve(String(args.settings)) : vscodeUserSettingsPath();
      results.push(await installVsCodeCopilotInstructions(file, settings, apply));
    } else if (item === "vscode-agent-instructions") {
      const file = args.config ? path.resolve(String(args.config)) : vscodeAgentInstructionsPath();
      const settings = args.settings ? path.resolve(String(args.settings)) : vscodeUserSettingsPath();
      results.push(await installVsCodeAgentInstructions(file, settings, apply));
    } else if (item === "vscode-acp-client") {
      const settings = args.settings ? path.resolve(String(args.settings)) : vscodeUserSettingsPath();
      results.push(await installVsCodeAcpClientSettings(settings, apply, "vscode-acp-client"));
    } else if (item === "vscode-acp-client-workspace") {
      const settings = args.settings ? path.resolve(String(args.settings)) : path.resolve(".vscode", "settings.json");
      results.push(await installVsCodeAcpClientSettings(settings, apply, "vscode-acp-client-workspace"));
    } else if (item === "antigravity") {
      const config = args.config ? path.resolve(String(args.config)) : antigravityConfigPath();
      results.push(await installJsonConfig(config, apply, "antigravity"));
    } else if (item === "antigravity-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".agents", "mcp_config.json");
      results.push(await installJsonConfig(config, apply, "antigravity-workspace"));
    } else if (item === "cursor") {
      const config = args.config ? path.resolve(String(args.config)) : cursorConfigPath();
      results.push(await installJsonConfig(config, apply, "cursor"));
    } else if (item === "cursor-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".cursor", "mcp.json");
      results.push(await installJsonConfig(config, apply, "cursor-workspace"));
    } else if (item === "windsurf") {
      const config = args.config ? path.resolve(String(args.config)) : windsurfConfigPath();
      results.push(await installJsonConfig(config, apply, "windsurf"));
    } else if (item === "cline") {
      const config = args.config ? path.resolve(String(args.config)) : clineIdeConfigPath();
      results.push(await installJsonConfig(config, apply, "cline"));
    } else if (item === "cline-cli") {
      const config = args.config ? path.resolve(String(args.config)) : path.join(os.homedir(), ".cline", "mcp.json");
      results.push(await installJsonConfig(config, apply, "cline-cli"));
    } else if (item === "roo-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".roo", "mcp.json");
      results.push(await installJsonConfig(config, apply, "roo-workspace"));
    } else if (item === "continue-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".continue", "mcpServers", "syarif-memory-management.yaml");
      results.push(await installContinueConfig(config, apply));
    } else if (item === "kilo") {
      const config = args.config ? path.resolve(String(args.config)) : kiloConfigPath();
      results.push(await installKiloConfig(config, apply, "kilo"));
    } else if (item === "kilo-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".kilo", "kilo.jsonc");
      results.push(await installKiloConfig(config, apply, "kilo-workspace"));
    } else if (item === "hermes") {
      const config = args.config ? path.resolve(String(args.config)) : hermesConfigPath();
      results.push(await installHermesConfig(config, apply));
    } else if (item === "zed") {
      const config = args.config ? path.resolve(String(args.config)) : zedConfigPath();
      results.push(await installZedConfig(config, apply, "zed"));
    } else if (item === "zed-workspace") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".zed", "settings.json");
      results.push(await installZedConfig(config, apply, "zed-workspace"));
    } else if (item === "claude") {
      results.push(await installJsonConfig(claudeConfigPath(), apply, "claude"));
    } else if (item === "json") {
      const config = args.config ? path.resolve(String(args.config)) : path.resolve(".mcp.json");
      results.push(await installJsonConfig(config, apply, "json"));
    } else if (item === "orchestrator-profile") {
      const config = args.config ? path.resolve(String(args.config)) : orchestratorProfilePath();
      results.push(await installOrchestratorProfile(config, apply));
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

async function installClaudeCode(apply, scope) {
  const target = scope === "project" ? "claude-code-workspace" : "claude-code";
  const commandLine = [
    "claude",
    "mcp",
    "add",
    "--env",
    `AI_MEMORY_ROOT=${memoryRoot()}`,
    "--transport",
    "stdio",
    "--scope",
    scope,
    serverName,
    "--",
    "node",
    mcpServerScript,
  ];

  if (!apply) {
    return { target, mode: "dry-run", command: commandLine.join(" ") };
  }

  if (!await commandExists("claude")) {
    return { target, mode: "apply", status: "skipped", note: "claude command is not available on PATH." };
  }

  const list = await run("claude", ["mcp", "list"]).catch(() => "");
  if (scope === "user" && list.includes(serverName)) {
    return {
      target,
      mode: "apply",
      status: "already-present",
      note: `Run "claude mcp remove ${serverName}" first if you want to replace it.`,
    };
  }

  const output = await run(commandLine[0], commandLine.slice(1));
  return { target, mode: "apply", status: "installed", output: output.trim() };
}

async function installVsCodeConfig(file, apply, target) {
  const next = await mergedVsCodeMcpJson(file);

  if (!apply) {
    return { target, mode: "dry-run", file, configPatch: { servers: { [serverName]: vscodeMcpServerConfig() } } };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { target, mode: "apply", status: "written", file };
}

async function installJsonConfig(file, apply, target) {
  const next = await mergedMcpJson(file);

  if (!apply) {
    return { target, mode: "dry-run", file, configPatch: { mcpServers: { [serverName]: mcpServerConfig() } } };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { target, mode: "apply", status: "written", file };
}

async function installVsCodeCopilotInstructions(file, settingsFile, apply) {
  const instructions = vscodeCopilotInstructionsMarkdown();
  const settings = await mergedVsCodeCopilotSettings(settingsFile);

  if (!apply) {
    return {
      target: "vscode-copilot-instructions",
      mode: "dry-run",
      file,
      settingsFile,
      instructions,
      settingsPatch: vscodeInstructionSettingsPatch(vscodeCopilotInstructionsLocationSetting()),
    };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${instructions.trimEnd()}\n`, "utf8");

  await fs.mkdir(path.dirname(settingsFile), { recursive: true });
  await backupIfExists(settingsFile);
  await fs.writeFile(settingsFile, `${JSON.stringify(settings, null, 2)}\n`, "utf8");

  return {
    target: "vscode-copilot-instructions",
    mode: "apply",
    status: "written",
    file,
    settingsFile,
  };
}

async function installVsCodeAgentInstructions(file, settingsFile, apply) {
  const instructions = vscodeAgentInstructionsMarkdown();
  const settings = await mergedVsCodeInstructionSettings(settingsFile, vscodeAgentInstructionsLocationSetting());

  if (!apply) {
    return {
      target: "vscode-agent-instructions",
      mode: "dry-run",
      file,
      settingsFile,
      instructions,
      settingsPatch: vscodeInstructionSettingsPatch(vscodeAgentInstructionsLocationSetting()),
    };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${instructions.trimEnd()}\n`, "utf8");

  await fs.mkdir(path.dirname(settingsFile), { recursive: true });
  await backupIfExists(settingsFile);
  await fs.writeFile(settingsFile, `${JSON.stringify(settings, null, 2)}\n`, "utf8");

  return {
    target: "vscode-agent-instructions",
    mode: "apply",
    status: "written",
    file,
    settingsFile,
  };
}

async function installVsCodeAcpClientSettings(settingsFile, apply, target) {
  const settings = await mergedVsCodeAcpClientSettings(settingsFile);

  if (!apply) {
    return { target, mode: "dry-run", settingsFile, settingsPatch: vscodeAcpClientSettingsPatch() };
  }

  await fs.mkdir(path.dirname(settingsFile), { recursive: true });
  await backupIfExists(settingsFile);
  await fs.writeFile(settingsFile, `${JSON.stringify(settings, null, 2)}\n`, "utf8");

  return { target, mode: "apply", status: "written", settingsFile };
}

async function installKiloConfig(file, apply, target) {
  const next = await mergedKiloJson(file);

  if (!apply) {
    return { target, mode: "dry-run", file, configPatch: { mcp: { [serverName]: kiloMcpServerConfig() } } };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { target, mode: "apply", status: "written", file };
}

async function installOpenCodeConfig(file, apply, target) {
  const next = await mergedOpenCodeJson(file);

  if (!apply) {
    return { target, mode: "dry-run", file, configPatch: { mcp: { servers: { [serverName]: openCodeMcpServerConfig() } } } };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { target, mode: "apply", status: "written", file };
}

async function installZedConfig(file, apply, target) {
  const next = await mergedZedJson(file);

  if (!apply) {
    return { target, mode: "dry-run", file, configPatch: { context_servers: { [serverName]: zedMcpServerConfig() } } };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { target, mode: "apply", status: "written", file };
}

async function installHermesConfig(file, apply) {
  const current = await fs.readFile(file, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const next = mergedHermesYaml(current);
  const alreadyPresent = current.includes(`${serverName}:`);

  if (!apply) {
    return { target: "hermes", mode: "dry-run", file, alreadyPresent, config: next };
  }

  if (alreadyPresent) {
    return {
      target: "hermes",
      mode: "apply",
      status: "already-present",
      file,
      note: `Remove or edit the existing ${serverName} block first if you want to replace it.`,
    };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, next, "utf8");
  return { target: "hermes", mode: "apply", status: "written", file };
}

async function installContinueConfig(file, apply) {
  const current = await fs.readFile(file, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const next = continueMcpServerYaml();
  const alreadyPresent = current.includes(`name: ${serverName}`) || current.includes(`name: Syarif Memory Management`);

  if (!apply) {
    return { target: "continue-workspace", mode: "dry-run", file, alreadyPresent, config: next };
  }

  if (alreadyPresent) {
    return {
      target: "continue-workspace",
      mode: "apply",
      status: "already-present",
      file,
      note: `Remove or edit the existing ${serverName} Continue MCP file first if you want to replace it.`,
    };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, next, "utf8");
  return { target: "continue-workspace", mode: "apply", status: "written", file };
}

async function installHookManifest(file, apply) {
  const manifest = {
    name: "syarif-memory-management-hooks",
    preflight: {
      command: "node",
      args: [hookScript, "preflight", "--cwd", "${projectRoot}", "--query", "${taskIntent}"],
      env: { AI_MEMORY_ROOT: memoryRoot() },
      policy: "conditional; SKIP is success when prior context is not material",
    },
    checkpoint: {
      command: "node",
      args: [hookScript, "checkpoint", "--cwd", "${projectRoot}", "--summary", "${handoffSummary}"],
      env: { AI_MEMORY_ROOT: memoryRoot() },
      policy: "write only durable reusable knowledge; no checkpoint for temporary debugging",
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

async function installOrchestratorProfile(file, apply) {
  const profile = orchestratorProfileYaml();

  if (!apply) {
    return { target: "orchestrator-profile", mode: "dry-run", file, config: profile };
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupIfExists(file);
  await fs.writeFile(file, `${profile.trimEnd()}\n`, "utf8");
  return { target: "orchestrator-profile", mode: "apply", status: "written", file };
}

async function mergedVsCodeMcpJson(file) {
  const current = await readJson(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  next.servers = next.servers && typeof next.servers === "object" ? next.servers : {};
  next.servers[serverName] = vscodeMcpServerConfig();
  return next;
}

async function mergedMcpJson(file) {
  const current = await readJson(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  next.mcpServers = next.mcpServers && typeof next.mcpServers === "object" ? next.mcpServers : {};
  next.mcpServers[serverName] = mcpServerConfig();
  return next;
}

async function mergedVsCodeCopilotSettings(file) {
  return mergedVsCodeInstructionSettings(file, vscodeCopilotInstructionsLocationSetting());
}

async function mergedVsCodeInstructionSettings(file, location) {
  const current = await readJsonc(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  const locations = next["chat.instructionsFilesLocations"] && typeof next["chat.instructionsFilesLocations"] === "object" && !Array.isArray(next["chat.instructionsFilesLocations"])
    ? next["chat.instructionsFilesLocations"]
    : {};

  locations[location] = true;
  next["chat.instructionsFilesLocations"] = locations;
  next["chat.includeApplyingInstructions"] = true;
  next["github.copilot.chat.codeGeneration.useInstructionFiles"] = true;

  return next;
}

function vscodeInstructionSettingsPatch(location) {
  return {
    "chat.instructionsFilesLocations": {
      [location]: true,
    },
    "chat.includeApplyingInstructions": true,
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  };
}

async function mergedVsCodeAcpClientSettings(file) {
  const current = await readJsonc(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  const agents = next["acp.agents"] && typeof next["acp.agents"] === "object" && !Array.isArray(next["acp.agents"])
    ? next["acp.agents"]
    : {};

  for (const [name, config] of Object.entries(acpClientAgentConfigs())) {
    const currentAgent = agents[name] && typeof agents[name] === "object" && !Array.isArray(agents[name]) ? agents[name] : {};
    const currentEnv = currentAgent.env && typeof currentAgent.env === "object" && !Array.isArray(currentAgent.env) ? currentAgent.env : {};
    agents[name] = {
      ...config,
      ...currentAgent,
      env: {
        ...currentEnv,
        ...config.env,
      },
    };
  }

  next["acp.agents"] = agents;
  return next;
}

function vscodeAcpClientSettingsPatch() {
  return {
    "acp.agents": acpClientAgentConfigs(),
  };
}

async function mergedKiloJson(file) {
  const current = await readJsonc(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  next.mcp = next.mcp && typeof next.mcp === "object" && !Array.isArray(next.mcp) ? next.mcp : {};
  next.mcp[serverName] = kiloMcpServerConfig();
  return next;
}

async function mergedOpenCodeJson(file) {
  const current = await readJsonc(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  next.mcp = next.mcp && typeof next.mcp === "object" && !Array.isArray(next.mcp) ? next.mcp : {};
  next.mcp.servers = next.mcp.servers && typeof next.mcp.servers === "object" && !Array.isArray(next.mcp.servers)
    ? next.mcp.servers
    : {};
  next.mcp.servers[serverName] = openCodeMcpServerConfig();
  return next;
}

async function mergedZedJson(file) {
  const current = await readJsonc(file);
  const next = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  next.context_servers = next.context_servers && typeof next.context_servers === "object" && !Array.isArray(next.context_servers)
    ? next.context_servers
    : {};
  next.context_servers[serverName] = zedMcpServerConfig();
  return next;
}

function vscodeMcpServerConfig() {
  return {
    type: "stdio",
    command: "node",
    args: [mcpServerScript],
    env: {
      AI_MEMORY_ROOT: memoryRoot(),
    },
  };
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

function kiloMcpServerConfig() {
  return {
    type: "local",
    command: ["node", mcpServerScript],
    environment: {
      AI_MEMORY_ROOT: memoryRoot(),
    },
    enabled: true,
    timeout: 10000,
  };
}

function openCodeMcpServerConfig() {
  return {
    type: "local",
    command: ["node", mcpServerScript],
    environment: {
      AI_MEMORY_ROOT: memoryRoot(),
    },
    disabled: false,
  };
}

function zedMcpServerConfig() {
  return {
    command: "node",
    args: [mcpServerScript],
    env: {
      AI_MEMORY_ROOT: memoryRoot(),
    },
  };
}

function acpClientAgentConfigs() {
  const env = acpMemoryEnv();

  return {
    "GitHub Copilot": {
      command: "npx",
      args: ["@github/copilot-language-server@latest", "--acp"],
      env,
    },
    "Claude Code": {
      command: "npx",
      args: ["@agentclientprotocol/claude-agent-acp@latest"],
      env,
    },
    "Gemini CLI": {
      command: "npx",
      args: ["@google/gemini-cli@latest", "--experimental-acp"],
      env,
    },
    "Codex CLI": {
      command: "npx",
      args: ["@zed-industries/codex-acp@latest"],
      env,
    },
  };
}

function acpMemoryEnv() {
  return {
    AI_MEMORY_ROOT: memoryRoot(),
    SYARIF_MEMORY_ORCHESTRATOR_PROFILE: orchestratorProfilePath(),
    SYARIF_MEMORY_MCP_SERVER: serverName,
    SYARIF_MEMORY_MCP_SERVER_SCRIPT: mcpServerScript,
    SYARIF_MEMORY_BOOTSTRAP: "Connect the syarif-memory-management MCP server when supported, run conditional memory_auto before broad work only when prior context may matter, keep memory outside specialist slots, and memory_checkpoint only durable handoff knowledge.",
  };
}

function vscodeCopilotInstructionsMarkdown() {
  return `---
applyTo: "**"
---
# Syarif Memory Management

- Before broad exploration or implementation, call the \`syarif-memory-management\` MCP tool \`memory_auto\` only when prior project/session/workflow/decision context may materially affect correctness.
- Skip memory when the task is self-contained, such as a standalone syntax question, isolated helper with complete requirements, or generic Laravel docs question.
- If MCP is unavailable, fall back to the local \`memory.mjs auto\` CLI when Node/file access exists; otherwise continue without memory.
- \`memory-management\` is context infrastructure and never consumes primary/support specialist slots.
- When finishing meaningful work, call \`memory_checkpoint\` only for durable reusable knowledge, decisions, constraints, reusable root causes, project conventions, environment quirks, or pending continuation state.
- Treat retrieved memory as orientation and verify technical facts against the current workspace before editing. Current code/config wins over old memory.
- Never write secrets, credentials, raw personal data, or .env values to memory.
`;
}

function vscodeAgentInstructionsMarkdown() {
  return `---
applyTo: "**"
---
# Syarif Memory Management For VS Code Agents

- For GitHub Copilot, OpenAI Codex/GPT, Claude Code, Gemini CLI, Codex CLI, OpenCode, Kilo Code, Cline, Roo Code, Continue, Hermes Agent, Cursor, Windsurf, Zed, and Antigravity sessions, prefer the configured \`syarif-memory-management\` MCP server when the host exposes MCP tools or forwards MCP through ACP.
- In ACP Client for VS Code, keep the agent process environment pointed at \`SYARIF_MEMORY_MCP_SERVER\` and \`SYARIF_MEMORY_MCP_SERVER_SCRIPT\`, then connect the underlying agent's native MCP support when it is available.
- Before broad exploration or implementation, conditionally call \`memory_auto\` for the current workspace/project when prior project/session/workflow/decision context may materially affect correctness.
- Skip memory for self-contained syntax, isolated-helper, or generic docs tasks. If MCP is unavailable, fall back to the local CLI when Node/file access exists; otherwise continue without memory.
- During long work, use \`memory_recall\` for focused follow-up context instead of loading broad memory files.
- For long-running, multi-session, multi-provider, delegated, compressed, or ACP-backed work, read \`${orchestratorProfilePath()}\` when it exists and apply it as non-secret host policy. Provider failover, task delegation, and context compression are host/orchestrator capabilities; when the current host cannot execute them, record the intended routing policy in memory instead of pretending it happened.
- \`memory-management\` is context infrastructure and never consumes primary/support specialist slots.
- When finishing meaningful work, call \`memory_checkpoint\` only for durable reusable knowledge, decisions, constraints, reusable root causes, project conventions, environment quirks, pending work, and validation.
- Treat retrieved memory as orientation and verify technical facts against the current workspace before editing. Current code/config wins over old memory.
- Never write secrets, credentials, raw personal data, or .env values to memory.
`;
}

function orchestratorProfileYaml() {
  return [
    "# Syarif Memory Orchestrator Profile",
    "# Non-secret portable policy for long-running agent sessions.",
    "# Keep credentials in the host secret store or environment, never in this file.",
    "memory_orchestrator:",
    "  built_in_memory: always_on",
    `  memory_root: "${escapeYamlDoubleQuoted(memoryRoot())}"`,
    "  mcp_server:",
    `    name: "${serverName}"`,
    "    transport: stdio",
    "    command: node",
    `    script: "${escapeYamlDoubleQuoted(mcpServerScript)}"`,
    "  external_memory_provider:",
    "    mode: optional_additive",
    "    active: null",
    "    allowed:",
    "      - honcho",
    "      - openviking",
    "      - mem0",
    "      - hindsight",
    "      - holographic",
    "      - retaindb",
    "      - byterover",
    "      - supermemory",
    "  skills:",
    "    loading: progressive_disclosure",
    "    memory_is_facts_and_context: true",
    "    skills_are_procedures: true",
    "    memory_counts_as_specialist_slot: false",
    "    index_only_at_start: true",
    "  lifecycle:",
    "    memory_preflight: conditional_before_broad_exploration",
    "    preflight_skip_is_success: true",
    "    checkpoint: durable_reusable_knowledge_only",
    "    unavailable_memory: continue_without_failure",
    "  provider_policy:",
    "    primary:",
    "      provider: openai-codex",
    "      model: \"<primary-model>\"",
    "    fallback_providers:",
    "      - provider: openai-api",
    "        model: \"<fallback-mini-model>\"",
    "      - provider: anthropic",
    "        model: \"<claude-review-model>\"",
    "      - provider: gemini",
    "        model: \"<gemini-light-model>\"",
    "      - provider: openrouter",
    "        model: \"<openrouter-coding-model>\"",
    "    failover_triggers:",
    "      - rate_limit",
    "      - server_error",
    "      - auth_failure",
    "      - connection_error",
    "      - invalid_response",
    "  delegation:",
    "    default_context: explicit_task_context_only",
    "    max_scope: current_project",
    "    workers:",
    "      architecture_review:",
    "        provider: anthropic",
    "        model: \"<claude-review-model>\"",
    "        tools: [read_file, search]",
    "      light_research:",
    "        provider: gemini",
    "        model: \"<gemini-light-model>\"",
    "        tools: [web_extract, summarize]",
    "      coding_worker:",
    "        provider: openai-codex",
    "        model: \"<primary-model>\"",
    "        tools: [read_file, patch, terminal]",
    "  auxiliary:",
    "    compression:",
    "      provider: openai-api",
    "      model: \"<cheap-compression-model>\"",
    "    vision:",
    "      provider: auto",
    "      model: null",
    "    web_extract:",
    "      provider: gemini",
    "      model: \"<gemini-light-model>\"",
    "  interfaces:",
    "    - cli",
    "    - vscode_acp",
    "    - openai_compatible_api",
    "    - messaging_gateway",
    "    - python",
    "  guardrails:",
    "    store_secrets: false",
    "    store_raw_env: false",
    "    store_raw_personal_data: false",
    "    external_sync_requires_user_approval: true",
    "    retrieved_memory_must_be_verified_against_workspace: true",
    "",
  ].join("\n");
}

function hermesMcpServerYaml() {
  return [
    `  ${serverName}:`,
    `    command: "node"`,
    `    args:`,
    `      - "${escapeYamlDoubleQuoted(mcpServerScript)}"`,
    `    env:`,
      `      AI_MEMORY_ROOT: "${escapeYamlDoubleQuoted(memoryRoot())}"`,
  ].join("\n");
}

function continueMcpServerYaml() {
  return [
    "name: Syarif Memory Management",
    "version: 0.0.1",
    "schema: v1",
    "mcpServers:",
    `  - name: ${serverName}`,
    "    type: stdio",
    "    command: node",
    "    args:",
    `      - "${escapeYamlDoubleQuoted(mcpServerScript)}"`,
    "    env:",
    `      AI_MEMORY_ROOT: "${escapeYamlDoubleQuoted(memoryRoot())}"`,
    "",
  ].join("\n");
}

function mergedHermesYaml(content) {
  const text = String(content || "").trimEnd();
  if (text.includes(`${serverName}:`)) {
    return `${text}\n`;
  }

  const block = hermesMcpServerYaml();
  if (!text.trim()) {
    return `mcp_servers:\n${block}\n`;
  }

  if (/^mcp_servers:\s*$/m.test(text)) {
    return text.replace(/^mcp_servers:\s*$/m, `mcp_servers:\n${block}`) + "\n";
  }

  return `${text}\n\nmcp_servers:\n${block}\n`;
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
    } else if (item === "claude-code") {
      snippets.push([
        "# Claude Code user MCP config",
        `claude mcp add --env AI_MEMORY_ROOT=${quoteShell(memoryRoot())} --transport stdio --scope user ${serverName} -- node ${quoteShell(mcpServerScript)}`,
      ].join("\n"));
    } else if (item === "claude-code-workspace") {
      snippets.push([
        "# Claude Code project MCP config",
        `claude mcp add --env AI_MEMORY_ROOT=${quoteShell(memoryRoot())} --transport stdio --scope project ${serverName} -- node ${quoteShell(mcpServerScript)}`,
      ].join("\n"));
    } else if (item === "gemini-cli") {
      snippets.push([
        "# Gemini CLI user MCP config",
        `# ${geminiCliConfigPath()}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "gemini-cli-workspace") {
      snippets.push([
        "# Gemini CLI workspace MCP config",
        "# .gemini/settings.json",
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "opencode") {
      snippets.push([
        "# OpenCode global MCP config",
        `# ${opencodeConfigPath()}`,
        JSON.stringify({ mcp: { servers: { [serverName]: openCodeMcpServerConfig() } } }, null, 2),
      ].join("\n"));
    } else if (item === "opencode-workspace") {
      snippets.push([
        "# OpenCode workspace MCP config",
        "# .opencode/opencode.jsonc",
        JSON.stringify({ mcp: { servers: { [serverName]: openCodeMcpServerConfig() } } }, null, 2),
      ].join("\n"));
    } else if (item === "vscode") {
      snippets.push([
        "# VS Code user MCP config",
        `# ${vscodeUserConfigPath()}`,
        JSON.stringify({ servers: { [serverName]: vscodeMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "vscode-insiders") {
      snippets.push([
        "# VS Code Insiders user MCP config",
        `# ${vscodeUserConfigPath("insiders")}`,
        JSON.stringify({ servers: { [serverName]: vscodeMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "vscodium") {
      snippets.push([
        "# VSCodium user MCP config",
        `# ${vscodeUserConfigPath("vscodium")}`,
        JSON.stringify({ servers: { [serverName]: vscodeMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "code-oss") {
      snippets.push([
        "# Code - OSS user MCP config",
        `# ${vscodeUserConfigPath("code-oss")}`,
        JSON.stringify({ servers: { [serverName]: vscodeMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "vscode-workspace") {
      snippets.push([
        "# VS Code workspace MCP config",
        "# .vscode/mcp.json",
        JSON.stringify({ servers: { [serverName]: vscodeMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "vscode-copilot-instructions") {
      snippets.push([
        "# VS Code / GitHub Copilot global instructions",
        `# ${vscodeCopilotInstructionsPath()}`,
        vscodeCopilotInstructionsMarkdown().trimEnd(),
        "",
        `# ${vscodeUserSettingsPath()}`,
        JSON.stringify(vscodeInstructionSettingsPatch(vscodeCopilotInstructionsLocationSetting()), null, 2),
      ].join("\n"));
    } else if (item === "vscode-agent-instructions") {
      snippets.push([
        "# VS Code-family AI agent global instructions",
        `# ${vscodeAgentInstructionsPath()}`,
        vscodeAgentInstructionsMarkdown().trimEnd(),
        "",
        `# ${vscodeUserSettingsPath()}`,
        JSON.stringify(vscodeInstructionSettingsPatch(vscodeAgentInstructionsLocationSetting()), null, 2),
      ].join("\n"));
    } else if (item === "vscode-acp-client") {
      snippets.push([
        "# ACP Client for VS Code user settings",
        `# ${vscodeUserSettingsPath()}`,
        JSON.stringify(vscodeAcpClientSettingsPatch(), null, 2),
      ].join("\n"));
    } else if (item === "vscode-acp-client-workspace") {
      snippets.push([
        "# ACP Client for VS Code workspace settings",
        "# .vscode/settings.json",
        JSON.stringify(vscodeAcpClientSettingsPatch(), null, 2),
      ].join("\n"));
    } else if (item === "antigravity") {
      snippets.push([
        "# Antigravity global MCP config",
        `# ${antigravityConfigPath()}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "antigravity-workspace") {
      snippets.push([
        "# Antigravity workspace MCP config",
        "# .agents/mcp_config.json",
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "cursor") {
      snippets.push([
        "# Cursor global MCP config",
        `# ${cursorConfigPath()}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "cursor-workspace") {
      snippets.push([
        "# Cursor workspace MCP config",
        "# .cursor/mcp.json",
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "windsurf") {
      snippets.push([
        "# Windsurf MCP config",
        `# ${windsurfConfigPath()}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "cline") {
      snippets.push([
        "# Cline IDE MCP config",
        `# ${clineIdeConfigPath()}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "cline-cli") {
      snippets.push([
        "# Cline CLI MCP config",
        `# ${path.join(os.homedir(), ".cline", "mcp.json")}`,
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "roo-workspace") {
      snippets.push([
        "# Roo Code workspace MCP config",
        "# .roo/mcp.json",
        JSON.stringify({ mcpServers: { [serverName]: mcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "continue-workspace") {
      snippets.push([
        "# Continue workspace MCP config",
        "# .continue/mcpServers/syarif-memory-management.yaml",
        continueMcpServerYaml().trimEnd(),
      ].join("\n"));
    } else if (item === "kilo") {
      snippets.push([
        "# Kilo Code global config",
        `# ${kiloConfigPath()}`,
        JSON.stringify({ mcp: { [serverName]: kiloMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "kilo-workspace") {
      snippets.push([
        "# Kilo Code workspace config",
        "# .kilo/kilo.jsonc",
        JSON.stringify({ mcp: { [serverName]: kiloMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "hermes") {
      snippets.push([
        "# Hermes Agent MCP config",
        `# ${hermesConfigPath()}`,
        `mcp_servers:\n${hermesMcpServerYaml()}`,
      ].join("\n"));
    } else if (item === "zed") {
      snippets.push([
        "# Zed global MCP config",
        `# ${zedConfigPath()}`,
        JSON.stringify({ context_servers: { [serverName]: zedMcpServerConfig() } }, null, 2),
      ].join("\n"));
    } else if (item === "zed-workspace") {
      snippets.push([
        "# Zed workspace MCP config",
        "# .zed/settings.json",
        JSON.stringify({ context_servers: { [serverName]: zedMcpServerConfig() } }, null, 2),
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
    } else if (item === "orchestrator-profile") {
      snippets.push([
        "# Memory orchestrator profile",
        `# ${orchestratorProfilePath()}`,
        orchestratorProfileYaml().trimEnd(),
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
    claudeCode: {
      available: await commandExists("claude"),
      install: `claude mcp add --env AI_MEMORY_ROOT=${memoryRoot()} --transport stdio --scope user ${serverName} -- node ${mcpServerScript}`,
      workspaceInstall: `claude mcp add --env AI_MEMORY_ROOT=${memoryRoot()} --transport stdio --scope project ${serverName} -- node ${mcpServerScript}`,
    },
    geminiCli: {
      available: await commandExists("gemini"),
      globalConfig: geminiCliConfigPath(),
      globalConfigExists: await exists(geminiCliConfigPath()),
      workspaceConfig: path.resolve(".gemini", "settings.json"),
      workspaceConfigExists: await exists(path.resolve(".gemini", "settings.json")),
    },
    opencode: {
      available: await commandExists("opencode"),
      globalConfig: opencodeConfigPath(),
      globalConfigExists: await exists(opencodeConfigPath()),
      workspaceConfig: path.resolve(".opencode", "opencode.jsonc"),
      workspaceConfigExists: await exists(path.resolve(".opencode", "opencode.jsonc")),
    },
    vscode: {
      commandAvailable: await commandExists("code"),
      userConfig: vscodeUserConfigPath(),
      userConfigExists: await exists(vscodeUserConfigPath()),
      userSettings: vscodeUserSettingsPath(),
      userSettingsExists: await exists(vscodeUserSettingsPath()),
      globalInstructions: vscodeCopilotInstructionsPath(),
      globalInstructionsExists: await exists(vscodeCopilotInstructionsPath()),
      globalAgentInstructions: vscodeAgentInstructionsPath(),
      globalAgentInstructionsExists: await exists(vscodeAgentInstructionsPath()),
      globalInstructionsLocation: vscodeCopilotInstructionsLocationSetting(),
      globalAgentInstructionsLocation: vscodeAgentInstructionsLocationSetting(),
      workspaceConfig: path.resolve(".vscode", "mcp.json"),
      workspaceConfigExists: await exists(path.resolve(".vscode", "mcp.json")),
      agentExtensions: [
        "GitHub Copilot",
        "OpenAI Codex/GPT",
        "Claude Code",
        "Kilo Code",
        "Cline",
        "Roo Code",
        "Continue",
        "Hermes via ACP/MCP",
      ],
      familyUserConfigs: {
        stable: {
          config: vscodeUserConfigPath(),
          exists: await exists(vscodeUserConfigPath()),
        },
        insiders: {
          config: vscodeUserConfigPath("insiders"),
          exists: await exists(vscodeUserConfigPath("insiders")),
        },
        vscodium: {
          config: vscodeUserConfigPath("vscodium"),
          exists: await exists(vscodeUserConfigPath("vscodium")),
        },
        codeOss: {
          config: vscodeUserConfigPath("code-oss"),
          exists: await exists(vscodeUserConfigPath("code-oss")),
        },
      },
      acpClient: {
        userSettings: vscodeUserSettingsPath(),
        userSettingsExists: await exists(vscodeUserSettingsPath()),
        workspaceSettings: path.resolve(".vscode", "settings.json"),
        workspaceSettingsExists: await exists(path.resolve(".vscode", "settings.json")),
        defaultAgents: Object.keys(acpClientAgentConfigs()),
      },
    },
    antigravity: {
      globalConfig: antigravityConfigPath(),
      globalConfigExists: await exists(antigravityConfigPath()),
      workspaceConfig: path.resolve(".agents", "mcp_config.json"),
      workspaceConfigExists: await exists(path.resolve(".agents", "mcp_config.json")),
    },
    cursor: {
      globalConfig: cursorConfigPath(),
      globalConfigExists: await exists(cursorConfigPath()),
      workspaceConfig: path.resolve(".cursor", "mcp.json"),
      workspaceConfigExists: await exists(path.resolve(".cursor", "mcp.json")),
    },
    windsurf: {
      config: windsurfConfigPath(),
      exists: await exists(windsurfConfigPath()),
    },
    cline: {
      ideConfig: clineIdeConfigPath(),
      ideConfigExists: await exists(clineIdeConfigPath()),
      cliConfig: path.join(os.homedir(), ".cline", "mcp.json"),
      cliConfigExists: await exists(path.join(os.homedir(), ".cline", "mcp.json")),
    },
    rooCode: {
      workspaceConfig: path.resolve(".roo", "mcp.json"),
      workspaceConfigExists: await exists(path.resolve(".roo", "mcp.json")),
    },
    continue: {
      workspaceConfig: path.resolve(".continue", "mcpServers", "syarif-memory-management.yaml"),
      workspaceConfigExists: await exists(path.resolve(".continue", "mcpServers", "syarif-memory-management.yaml")),
    },
    kilo: {
      globalConfig: kiloConfigPath(),
      globalConfigExists: await exists(kiloConfigPath()),
      workspaceConfig: path.resolve(".kilo", "kilo.jsonc"),
      workspaceConfigExists: await exists(path.resolve(".kilo", "kilo.jsonc")),
    },
    hermes: {
      config: hermesConfigPath(),
      exists: await exists(hermesConfigPath()),
    },
    zed: {
      globalConfig: zedConfigPath(),
      globalConfigExists: await exists(zedConfigPath()),
      workspaceConfig: path.resolve(".zed", "settings.json"),
      workspaceConfigExists: await exists(path.resolve(".zed", "settings.json")),
    },
    claude: {
      config: claudeConfigPath(),
      exists: await exists(claudeConfigPath()),
    },
    genericJson: {
      defaultConfig: path.resolve(".mcp.json"),
    },
    orchestratorProfile: {
      profile: orchestratorProfilePath(),
      exists: await exists(orchestratorProfilePath()),
    },
    hooks: {
      manifest: path.join(memoryRoot(), "hooks.json"),
    },
  };
}

function expandTargets(target) {
  if (target === "all") {
    return [
      "codex",
      "claude-code",
      "gemini-cli",
      "opencode",
      "vscode",
      "vscode-insiders",
      "vscodium",
      "code-oss",
      "vscode-copilot-instructions",
      "vscode-agent-instructions",
      "vscode-acp-client",
      "antigravity",
      "cursor",
      "windsurf",
      "zed",
      "cline",
      "kilo",
      "hermes",
      "claude",
      "json",
      "orchestrator-profile",
      "hooks",
    ];
  }

  const aliases = {
    "vscode-family": ["vscode", "vscode-insiders", "vscodium", "code-oss"],
    "ai-agent-tools": ["codex", "claude-code", "gemini-cli", "opencode"],
    "popular-editors": ["vscode", "cursor", "windsurf", "zed"],
  };
  const targets = [];
  const seen = new Set();
  for (const item of target.split(",").map((value) => value.trim()).filter(Boolean).flatMap((value) => aliases[value] || [value])) {
    if (seen.has(item)) continue;
    seen.add(item);
    targets.push(item);
  }
  const allowed = new Set([
    "codex",
    "claude-code",
    "claude-code-workspace",
    "gemini-cli",
    "gemini-cli-workspace",
    "opencode",
    "opencode-workspace",
    "vscode",
    "vscode-insiders",
    "vscodium",
    "code-oss",
    "vscode-workspace",
    "vscode-copilot-instructions",
    "vscode-agent-instructions",
    "vscode-acp-client",
    "vscode-acp-client-workspace",
    "antigravity",
    "antigravity-workspace",
    "cursor",
    "cursor-workspace",
    "windsurf",
    "cline",
    "cline-cli",
    "roo-workspace",
    "continue-workspace",
    "kilo",
    "kilo-workspace",
    "hermes",
    "zed",
    "zed-workspace",
    "claude",
    "json",
    "orchestrator-profile",
    "hooks",
  ]);

  for (const item of targets) {
    if (!allowed.has(item)) {
      throw new Error(`unsupported target "${item}"`);
    }
  }

  return targets;
}

function vscodeUserConfigPath(product = "stable") {
  return path.join(vscodeUserDir(product), "mcp.json");
}

function vscodeUserSettingsPath(product = "stable") {
  return path.join(vscodeUserDir(product), "settings.json");
}

function vscodeUserDir(product = "stable") {
  const name = vscodeProductConfigName(product);

  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), name, "User");
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", name, "User");
  }

  return path.join(os.homedir(), ".config", name, "User");
}

function vscodeProductConfigName(product) {
  return {
    stable: "Code",
    insiders: "Code - Insiders",
    vscodium: "VSCodium",
    "code-oss": "Code - OSS",
  }[product] || "Code";
}

function vscodeCopilotInstructionsPath() {
  return path.join(vscodeCopilotInstructionsDir(), "syarif-memory-management.instructions.md");
}

function vscodeAgentInstructionsPath() {
  return path.join(vscodeAgentInstructionsDir(), "syarif-memory-management-agents.instructions.md");
}

function orchestratorProfilePath() {
  return path.join(memoryRoot(), "orchestrator-profile.yaml");
}

function vscodeCopilotInstructionsDir() {
  return path.join(memoryRoot(), "vscode-copilot-instructions");
}

function vscodeAgentInstructionsDir() {
  return path.join(memoryRoot(), "vscode-agent-instructions");
}

function vscodeCopilotInstructionsLocationSetting() {
  const root = memoryRoot();
  const defaultRoot = path.resolve(path.join(os.homedir(), ".ai-memory"));
  if (root === defaultRoot) {
    return "~/.ai-memory/vscode-copilot-instructions";
  }

  return vscodeCopilotInstructionsDir();
}

function vscodeAgentInstructionsLocationSetting() {
  const root = memoryRoot();
  const defaultRoot = path.resolve(path.join(os.homedir(), ".ai-memory"));
  if (root === defaultRoot) {
    return "~/.ai-memory/vscode-agent-instructions";
  }

  return vscodeAgentInstructionsDir();
}

function antigravityConfigPath() {
  return path.join(os.homedir(), ".gemini", "config", "mcp_config.json");
}

function geminiCliConfigPath() {
  return path.join(os.homedir(), ".gemini", "settings.json");
}

function opencodeConfigPath() {
  return path.join(os.homedir(), ".config", "opencode", "opencode.jsonc");
}

function cursorConfigPath() {
  return path.join(os.homedir(), ".cursor", "mcp.json");
}

function windsurfConfigPath() {
  return path.join(os.homedir(), ".codeium", "windsurf", "mcp_config.json");
}

function clineIdeConfigPath() {
  return path.join(os.homedir(), ".cline", "data", "settings", "cline_mcp_settings.json");
}

function kiloConfigPath() {
  return path.join(os.homedir(), ".config", "kilo", "kilo.jsonc");
}

function hermesConfigPath() {
  return path.join(os.homedir(), ".hermes", "config.yaml");
}

function zedConfigPath() {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "Zed", "settings.json");
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Zed", "settings.json");
  }

  return path.join(os.homedir(), ".config", "zed", "settings.json");
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
    const content = await fs.readFile(file, "utf8");
    if (!content.trim()) return {};
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`cannot parse JSON config ${file}: ${error.message}`);
  }
}

async function readJsonc(file) {
  try {
    const content = await fs.readFile(file, "utf8");
    if (!content.trim()) return {};
    return JSON.parse(stripJsonc(content));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`cannot parse JSONC config ${file}: ${error.message}`);
  }
}

function stripJsonc(content) {
  let output = "";
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      inString = true;
      quote = char;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      while (index < content.length && content[index] !== "\n") {
        index += 1;
      }
      output += "\n";
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (index < content.length && !(content[index] === "*" && content[index + 1] === "/")) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += char;
  }

  return output.replace(/,\s*([}\]])/g, "$1");
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

function escapeYamlDoubleQuoted(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
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
