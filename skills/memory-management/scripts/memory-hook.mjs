#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const memoryScript = path.join(__dirname, "memory.mjs");

const [event = "preflight", ...argv] = process.argv.slice(2);
const args = parseArgs(argv);

main().catch((error) => {
  console.error(`memory-hook: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  if (event === "preflight" || event === "session-start") {
    const output = await runMemory("auto", {
      root: args.root || process.env.AI_MEMORY_ROOT,
      cwd: args.cwd || process.env.AI_MEMORY_CWD || process.cwd(),
      query: args.query || process.env.AI_MEMORY_TASK || process.env.USER_PROMPT || "session start",
      limit: args.limit || process.env.AI_MEMORY_LIMIT || 5,
    });
    process.stdout.write(output);
    return;
  }

  if (event === "checkpoint" || event === "session-end") {
    const cwd = args.cwd || process.env.AI_MEMORY_CWD || process.cwd();
    const root = args.root || process.env.AI_MEMORY_ROOT;
    const query = args.query || process.env.AI_MEMORY_TASK || "handoff checkpoint";
    const preflight = await runMemory("auto", { root, cwd, query, limit: 1 });
    const project = projectFromPreflight(preflight);

    if (!project) {
      throw new Error("could not detect project alias from memory preflight");
    }

    const summary = args.summary || process.env.AI_MEMORY_SUMMARY;
    if (!summary) {
      process.stdout.write(`${preflight}\nNo checkpoint written: missing --summary or AI_MEMORY_SUMMARY.\n`);
      return;
    }

    const checkpoint = await runMemory("checkpoint", {
      root,
      project,
      summary,
      pending: args.pending || process.env.AI_MEMORY_PENDING,
      files: args.files || process.env.AI_MEMORY_FILES,
    });
    process.stdout.write(checkpoint);
    return;
  }

  throw new Error(`unknown hook event "${event}"`);
}

function runMemory(command, values) {
  const commandArgs = [memoryScript, command];

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") continue;
    commandArgs.push(`--${key}`, String(value));
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, commandArgs, {
      cwd: values.cwd ? path.resolve(String(values.cwd)) : process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
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
        reject(new Error((stderr || stdout || `memory command failed with code ${code}`).trim()));
      }
    });
  });
}

function projectFromPreflight(output) {
  const match = String(output).match(/^project:\s*(.+)$/m);
  return match ? match[1].trim() : "";
}

function parseArgs(tokens) {
  const parsed = {};

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;

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
