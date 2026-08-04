---
name: memory-management
description: Provide automatic long-term Laravel AI memory preflight, recall, checkpointing, and secure cross-project context across conversation, project, user, workflow, and codebase scopes.
tags:
  - laravel
  - php
---

# Memory Management

Use this skill when a Laravel task needs persistent AI memory that can remember, understand, continue, and adapt across chats, projects, and related feature patterns.

This is an orchestration and active local-memory skill. Treat memory as orientation. The current repository remains the source of truth.

Important capability boundary: a skill is not a daemon by itself. Automatic memory happens when an entrypoint skill, agent instruction, MCP server, MCP hook, or lifecycle hook runs this skill's preflight and checkpoint commands. For always-on background code graph indexing, pair this skill with `codebase-memory-mcp` or another local MCP/watch service.

## Core Principles

- Remember only what remains useful.
- Retrieve only what is relevant.
- Verify before trusting.
- Anonymize before sharing across projects.
- Never persist secrets.
- Preserve provenance for every durable entry.
- Prefer continuity without context overload.

## Active Local Backend

This skill ships a file-backed backend at `scripts/memory.mjs`. Resolve it relative to this `SKILL.md` file and prefer it for active memory commands before falling back to manual Markdown edits.

Default root: `AI_MEMORY_ROOT` when set, otherwise `~/.ai-memory`.

Use the backend like this:

```bash
node <skill-dir>/scripts/memory.mjs auto --cwd <project-root> --query "<task intent>"
node <skill-dir>/scripts/memory.mjs init --project <anonymous-project-id>
node <skill-dir>/scripts/memory.mjs remember --scope project --project <anonymous-project-id> --type convention --title "Use Laravel Actions" --content "Business logic belongs in focused Action classes." --source "repository inspection" --confidence high --tags laravel,actions
node <skill-dir>/scripts/memory.mjs recall --project <anonymous-project-id> --query "approval flow" --limit 5
node <skill-dir>/scripts/memory.mjs checkpoint --project <anonymous-project-id> --summary "Implemented the approval draft flow." --pending "Add rejection-path tests."
node <skill-dir>/scripts/memory.mjs audit
node <skill-dir>/scripts/memory.mjs forget --id <memory-id>
```

Use `auto` at the start of a session. It detects the current project from `--cwd`, Git metadata, `composer.json`, `package.json`, and Laravel markers; creates a stable anonymous project ID; initializes the memory root; updates the index; and returns compact relevant memory.

Use `--content-file`, `--summary-file`, or `--pending-file` for long text. The backend creates the standard `global/`, `conversations/`, `projects/`, `workflows/`, and `index.json` layout, rejects likely secrets or raw personal data, records provenance, and returns memory IDs for future deletion.

Always classify and sanitize content before calling the backend. The script is a guardrail, not permission to store unsafe data.

## MCP And Hook Layer

Use `scripts/mcp-server.mjs` as a local stdio MCP server when the agent host supports MCP configuration:

```json
{
  "mcpServers": {
    "syarif-memory-management": {
      "command": "node",
      "args": ["<skill-dir>/scripts/mcp-server.mjs"],
      "env": {
        "AI_MEMORY_ROOT": "~/.ai-memory"
      }
    }
  }
}
```

The MCP server exposes these tools:

- `memory_auto`: automatic project detection, init, index update, and compact recall.
- `memory_recall`: focused retrieval after preflight.
- `memory_remember`: durable safe memory writes.
- `memory_checkpoint`: handoff state writes.
- `memory_audit`: secret and personal-data audit.
- `memory_forget`: targeted deletion by memory ID.
- `memory_status`: compact backend status.

Use `scripts/memory-hook.mjs` for clients with lifecycle hooks:

```bash
node <skill-dir>/scripts/memory-hook.mjs preflight --cwd <project-root> --query "<task intent>"
node <skill-dir>/scripts/memory-hook.mjs checkpoint --cwd <project-root> --summary "<handoff summary>" --files "app/Actions/Foo.php,tests/Feature/FooTest.php"
```

Hook environment variables:

- `AI_MEMORY_ROOT`: memory root override.
- `AI_MEMORY_CWD`: project root override.
- `AI_MEMORY_TASK`: session task intent for preflight.
- `AI_MEMORY_SUMMARY`: checkpoint summary.
- `AI_MEMORY_PENDING`: checkpoint pending work.
- `AI_MEMORY_FILES`: comma-separated touched files.

Install both layers when possible: MCP gives the agent callable tools during the session; hooks make preflight and checkpoint happen at lifecycle boundaries.

Use `scripts/install-memory-layer.mjs` to generate or install MCP and hook configuration:

```bash
node <skill-dir>/scripts/install-memory-layer.mjs detect
node <skill-dir>/scripts/install-memory-layer.mjs print --target all
node <skill-dir>/scripts/install-memory-layer.mjs install --target codex --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target vscode --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target vscode-workspace --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target cursor --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target cursor-workspace --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target windsurf --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target cline --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target cline-cli --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target roo-workspace --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target continue-workspace --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target claude --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target json --config .mcp.json --apply
node <skill-dir>/scripts/install-memory-layer.mjs install --target hooks --apply
```

Native skill installers generally copy skill files only; they should not silently execute this installer or modify agent MCP configs. Run `install-memory-layer.mjs` explicitly after installing the skill when the user wants active memory enabled.

Installer defaults to dry-run unless `--apply` is present. For VS Code, it writes the official `mcp.json` shape with a top-level `servers` object. Use `vscode` for the user profile config and `vscode-workspace` for `.vscode/mcp.json`. Cursor, Windsurf, Cline, Roo Code, Continue, Claude-compatible, and generic JSON targets use `mcpServers` where their docs expect it. Every JSON install merges only the `syarif-memory-management` server entry and writes a timestamped backup before changing an existing file. For Codex CLI, it uses the local `codex mcp add` command instead of editing Codex config directly.

## Memory Architecture

Route every memory request through these roles:

```text
AI agent
  -> memory-management skill
    -> context router
    -> security and privacy guard
    -> retrieval planner
    -> memory consolidator
    -> memory delegator
      -> conversation memory
      -> project memory
      -> user memory
      -> workflow memory
      -> codebase memory MCP, when available
```

Use `codebase-memory-mcp` or a similar MCP only as codebase intelligence memory. It should answer structural questions about source code, symbols, routes, classes, functions, call chains, dependencies, impact, architecture, and ADR-like facts. Do not use it as conversation memory, user memory, or the only persistent memory system.

Official `DeusData/codebase-memory-mcp` docs describe a local MCP server that indexes repositories into a persistent knowledge graph and supports token-efficient structural code queries. Treat its performance and token-savings claims as vendor or research claims until verified on the current Laravel repository.

## Codebase MCP Integration

When a codebase memory MCP is available:

1. Use it for structural discovery before broad file reads.
2. Ask for architecture, routes, classes, functions, call chains, dependencies, impact, and related symbols.
3. Verify returned symbols and paths against the repository before editing.
4. Prefer targeted source reads after MCP retrieval instead of loading large file sets.
5. Record only stable structural findings in project memory; leave detailed source graphs in the MCP backend.

When it is not available:

1. Do not assume the MCP exists.
2. Use normal repository search and focused file reads.
3. If the user asks to install it, read the current official project documentation first.
4. Audit install scripts before running them when security matters.
5. Confirm where indexes, logs, and generated agent configuration are stored.

Do not send private source code, graph exports, or codebase indexes to external services unless the user explicitly approves that exact destination and scope.

## Memory Scopes

- Conversation memory: extracted intent, facts, constraints, decisions, progress, open questions, and next actions from a chat or task.
- Project memory: durable repository knowledge such as stack, domains, architecture, conventions, decisions, known issues, and current state.
- User memory: explicit and safe user preferences, recurring working style, and coding defaults across projects.
- Workflow memory: reusable patterns abstracted from past work, anonymized before cross-project use.
- Codebase memory: structural source-code graph and symbol intelligence from MCP or local indexing tools.
- Session memory: temporary branch, active task, modified files, pending checks, and handoff state for the current work.

Prefer this layout when initializing file-based memory:

```text
~/.ai-memory/
  global/
    user-profile.md
    coding-preferences.md
    reusable-patterns.md
  conversations/
    <conversation-ref>.md
  projects/
    <anonymous-project-id>/
      overview.md
      architecture.md
      decisions.md
      conventions.md
      known-issues.md
      current-state.md
  workflows/
    <workflow-pattern-id>.md
  index.json
```

## Workflow

1. Run `memory.mjs auto --cwd <project-root> --query "<task intent>"` before broad exploration.
2. Read the compact preflight output and use it as orientation, not as final truth.
3. Classify the request intent, active project, referenced projects, task type, feature tags, and memory scope.
4. Build a retrieval plan before loading additional memory content.
5. Load only memory entries relevant to the detected project, framework, tags, or user-requested feature.
6. Query codebase memory MCP only when the task needs structural code context.
7. Verify important memory against the current codebase before acting on it.
8. Apply the smallest focused Laravel skills needed for the actual task.
9. At handoff, consolidate durable discoveries and discard temporary task chatter.
10. Run `memory.mjs checkpoint`, `remember`, `audit`, or `forget` when the task produces durable state changes.

## Memory Modes

- `memory auto`: run `memory.mjs auto` at session start or skill entrypoint to detect the project, initialize memory, and recall compact relevant context.
- `memory recall`: run `memory.mjs recall` for focused follow-up retrieval after preflight.
- `memory checkpoint`: run `memory.mjs checkpoint` to save current task state, pending work, files touched, decisions, and open questions.
- `memory remember`: run `memory.mjs remember` to store a durable preference, convention, decision, issue, workflow pattern, or current state.
- `memory consolidate`: compact raw or temporary context into durable structured memory.
- `memory adapt`: supersede stale memory after verifying newer repository evidence.
- `memory forget`: run `memory.mjs forget` to remove or redact a specific entry after identifying it clearly.
- `memory audit`: run `memory.mjs audit` to inspect memory for staleness, overbroad entries, missing provenance, sensitive data, and unsafe cross-project sharing.
- `memory delegate`: choose which memory backends to query and how much context to return to the main agent.
- `memory status`: run `memory.mjs status` and report loaded memory files, confidence, and exclusions without dumping all content.

When the user asks to forget something, show the specific entry or file section that will be removed, then remove only that targeted content once the instruction is clear.

## Retrieval Delegation

The main agent should not receive all memory. Build a retrieval plan, then return compact ranked context.

Example retrieval plan:

```yaml
intent: implement_related_feature
active_project: project_f23ab1
referenced_projects:
  - project_8f19c4
required_context:
  user_memory:
    - coding preferences
  active_project_memory:
    - current conventions
    - reimbursement architecture
  referenced_project_memory:
    - approval flow decisions
  workflow_memory:
    - multi-level approval pattern
  codebase_memory:
    - relevant symbols
    - call chains
excluded:
  - unrelated payroll history
  - raw chat transcripts
  - confidential client details
```

Return context like:

```markdown
Relevant context:

- Current project uses Laravel Actions and Policies.
- Existing reimbursement statuses are draft, submitted, approved, and rejected.
- Reusable approval pattern uses configurable sequential approvers.
- Do not directly copy project-specific role names.
- Relevant symbols: ReimbursementRequest, SubmitReimbursementAction, ApprovalFlow.
```

## Context Budget

Set a retrieval budget before loading memory:

```yaml
context_budget:
  total_tokens: 6000
  allocation:
    user_memory: 400
    conversation_memory: 1000
    project_memory: 1200
    workflow_memory: 800
    codebase_context: 2200
    reserve: 400
```

Stop retrieving when marginal relevance is lower than token cost. Too much memory can reduce quality by adding stale, conflicting, or distracting context.

## Retrieval Levels

Use three levels:

1. Memory index: cheap project tags, summaries, framework, and feature hints.
2. Memory summary: relevant decisions, conventions, current state, and workflow summaries.
3. Evidence: decision records, source paths, related conversation checkpoints, code symbols, and exact implementation references.

Open evidence only when the task needs it.

## Truth Priority

Use this priority order when memory conflicts with evidence:

1. Current source code and configuration
2. Verified repository documentation
3. Codebase MCP graph
4. Project memory
5. Conversation memory
6. Workflow memory
7. Observed user memory

Explicit user preferences matter for working style. Technical facts must be verified against the repository.

When repository evidence contradicts memory, follow the repository and mark the old memory `deprecated` or `superseded` instead of silently overwriting history.

## Lifecycle

- Recall before task: identify user, repository, project, checkpoint, relevant memory, and codebase MCP needs.
- Understand during task: separate facts from guesses, connect old decisions to the new request, mark conflicts, and track candidate memory.
- Consolidate after task: remove temporary noise, extract decisions, update progress, update known issues, and create anonymized workflow patterns when reusable.
- Continue on next chat: load the latest checkpoint, verify repository drift, and resume without repeating exploration.
- Adapt when facts change: keep version relationships between old and new memory.

Example supersession:

```yaml
memory_id: mem_framework_version
value: Laravel 12
status: superseded
superseded_by: mem_framework_version_v2

memory_id: mem_framework_version_v2
value: Laravel 13
verified_from: composer.json
status: active
```

## Relevance

Do not load every memory file by default. Match memory through:

- Repository folder name
- Git remote URL
- `composer.json` package metadata
- Explicit project name from the user
- Framework tags such as `laravel`, `livewire`, `nova`, `api`, `queues`, or `horizon`
- Feature tags such as `approval`, `attendance`, `payroll`, `billing`, `imports`, or `notifications`

An `index.json` entry should be small and searchable:

```json
{
  "projects": {
    "project_f23ab1": {
      "repositories": ["repo-folder-name"],
      "frameworks": ["laravel", "livewire"],
      "tags": ["approval", "notifications"],
      "memory_path": "projects/project_f23ab1"
    }
  }
}
```

## Anonymous Linking

Use anonymous, stable references when memory may cross project boundaries:

```text
anonymous_project_id = HMAC-SHA256(local_secret, canonical_project_identity)
```

Use HMAC-based identifiers rather than plain hashes for guessable client or project names. Keep the local secret outside the memory database.

Maintain links without exposing identities:

```text
conversation_291 -> belongs_to -> project_8f19c4
project_8f19c4 -> produced -> workflow_pattern_104
workflow_pattern_104 -> applies_to -> project_f23ab1
```

## Entry Format

Use metadata for durable memory entries:

```markdown
## Use Laravel Actions for business logic

- Type: convention
- Scope: project
- Status: active
- Confidence: high
- Source: repository inspection
- Last verified: YYYY-MM-DD
- Related paths:
  - app/Actions/
  - app/Services/

Business logic should primarily live in focused Action classes. Controllers and Livewire components should stay orchestration layers.
```

Use `Confidence: low` when memory comes from conversation only and has not been verified in the repository.

Classify user memory:

```yaml
type: user_preference
source: explicit
confidence: high
status: active
```

For observed preferences, use `source: repeated_observation`, a confidence value, and `status: provisional` until the user confirms it.

## What To Store

Store durable information that improves future engineering decisions:

- Architecture decisions and their reason
- Repeated project conventions
- Cross-feature implementation patterns
- Known recurring issues and resolved pitfalls
- Current repository state after meaningful work
- User preferences that are safe and broadly useful
- Conversation checkpoints, not raw transcripts
- Workflow patterns abstracted away from client-specific details

Do not store long copied docs, generated diffs, full README contents, noisy command output, temporary failed attempts, or full chat transcripts unless a short extract explains a recurring issue.

## Security Pipeline

Before writing memory, pass data through:

```text
raw input
  -> secret detection
  -> personal-data classification
  -> scope classification
  -> anonymization or pseudonymization
  -> retention policy
  -> encryption at rest
  -> memory storage
```

Minimum controls:

- Prefer local-first storage.
- Encrypt memory at rest when storing outside the repository.
- Keep encryption keys separate from the memory database.
- Never ingest raw `.env` files.
- Redact secrets automatically.
- Isolate projects by default.
- Require explicit policy for cross-project sharing.
- Keep an audit log of memory writes, updates, forgets, and cross-project retrievals.
- Support retention and deletion.
- Preserve provenance and verification dates.

Classify data:

```yaml
public:
  allowed_scopes: [conversation, project, workflow]
internal:
  allowed_scopes: [conversation, project]
confidential:
  allowed_scopes: [project]
  cross_project: false
  anonymization_required: true
secret:
  persist: false
```

Never store secrets or sensitive values:

- API keys
- Passwords
- Database credentials
- SSH private keys
- Access tokens
- Session cookies
- Full `.env` contents
- Production secrets
- Raw emails, phone numbers, or customer personal data

Secrets should be rejected from persistence, not merely anonymized.

For sensitive operational facts, store only a safe reference:

```markdown
Production credentials are managed outside the repository. Do not request or store their values in memory.
```

## Relationship To Project Docs

Keep boundaries clear:

- `README.md`: official human-facing project documentation.
- `docs/`: repository-owned technical documentation.
- `.ai-memory/` or `~/.ai-memory/`: agent working memory across sessions.
- Git history: source of code change history.
- Session memory: temporary context for active work.
- Codebase MCP graph: structural index of current source code.

Do not replace project documentation with memory. When information belongs in official docs, update the docs and store only a short memory pointer.

## Completion

Before handoff:

1. Report which memory scopes, files, or backends were loaded or updated.
2. State whether memory was verified against current repository evidence.
3. Note stale, excluded, or ignored memory.
4. Confirm that no secrets or raw personal data were stored.
5. Report any codebase MCP query used and whether its output was verified.
6. Run the task's normal Laravel verification through the focused skills selected for the actual change.
