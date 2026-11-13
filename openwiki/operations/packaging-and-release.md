---
type: operations
title: Packaging, Publishing, and CI
description: The npm package contract (exports, peer dependencies, files allowlist), the 0.2.0 release discipline, and the five GitHub Actions workflows that gate and publish releases.
tags: [packaging, publishing, ci, github-actions, npm]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T18:42:00.637Z
sources:
  - id: openwiki-source-164e2da859b5277df81c7d94
    resource: repo://.github/workflows/ci.yml
  - id: openwiki-source-2ab88915e37908e92fe8ef01
    resource: repo://.github/workflows/lint.yml
  - id: openwiki-source-f2608d0d515da097485b6ec5
    resource: repo://.github/workflows/publish.yml
  - id: openwiki-source-f511aae758ec5d25a9f8719a
    resource: repo://.github/workflows/security.yml
  - id: openwiki-source-4f2678f93d3fd3835f9f2909
    resource: repo://.github/workflows/test.yml
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
generated: { by: "claude-code", at: "2026-11-13T18:42:00.637Z" }
---

# Packaging, Publishing, and CI

The package is published as `emdash-plugin-code-block-pro` and released through GitHub Actions: three quality gates run on every push/PR to `master`, a weekly audit runs on schedule, and publishing happens on GitHub release via npm trusted publishing (OIDC).

## Package contract (`package.json`)

- **Type/module**: `"type": "module"` — everything is ESM.
- **Exports** (`package.json#L11-L14`): `.` → `./src/index.ts`, `./admin` → `./src/admin.tsx`, `./astro` → `./src/astro/index.ts`. The package ships TypeScript source directly; EmDash's Vite pipeline compiles it inside the consuming site.
- **Peer dependencies** (`package.json#L16-L22`): `emdash ^1.4.0`, `shiki ^4.0.0`, `@shikijs/engine-javascript ^4.0.0`, plus `react`/`@types/react` `^18.0.0`. The heavy rendering stack is the host site's responsibility — installing the plugin means installing its peers too (`npm install emdash-plugin-code-block-pro shiki @shikijs/engine-javascript`).
- **`files` allowlist** (`package.json#L51-L56`): only `src`, `docs`, `README.md`, `LICENSE` ship. Root sandbox configuration, `sandbox.db`, lockfiles, and `vitest.config.ts` stay outside this allowlist. Files under `src`, including `src/live.config.ts` and test sources, remain included.
- **Install build control**: `pnpm.onlyBuiltDependencies` limits postinstall builds to `better-sqlite3` and `esbuild`.

## Versioning discipline (0.2.0)

Current version is 0.2.0. Per the README's release notes, raising the EmDash peer range from `^1.3` to `^1.4.0` is a breaking change, so this pre-1.0 release increments the **minor** version from 0.1.0 to 0.2.0 (a pre-1.0 package treats a minor bump as its breaking-change channel). The 0.2.0 release also brought back Plain Text and Mermaid language choices, fixed foreground-color rendering, added scrollbar styling, and made plugin instances keep independent theme defaults (each `codeBlockProPlugin({ defaultTheme })` instance configures its own field default, including across the native runtime boundary).

## CI gates

All gate workflows run on Node 22, install with `npm ci --legacy-peer-deps`, and trigger on pushes and pull requests to `master`:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push/PR to master | `npx tsc --noEmit` — type check |
| `lint.yml` | push/PR to master | `npx eslint src/` — lint the source tree |
| `test.yml` | push/PR to master | `npx vitest run` — the full suite (see [Test Suites and Harness](../testing.md)) |
| `security.yml` | push to master / PR (any branch) + weekly Monday 06:00 cron | `npm i --package-lock-only` then `npm audit --audit-level=high --omit=dev` — production dependency audit |
| `publish.yml` | GitHub release published | publishes to npm (below) |

## Publishing (`publish.yml`)

Publishing is triggered by a **published GitHub release**, not by pushes. The job checks out, sets up Node 22 with the npm registry, then:

1. `npm install -g npm@11.21.1` — the workflow's own comment explains why: trusted publishing (OIDC) needs npm ≥ 11.5.1, and Node 22 bundles npm 10, which never attempts the OIDC login and gets a 404 from the registry (commit `7507a9e` "ci: install npm 11 so trusted publishing can authenticate").
2. `npm publish --provenance --access public` — publishes with provenance attestation.

The job's permissions are the trusted-publishing minimum: `contents: read`, `id-token: write`. No `NODE_AUTH_TOKEN` secret is involved; the OIDC identity itself authenticates.

## Local equivalents

The same checks run locally: `npm test` (Vitest), plus `npx tsc --noEmit` and `npx eslint src/` matching the CI jobs. The sandbox scripts are separate (see [Development Sandbox](dev-sandbox.md)).
