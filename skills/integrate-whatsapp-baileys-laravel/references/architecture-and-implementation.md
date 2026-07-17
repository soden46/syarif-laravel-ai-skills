# Architecture And Implementation Reference

## Contents

1. Source policy
2. Package and runtime selection
3. Service contract
4. Session and socket lifecycle
5. Auth-state storage
6. Security baseline
7. Laravel integration
8. Delivery semantics
9. Testing matrix

## 1. Source policy

Use current primary sources when implementing or upgrading:

- [Baileys introduction](https://baileys.wiki/docs/intro/)
- [Socket configuration](https://baileys.wiki/docs/socket/configuration/)
- [Connecting and auth lifecycle](https://baileys.wiki/docs/socket/connecting/)
- [DisconnectReason API](https://baileys.wiki/docs/api/enumerations/DisconnectReason/)
- [Official WhiskeySockets/Baileys repository](https://github.com/WhiskeySockets/Baileys)
- official package metadata linked by the repository or current documentation

Do not use blog snippets, abandoned forks, or remembered APIs as the source of truth. Record the package, exact installed version, Node requirement, and relevant migration guide in the project documentation.

## 2. Package and runtime selection

Baileys package names and major-version APIs have changed. Inspect the official package tags and migration guidance at execution time.

Apply these rules:

- Prefer a maintained, non-prerelease release compatible with the target Node LTS.
- Do not install a Git branch, release candidate, or edge build unless the user accepts that risk.
- If maintaining an existing integration, preserve its major line unless an upgrade is in scope.
- Derive imports and socket configuration from the selected major version. Do not mix examples from different majors.
- Pin an exact version in the sidecar package manifest and commit its lockfile.
- Use the package manager already selected by the repository. Do not create competing lockfiles.
- Check the selected package's `engines` field and official docs; document an exact supported Node LTS for local and VPS use.

Avoid fetching and forcing the newest WhatsApp Web protocol version on every connection unless the selected Baileys version explicitly requires it. Current official guidance favors compatible defaults because an independently fetched latest protocol can be incompatible with the installed library.

## 3. Service contract

Prefer a small versioned internal API. Adapt naming to existing project conventions.

| Operation | Suggested endpoint | Safe to retry automatically | Notes |
| --- | --- | --- | --- |
| Liveness | `GET /health` | Yes | Process only; do not claim WhatsApp readiness. |
| Session status | `GET /v1/session` | Yes, bounded | Return sanitized state and timestamps. |
| Connect | `POST /v1/session/connect` | Only when idempotent | Start one connection attempt; return current state. |
| Disconnect | `DELETE /v1/session` | Only when idempotent | Deliberate logout; clear auth only by explicit contract. |
| Send text | `POST /v1/messages` | No, unless idempotent | Validate recipient and body; return provider message ID when available. |

Use a stable response envelope if the project has one. Suggested connection states are `disconnected`, `connecting`, `pairing`, `connected`, `reconnecting`, and `error`.

Return QR or pairing data only through authenticated Laravel admin flows. Give it a short lifetime and clear it after connection, logout, or expiry. Never include it in health endpoints or logs.

## 4. Session and socket lifecycle

Maintain one serialized connection lifecycle per configured session:

- guard against concurrent connect calls;
- remove old listeners and dispose of an obsolete socket before replacing it;
- persist credentials on every `creds.update`;
- create a new socket when the selected major signals restart-required;
- stop reconnecting after deliberate logout or a logged-out response;
- treat connection replacement, bad session, forbidden access, and multi-device mismatch as operator-visible states;
- retry transient closure, loss, timeout, and temporary unavailability with capped exponential backoff and jitter;
- reset retry counters after a stable open connection;
- handle `SIGINT` and `SIGTERM`, stop accepting requests, close the HTTP server, and close the socket cleanly.

Do not create unbounded recursive reconnect calls. Do not start multiple sidecar replicas for one file-backed session.

Set `markOnlineOnConnect: false` when supported and appropriate so linking the sidecar does not unnecessarily suppress phone notifications. Disable full history sync unless the requested feature needs it. If messages must be resent or poll votes decrypted, implement the selected major's required message store and `getMessage` behavior.

## 5. Auth-state storage

Authentication state contains credentials and Signal keys. Treat it as a secret with account-level impact.

### Local development

The built-in multi-file helper may be used for local development or a disposable demo:

- store it outside public directories;
- resolve the path relative to the sidecar, not the caller's working directory;
- ignore it in Git and deployment artifacts;
- restrict access to the service account;
- make explicit whether disconnect deletes local auth.

### Production

Official Baileys guidance warns against the multi-file helper in production because of its I/O and storage characteristics. Prefer a project-owned SQL, NoSQL, or Redis-backed auth implementation that correctly persists credentials and key updates.

If the user explicitly chooses file-backed auth for a low-volume, single-account, single-instance VPS, document this as an accepted limitation. Require persistent disk, one process, restrictive permissions, encrypted backup if backups are needed, restore testing, and no horizontal replicas. Never silently describe that profile as production-grade.

## 6. Security baseline

Require all of the following:

- bind the sidecar to `127.0.0.1` by default;
- use a long random internal token from environment configuration;
- compare tokens without leaking timing information when practical;
- reject missing or malformed authorization before reading business payloads;
- cap JSON body size and validate content type;
- validate E.164-like digits without `+` before building a JID;
- bound message length and reject unsupported message types;
- disable framework fingerprint headers;
- apply Laravel authorization, CSRF, and rate limits to admin/session operations;
- redact tokens, QR/pairing data, auth state, full message bodies, and personal data from logs and errors;
- keep the sidecar port closed at the firewall and absent from public Nginx/Apache proxy rules;
- run as an unprivileged OS user with least filesystem access;
- run dependency audit commands and report unresolved advisories without making unsupported security claims.

Add TLS or network-level identity when Laravel and the sidecar cannot share a host or private trust boundary. A bearer token over a public plaintext network is insufficient.

## 7. Laravel integration

Use a focused client/service to own:

- base URL and token configuration;
- connect and request timeouts;
- endpoint and payload mapping;
- response parsing into stable application data;
- provider error translation;
- sanitized structured logging.

Read environment variables only through cached configuration. A typical key set includes enabled flag, base URL, token, connection timeout, and request timeout. Use project naming conventions and never overwrite existing user values.

Do not add an interface automatically. Add one when the application supports multiple WhatsApp drivers, configuration selects a provider, or domain code needs a stable provider-neutral contract.

Keep session-management routes behind existing admin authorization. Validate message input at the boundary. Return consistent application errors rather than raw Node stack traces.

## 8. Delivery semantics

Message sending is an external side effect. An HTTP timeout does not prove the provider did not send the message.

- Do not use generic automatic HTTP retry on send requests.
- For best-effort messages, attempt once and log a sanitized outcome.
- For important notifications, dispatch an after-commit Laravel job with explicit tries, backoff, timeout, and failure handling.
- Pass record IDs or small scalars to jobs and reload state in `handle()`.
- Add a persistent outbound record or idempotency key when duplicate delivery is unacceptable.
- Make the sidecar return the prior result for a repeated idempotency key if it owns idempotency.
- Separate permanent validation/provider rejection from transient network or service failures.
- Never claim exactly-once delivery without a durable protocol that actually provides it.

## 9. Testing matrix

### Node sidecar

Test environment validation, token rejection, request schemas, phone normalization, body limits, state transitions, reconnect classification, concurrent connect calls, deliberate logout, error redaction, and graceful shutdown. Mock the socket boundary; do not require a real WhatsApp account in automated tests.

### Laravel

Use `Http::fake()` to test successful status/send responses, timeouts, connection failures, 401/422/409/5xx translation, and safe logs. Add feature tests for allowed and denied admin access, validation, CSRF behavior where applicable, and response shape. Use `Queue::fake()` or `Bus::fake()` for dispatch and test meaningful job behavior directly.

### Manual smoke check

Verify liveness separately from WhatsApp readiness. When a test account is available, observe pairing, open, send, transient reconnect, process restart with persisted auth, deliberate disconnect, and the need to re-pair after logout.
