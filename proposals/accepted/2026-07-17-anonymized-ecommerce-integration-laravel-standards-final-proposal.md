# Final Laravel Standards Proposal

Source: `docs/standards-proposal.md`
Target repository: `syarif-laravel-standards`
Date: 2026-07-17

## Classification Summary

| Classification | Rules |
| --- | --- |
| NEW | Companion services behind Laravel proxies; idempotent environment-gated seeders; generated dependency/runtime state hygiene. |
| UPDATE | Evidence-first extraction format; integration service checklist; webhook idempotency; structured logs; integration runbooks; admin query shape; scheduled command safety. |
| DUPLICATE | HTTP/filesystem fakes; transactions and locks; upload fake-backed tests. |
| CONFLICT | Promoting complex inline controller validation as a global standard. |
| PROJECT_ONLY | Provider names, status maps, message copy, XAMPP/domain docs, local ports, QR flow, project-specific setup checklist. |
| REJECT | Provider-specific payload fields, customer copy, exact companion service library, generated dependency folders, runtime auth sessions. |

## Proposed Skill Updates

### `laravel:extract-laravel-standards`

Add a per-rule checklist so multiple project audits can be merged safely:

```markdown
For each proposed standard, record:

- rule name;
- category;
- source project evidence;
- tests or quality checks proving it;
- sanitized generic example;
- conflicts with existing standards;
- project-only exclusions;
- classification: NEW, UPDATE, DUPLICATE, CONFLICT, PROJECT_ONLY, or REJECT;
- recommendation: accept, revise, or reject.
```

### `laravel:actions-and-services`

Add:

```markdown
Integration services should own provider-specific request mapping, authentication, signing, timeout/retry behavior, response parsing, error translation, status mapping, safe structured logs, and fake-driven tests. Keep provider payload quirks and customer-facing copy out of global standards.
```

### `laravel:security`

Add:

```markdown
Public webhooks must be authenticated through provider signatures, shared secrets, IP rules, or equivalent verification. Webhook handlers should be idempotent: repeated provider notifications must acknowledge success without duplicating database writes, histories, notifications, or other side effects.
```

Add:

```markdown
Companion services should not be exposed directly to browsers or the public internet by default. Put browser/admin access behind Laravel auth/authorization and forward server-to-server calls with an internal token, local/private network binding, explicit timeouts, and tests that assert the proxy sends expected authentication headers.
```

Add:

```markdown
Generated dependency folders, local service state, auth sessions, and service `.env` files must be ignored and must not be promoted into reusable standards or example repositories. Add checks for nested `node_modules`, service auth folders, and runtime state before handoff.
```

### `laravel:exception-handling-and-logging`

Add:

```markdown
For payment-like, provider-driven, or multi-step workflows, use structured logs with stable correlation identifiers such as record ID, public reference, provider request ID, status before/after, and safe host/status summaries. Mask or omit tokens, signatures, passwords, full provider payloads, card data, and unnecessary PII.
```

### `laravel:documentation-best-practices`

Add an integration runbook template:

```markdown
# Setup <Integration>

## Architecture
## Required Environment
## Local Verification
## Production Verification
## Security Notes
## Troubleshooting
## Relevant Files
```

Global docs should stay generic. Project docs may include exact local commands, domains, dashboard paths, and deployment notes.

### `laravel:migrations-and-factories`

Add:

```markdown
Seeders intended for repeated local/dev use must be idempotent. Use `firstOrCreate`, `updateOrCreate`, stable keys, or explicit existence checks. Gate demo data to local/development environments and test that rerunning seeders does not duplicate records or overwrite edited admin/user data.
```

### `laravel:performance-select-columns`

Add:

```markdown
For admin index pages, select only columns rendered by the table, filters, or actions. For detail pages, eager load named relations with explicit relation columns when the page displays child rows or histories.
```

### `laravel:task-scheduling`

Add:

```markdown
Scheduled commands that mutate records or send external side effects should include a dry-run mode when practical, guard local-only simulation commands by environment, and use `withoutOverlapping()` for recurring jobs that must not run concurrently.
```

## Do Not Promote

- Do not standardize provider-specific status names, payload fields, endpoint paths, or signature header names.
- Do not standardize customer message copy or product/business claims.
- Do not standardize one Node library, process manager, local port, or QR connection flow.
- Do not promote complex inline controller validation as the default. Keep `laravel:form-requests` as the global rule for complex validation.
- Do not use generated dependency folders or runtime auth/session files as reusable skill evidence.

## Follow-Up Before Applying Globally

- Add one more project as evidence before creating a dedicated `laravel:companion-services` skill.
- Add command tests before making scheduled command dry-run guidance mandatory.
- Clean nested generated dependency files from this source project before treating repository hygiene as proven by the repo state.
