# Deployment And Documentation Reference

## Contents

1. Deployment profiles
2. Local Windows documentation
3. Linux VPS documentation
4. Operations and upgrades
5. Required project document
6. Documentation quality gate

## 1. Deployment profiles

Generate commands from the target repository instead of copying generic paths blindly.

### Local Windows

Assume PowerShell, not Bash. Detect whether the project uses XAMPP, Herd, Laragon, Docker/Sail, or host PHP. Use Windows path syntax and PowerShell commands such as `Copy-Item`, `$env:NAME`, and `Invoke-RestMethod` where appropriate.

Manual sidecar startup is the default for development. PM2 or Task Scheduler may be documented as optional if the Windows machine must keep the process alive; do not present a login-triggered task as equivalent to a server service.

### Linux VPS

Use the actual distribution and project path when known. If unspecified, label Ubuntu/Debian as an assumption. Prefer the process manager already used by the project. A systemd unit is a strong default for a single Node sidecar; PM2 is acceptable when already standardized.

Run the sidecar as an unprivileged user. Keep Laravel, its queue worker, and the sidecar operationally distinct so each can restart and expose status independently.

## 2. Local Windows documentation

The generated setup document must provide exact PowerShell steps for:

1. opening the project root;
2. checking PHP, Composer, Node, and package-manager versions;
3. installing root and sidecar dependencies with the existing lockfiles;
4. copying example environment files without overwriting an existing `.env`;
5. generating a strong internal token locally;
6. setting matching Laravel and sidecar configuration without showing a real token;
7. creating and protecting the development auth directory;
8. clearing Laravel configuration cache;
9. starting Laravel, queue worker when required, frontend tooling when required, and the sidecar in separate terminals;
10. calling health and authenticated status endpoints through Laravel or loopback;
11. pairing by QR or code through the authorized application flow;
12. sending a test message only when a test account and recipient are available;
13. stopping and restarting the service to verify session persistence;
14. deliberately logging out and explaining that pairing will then be required again.

Use commands that exist in the finished project, such as real package scripts or Artisan commands. Do not invent `npm run baileys:start` unless that script was actually added.

## 3. Linux VPS documentation

The generated setup document must provide exact commands and configuration for:

1. supported PHP and Node LTS installation or verification;
2. deployment path and service user;
3. dependency installation from lockfiles with production-appropriate flags;
4. Laravel and sidecar environment values;
5. persistent auth-state storage and restrictive ownership/permissions;
6. Laravel cache commands and queue worker implications;
7. a systemd unit or PM2 configuration using an absolute working directory;
8. boot persistence, restart policy, graceful stop timeout, logs, status, restart, and rollback commands;
9. loopback binding and firewall verification;
10. confirmation that no public Nginx/Apache location proxies to the sidecar;
11. health/status checks from the VPS;
12. pairing through the authenticated Laravel application over HTTPS;
13. log rotation and disk-use considerations;
14. encrypted backup and restore policy for auth state when applicable.

For systemd, include `After=network-online.target`, `Wants=network-online.target`, an unprivileged `User`, absolute `WorkingDirectory`, an explicit start command, restart limits, and environment loading appropriate to the target. Do not embed secrets directly in the unit file.

For PM2, include a committed ecosystem file only if that matches project conventions. Document `pm2 startup` output as host-specific; do not fabricate its generated `sudo` command.

Do not open the sidecar port in UFW, cloud security groups, Nginx, Apache, or a hosting panel when Laravel and the sidecar share a host.

## 4. Operations and upgrades

Document routine operations with the real service name:

- show status and sanitized logs;
- restart after configuration changes;
- deploy dependency changes from the lockfile;
- restart queue workers when Laravel job code changes;
- verify health, session state, and a controlled send after deployment;
- preserve auth state during ordinary deploys;
- rotate the internal token on both sides in one maintenance window;
- back up and restore auth state only through the chosen storage strategy;
- deliberately disconnect and purge auth state when decommissioning;
- roll back the sidecar package and code together with its lockfile.

Before upgrading Baileys, read the official migration guide for every crossed major. Test pairing and reconnect with a non-critical account. Never upgrade a production auth schema blindly.

## 5. Required project document

Create or update `docs/BAILEYS_SETUP.md`, unless the project already has one canonical WhatsApp setup document. Write it in the project's documentation language; if unclear, use the user's language. Make every value project-specific except secrets.

Use this outline:

```markdown
# Baileys WhatsApp Setup

> Unofficial-library and account-risk notice.

## Architecture
## Implemented Scope
## File Inventory
## Prerequisites And Supported Versions
## Environment Variables
### Laravel
### Baileys Sidecar
## Local Windows Setup
### Install
### Configure
### Run
### Pair
### Verify
## Linux VPS Setup
### Install And Permissions
### Configure
### Process Manager
### Firewall And Reverse Proxy
### Pair And Verify
## Queue And Scheduled Work
## Session Storage, Backup, And Logout
## Daily Operations
## Upgrade And Rollback
## Troubleshooting
## Security Checklist
## Verification Record
```

The environment-variable section must explain ownership, default, required status, and whether each value is secret. Show placeholders such as `GENERATE_A_LONG_RANDOM_TOKEN`; never copy the active `.env`.

The file inventory must list only files that exist after implementation. The verification record must list commands actually run and distinguish automated tests, loopback smoke checks, and real-account checks.

Troubleshooting must cover at least:

- sidecar process offline;
- internal 401 due to token mismatch;
- Laravel config cache using stale values;
- sidecar port already in use;
- QR or pairing code absent/expired;
- restart-required reconnect;
- logged-out or replaced session;
- permission failure for auth storage;
- Laravel timeout with uncertain send outcome;
- queue worker not running;
- WhatsApp protocol or Baileys upgrade breakage.

## 6. Documentation quality gate

Before handoff, verify the document against the finished code:

- every path, command, script, route, environment key, service name, and port exists or is clearly labeled as an example;
- Windows commands run in PowerShell and Linux commands run in the documented shell;
- local and VPS instructions use compatible package and Node versions;
- no real secrets, session data, QR codes, phone numbers, usernames, domains, or private infrastructure values appear;
- no instruction exposes the sidecar publicly;
- production auth storage matches the implemented strategy and honestly states limitations;
- process-manager commands include start, stop, restart, status, logs, and boot behavior;
- verification claims match checks that were actually performed;
- the unofficial nature of Baileys and risk of protocol changes/account restrictions are explicit.

Treat this document as part of the integration's acceptance criteria, not an optional afterthought.
