# Candidate B Production Freeze

Freeze date: 2026-08-13

## Production Routing

Semantic production name:
`family_gated_sparse_routing`

Frozen source Candidate B policy:
`candidate_b_family_gated_support_compat`

Historical policy49 / sparse V4 label:
`flat_v4`

Production default was changed in
`skills/using-laravel-standards/SKILL.md` to family-gated sparse routing.
Historical benchmark names were preserved.

## Frozen Source Hashes

Source directory:
`D:\ai-skill-eval-real-project\routing-calibration-v2`

Candidate B config SHA256:
`a94cfdf9a3290f0a6a63c4a578d96e2d7e4dfe89b7c9f019831354bb62ae978b`

Candidate B implementation SHA256:
`d419a8ea19009b37f223a3564b5b61007f2ff4df279e12c35c6e7ea07c5a1686`

Both hashes were recomputed before production edits and again by
`scripts/validate-production-routing-policy.mjs`.

## Production File Hashes

`skills/using-laravel-standards/SKILL.md`
`36e4d0b3a9dbd4490ab3e41dfdab64ca9cbbabf310ca3a664ddfae50de456488`

`skills/using-laravel-standards/references/family-gated-sparse-routing.md`
`08c8c40a262329324e21e8cb6589c623f2fc6b92cf2366a812c4817834b0f5a5`

`skills/using-laravel-standards/references/family-gated-sparse-routing.json`
`41be90f92ef644a37b6042c9b10c5f8952842132551e86d43b6a7761147ab120`

`skills/using-laravel-standards/references/v4-activation-enforcer.md`
`c8b5d314e8ca65f01a1b0b053c7f4524a2053c762629dcaf06941a60e6838acd`

`scripts/validate-production-routing-policy.mjs`
`508f2c3c4773e1d728de1e63f899a18abb51557a84c2a37482aa3d57762a088b`

`docs/CANDIDATE_B_PROMOTION_REPORT.md`
`3c984046cb842ee3976dc4271a0a1f0cf437279b193960dd47c53bc9a478aa50`

## Validation

Passed:

- `node scripts/validate-production-routing-policy.mjs`
- `node --check scripts/validate-production-routing-policy.mjs`
- `git diff --check`
- `npm run sync`
- `node scripts/validate-skills.mjs --memory-flow-only`
- `npx skills add . --list`

Repository-wide validation status:

- `npm run validate` failed because the repo currently has 142 tracked files,
  exceeding the `codex-marketplace.com` 128-file scan-limit guard.
- This is a package-level guard and was not changed as part of the routing
  promotion.

## Regression Coverage

`scripts/validate-production-routing-policy.mjs` checks:

- A: obvious primary-only routing;
- B: compatible support routing;
- C: generic/self-contained suppression;
- D: weak support signal suppression;
- E: meta/infrastructure primary suppression;
- F: `memory-management` outside specialist slot count;
- G: invalid router signal fallback to mode 0;
- H: hard cap with many competing domains.

All non-invalid cases are compared against the frozen Candidate B
implementation from `routing-calibration-v2`.

## No Tuning

No benchmark cases, assertions, judges, specialist bodies, calibration suites,
heldout suites, token-efficiency results, Candidate B config, or Candidate B
implementation were modified.
