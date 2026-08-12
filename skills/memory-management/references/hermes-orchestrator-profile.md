# Hermes-Style Memory Orchestrator Profile

Use this reference when a task asks for Hermes-like long-term memory, on-demand skills, provider fallback, task delegation, context compression, external memory providers, or one backend across many agent interfaces.

## Capability Boundary

The `memory-management` skill defines the portable policy, safe memory workflow, MCP tools, lifecycle hooks, and installable config snippets. It does not switch providers, compress context, spawn subagents, run an API server, or bridge messaging clients by itself.

When the host supports those features, map this policy to the host configuration. When the host does not support them, keep the policy as memory/checkpoint context and clearly say which part must be handled by the runtime.

The current workspace remains the source of truth. Retrieved memory and compressed summaries are orientation, never proof.

## Core Model

- Memory stores facts, preferences, decisions, durable context, checkpoints, and lessons.
- Skills store procedures for doing work and must be loaded with progressive disclosure.
- The local file-backed memory backend stays active as the built-in provider.
- External memory providers are optional and additive, not replacements for local safety checks.
- Provider fallback, task delegation, and auxiliary models are orchestration features owned by the active host.
- Secrets, raw `.env` values, credentials, private keys, raw personal data, client records, and database dumps must never be stored or synced.

## Cross-Session Memory

Keep built-in local memory available across sessions through `AI_MEMORY_ROOT` or `~/.ai-memory`. Store durable entries by scope:

- `global`: safe user preferences and reusable coding defaults.
- `project`: anonymized repository conventions, architecture decisions, known issues, and current state.
- `conversation`: compact handoff summaries, decisions, pending work, and touched files.
- `workflow`: reusable patterns abstracted from previous tasks.
- `codebase`: structural knowledge from local indexing or codebase MCP tools, verified against files before use.

For long-running work, use anonymous project aliases instead of private project, client, or product names in shared memory. Store provenance so stale or disputed entries can be corrected.

External provider adapters should follow this rule:

1. Keep local built-in memory active.
2. Sync only sanitized, user-approved, non-secret summaries.
3. Record provider name, sync timestamp, source scope, and deletion path.
4. Support at most one active external provider unless the host explicitly supports multi-provider memory routing.

Provider names that may be mapped by a capable host include `honcho`, `openviking`, `mem0`, `hindsight`, `holographic`, `retaindb`, `byterover`, and `supermemory`.

## Skills On Demand

Use progressive disclosure:

1. Start from the skill index, names, descriptions, and aliases.
2. Open only the focused `SKILL.md` files needed for the current task.
3. Open directly linked references only when the selected skill says they apply.
4. Do not load a large skill catalog into the prompt just to "be safe."
5. Memory preflight may suggest relevant skills, but it must not inject full skill bodies.

This keeps memory as context and skills as procedures.

## Provider Failover Policy

Store fallback policy as non-secret routing metadata:

- Primary provider and model label.
- Ordered fallback provider/model labels.
- Failure classes that should trigger failover: rate limit, server error, auth failure, connection failure, missing model, or invalid response.
- Whether conversation context and tool state should be preserved by the host.
- Whether automatic fallback can create API cost.

Do not store API keys, OAuth tokens, refresh tokens, endpoint credentials, organization IDs, billing details, or private base URLs unless the user explicitly approves that exact non-secret value.

If the active host supports fallback, configure it in the host. If it does not, checkpoint the desired fallback chain and tell the user that switching remains manual for that host.

## Delegation Policy

Use the main agent as orchestrator and assign subagents only focused work:

- `architecture_review`: review architecture, coupling, risks, and missing tests.
- `light_research`: summarize docs, changelogs, or web-extracted material.
- `coding_worker`: implement focused patches and run bounded checks.
- `test_worker`: run targeted tests, inspect failures, and report exact evidence.

Pass explicit task context to each worker. Do not assume delegated workers have the full parent conversation. Limit tools per worker when the host supports tool allowlists. Capture each worker's final summary, changed files, commands, risks, and pending work in the parent context.

For portability, declare each worker's provider, model, toolset, and fallback policy explicitly. Some hosts may inherit the parent fallback chain by default; explicit worker policy keeps behavior readable across Hermes, ACP clients, VS Code agents, and other editors.

## Context Compression

Compression is a lossy handoff layer. It should preserve:

- Current goal and constraints.
- Decisions and reasons.
- Files touched and commands run.
- Test and validation status.
- Open risks and pending work.
- Memory IDs or provenance for durable facts.

Compression should omit:

- Secrets and raw credential material.
- Raw logs when a compact error summary is enough.
- Large code blocks already present in the workspace.
- Unverified claims that can be checked cheaply.

If the host supports auxiliary providers, route compression to a cheaper or smaller model. Do not let compression summaries overwrite source-of-truth files or durable memory entries without verification.

## Provider-Agnostic Routing

Keep orchestration portable:

- Use provider IDs, model labels, and capability tags instead of vendor-specific assumptions.
- Keep OpenAI-compatible endpoint settings separate from credentials.
- Record which capabilities a host provides: MCP, ACP, file tools, terminal tools, browser tools, delegation, fallback, API server, messaging gateway, vision, and compression.
- Prefer local or workspace-scoped memory for private code. Use external providers only after explicit approval and sanitization.

## One Backend Across Interfaces

Point every interface at the same memory root and project detector when possible:

- CLI agents.
- VS Code ACP clients and native MCP-capable extensions.
- Antigravity and VS Code-family editors.
- OpenAI-compatible local API frontends.
- Messaging gateways such as Telegram, Discord, Slack, WhatsApp, Signal, or Teams.
- Programmatic Python or automation clients.

Record the interface name in checkpoint metadata when it affects paths, terminal behavior, approval flow, or tool availability.

## Extensibility Guardrails

Before adding MCP servers, plugins, custom tools, cron tasks, local models, API services, or messaging bridges:

1. Identify the exact files, directories, commands, network endpoints, and data scopes exposed.
2. Prefer read-only access until write access is needed.
3. Add tool allowlists for delegated workers where supported.
4. Keep generated indexes, logs, and caches out of public commits unless explicitly intended.
5. Run `memory.mjs audit` after changing memory sync, provider, or checkpoint behavior.

## Portable Orchestrator Policy Example

Use `install-memory-layer.mjs install --target orchestrator-profile --apply` to write this non-secret profile to the memory root. Replace placeholder model labels in a private host config, not in shared docs.

```yaml
memory_orchestrator:
  built_in_memory: always_on
  memory_root: "~/.ai-memory"
  external_memory_provider:
    mode: optional_additive
    active: null
    allowed: [honcho, openviking, mem0, hindsight, holographic, retaindb, byterover, supermemory]
  skills:
    loading: progressive_disclosure
    memory_is_facts_and_context: true
    skills_are_procedures: true
    memory_counts_as_specialist_slot: false
  lifecycle:
    memory_preflight: conditional_before_broad_exploration
    preflight_skip_is_success: true
    checkpoint: durable_reusable_knowledge_only
    unavailable_memory: continue_without_failure
  provider_policy:
    primary: { provider: openai-codex, model: "<primary-model>" }
    fallback_providers:
      - { provider: openai-api, model: "<fallback-mini-model>" }
      - { provider: anthropic, model: "<claude-review-model>" }
      - { provider: gemini, model: "<gemini-light-model>" }
      - { provider: openrouter, model: "<openrouter-coding-model>" }
    failover_triggers: [rate_limit, server_error, auth_failure, connection_error, invalid_response]
  delegation:
    default_context: explicit_task_context_only
    workers:
      architecture_review: { provider: anthropic, model: "<claude-review-model>", tools: [read_file, search] }
      light_research: { provider: gemini, model: "<gemini-light-model>", tools: [web_extract, summarize] }
      coding_worker: { provider: openai-codex, model: "<primary-model>", tools: [read_file, patch, terminal] }
  auxiliary:
    compression: { provider: openai-api, model: "<cheap-compression-model>" }
    vision: { provider: auto, model: null }
    web_extract: { provider: gemini, model: "<gemini-light-model>" }
  interfaces: [cli, vscode_acp, openai_compatible_api, messaging_gateway, python]
  guardrails:
    store_secrets: false
    store_raw_env: false
    store_raw_personal_data: false
    external_sync_requires_user_approval: true
```

## Hermes Mapping

When running under Hermes, map this policy to Hermes capabilities:

- Built-in memory plus optional external provider: use `hermes memory setup`, `hermes memory status`, and `memory.provider` in Hermes config.
- Skills on demand: use Hermes skill index and `skill_view` progressive disclosure rather than preloading all skills.
- Provider fallback: use Hermes fallback configuration for top-level `fallback_providers`.
- Delegation: use `delegate_task` and configure `delegation.provider`, `delegation.model`, concurrency, and spawn depth when different worker routing is needed.
- Compression, vision, web extraction, Skills Hub, and other helper work: use Hermes auxiliary provider settings.
- VS Code ACP: run Hermes as an ACP server so the editor shares Hermes config, credentials, memory, skills, and state.
- API frontends: use Hermes OpenAI-compatible API only with an explicit local API key and intended tool scope.
- Messaging: keep gateway sessions tied to the same sanitized memory root and approval policy.

Source notes checked on 2026-08-05: Hermes Memory Providers, Skills System, Fallback Providers, Provider Integrations, Subagent Delegation, Configuration, ACP Host Integration, API Server, and Messaging Gateway docs.

## Agent Workflow

1. Run conditional `memory_auto` before broad work only when prior context may materially affect correctness.
2. If the task mentions long-lived projects, Hermes-like orchestration, failover, delegation, compression, external memory, ACP, or many interfaces, read this reference.
3. Load only the skills needed for the current task.
4. Build a compact retrieval, provider, delegation, and compression plan.
5. Apply host-supported orchestration features; checkpoint unsupported desired policy.
6. Run focused validation and `memory.mjs audit` after memory or provider changes.
7. Write `memory_checkpoint` with durable decisions, touched files, validation, pending work, and any host capability gaps.
