#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const memoryScript = path.join(__dirname, "memory.mjs");
const protocolVersion = "2025-06-18";

const tools = [
  {
    name: "memory_auto",
    description: "Run automatic long-term memory preflight for the current project before broad code exploration.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: { type: "string", description: "Project root or working directory. Defaults to the MCP server cwd." },
        query: { type: "string", description: "Task intent or search query for relevant memory." },
        limit: { type: "number", description: "Maximum memory snippets to return.", default: 5 },
        root: { type: "string", description: "Optional memory root. Defaults to AI_MEMORY_ROOT or ~/.ai-memory." },
      },
    },
  },
  {
    name: "memory_recall",
    description: "Recall focused memory for a project, query, scope, or tag-like intent.",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string" },
        query: { type: "string" },
        scope: { type: "string", enum: ["conversation", "project", "user", "workflow", "global"] },
        limit: { type: "number", default: 5 },
        root: { type: "string" },
      },
    },
  },
  {
    name: "memory_remember",
    description: "Store a safe durable memory entry with provenance. Rejects likely secrets and raw personal data.",
    inputSchema: {
      type: "object",
      required: ["scope", "type", "title", "content"],
      properties: {
        scope: { type: "string", enum: ["conversation", "project", "user", "workflow", "global"] },
        type: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
        project: { type: "string" },
        source: { type: "string" },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
        tags: { type: "string", description: "Comma-separated tags." },
        root: { type: "string" },
      },
    },
  },
  {
    name: "memory_checkpoint",
    description: "Save current project task state, touched files, pending work, and handoff summary.",
    inputSchema: {
      type: "object",
      required: ["project", "summary"],
      properties: {
        project: { type: "string" },
        summary: { type: "string" },
        pending: { type: "string" },
        files: { type: "string", description: "Comma-separated touched files." },
        root: { type: "string" },
      },
    },
  },
  {
    name: "memory_audit",
    description: "Audit stored memory for likely secrets or raw personal data.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string" },
      },
    },
  },
  {
    name: "memory_forget",
    description: "Remove a stored memory entry by memory id.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        root: { type: "string" },
      },
    },
  },
  {
    name: "memory_status",
    description: "Report memory root, markdown file count, and indexed project aliases without dumping all content.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string" },
      },
    },
  },
];

const toolCommands = {
  memory_auto: ["auto", ["root", "cwd", "query", "limit"]],
  memory_recall: ["recall", ["root", "project", "query", "scope", "limit"]],
  memory_remember: ["remember", ["root", "scope", "type", "title", "content", "project", "source", "confidence", "tags"]],
  memory_checkpoint: ["checkpoint", ["root", "project", "summary", "pending", "files"]],
  memory_audit: ["audit", ["root"]],
  memory_forget: ["forget", ["root", "id"]],
  memory_status: ["status", ["root"]],
};

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

rl.on("line", async (line) => {
  if (!line.trim()) return;

  let request;
  try {
    request = JSON.parse(line);
  } catch (error) {
    sendError(null, -32700, `Parse error: ${error.message}`);
    return;
  }

  if (!request.id && String(request.method || "").startsWith("notifications/")) {
    return;
  }

  try {
    await handle(request);
  } catch (error) {
    sendError(request.id ?? null, -32603, error.message);
  }
});

async function handle(request) {
  switch (request.method) {
    case "initialize":
      sendResult(request.id, {
        protocolVersion,
        capabilities: { tools: {} },
        serverInfo: { name: "syarif-memory-management", version: "1.0.0" },
      });
      return;

    case "tools/list":
      sendResult(request.id, { tools });
      return;

    case "tools/call":
      await callTool(request);
      return;

    case "resources/list":
      sendResult(request.id, { resources: [] });
      return;

    case "prompts/list":
      sendResult(request.id, { prompts: [] });
      return;

    case "ping":
      sendResult(request.id, {});
      return;

    default:
      sendError(request.id ?? null, -32601, `Method not found: ${request.method}`);
  }
}

async function callTool(request) {
  const params = request.params || {};
  const name = params.name;
  const args = params.arguments || {};
  const mapping = toolCommands[name];

  if (!mapping) {
    sendError(request.id, -32602, `Unknown tool: ${name}`);
    return;
  }

  const [command, keys] = mapping;
  const output = await runMemory(command, keys, args);
  sendResult(request.id, {
    content: [{ type: "text", text: output.trim() || "OK" }],
  });
}

function runMemory(command, keys, args) {
  const argv = [memoryScript, command];

  for (const key of keys) {
    const value = args[key];
    if (value === undefined || value === null || value === "") continue;
    argv.push(`--${key}`, String(value));
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, argv, {
      cwd: args.cwd ? path.resolve(String(args.cwd)) : process.cwd(),
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

function sendResult(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function sendError(id, code, message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}\n`);
}
