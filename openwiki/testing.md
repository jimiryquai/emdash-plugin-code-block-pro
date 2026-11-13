---
type: testing
title: Test Suites and Harness
description: The Vitest harness (Astro Vite pipeline with mocked virtual:emdash modules) and what each of the six suites verifies — from real Astro container renders of the component to descriptor shape, parser grammar, and catalog invariants.
tags: [testing, vitest, astro-container, harness]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T15:26:20.939Z
sources:
  - id: openwiki-source-a2d5568b3954a4931370c48c
    resource: repo://src/__tests__/admin.test.tsx
  - id: openwiki-source-9d3a612fc5f743486919ec77
    resource: repo://src/__tests__/components.test.ts
  - id: openwiki-source-b6d59eb12721acd5a3486d49
    resource: repo://src/__tests__/dependency.test.ts
  - id: openwiki-source-d474650f1d10b56a6061539c
    resource: repo://src/__tests__/descriptor.test.ts
  - id: openwiki-source-9fb7c2f8d111412fa9932a39
    resource: repo://src/__tests__/exports.test.ts
  - id: openwiki-source-49ca47283ee4798d462bf2ed
    resource: repo://src/__tests__/parseLineHighlights.test.ts
  - id: openwiki-source-fbadcd8591b65031efaaedce
    resource: repo://vitest.config.ts
generated: { by: "claude-code", at: "2026-11-13T15:26:20.939Z" }
---

# Test Suites and Harness

<!-- openwiki: broken internal link [/openwiki/operations/packaging-and-release.md] link "/openwiki/operations/packaging-and-release.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`npm test` runs `vitest run` (mirrored by `test.yml` in CI, see [Packaging, Publishing, and CI](/openwiki/operations/packaging-and-release.md)). Six suites under `src/__tests__/` cover every module — the distinctive one renders the real Astro component rather than mocking it.

## The harness (`vitest.config.ts`)

`vitest.config.ts#L1-L31` builds on Astro's own Vite pipeline:

- `getViteConfig` from `astro/config` — this is what lets a test file `import CodeBlockPro from "../astro/CodeBlockPro.astro"` and get a compiled component (with a `.astro` module declaration in `src/astro.d.ts` for TypeScript).
- A **`mock-virtual-emdash` Vite plugin** stubs EmDash's virtual modules so plugin/host imports resolve without a live EmDash install: any `virtual:emdash/*` id is resolved to a `\0`-prefixed virtual module, and `virtual:emdash/config` returns a minimal i18n config (`defaultLocale: 'en'`), while `/seed` and `/dialect` return `null`.
- Test selection: `include: ["src/**/*.test.{ts,tsx}"]`; `testTimeout: 30_000` (Shiki initialization is slow on first run); `globals: true`.

## Suite by suite

### `components.test.ts` — real rendering (the core suite)

Renders `CodeBlockPro.astro` through `experimental_AstroContainer` (`beforeAll` creates the container once) and asserts on actual HTML output (`src/__tests__/components.test.ts#L1-L213`). Coverage includes:

- Shiki-highlighted output (`class="shiki"`, colored spans) and the **plain-text foreground fix** — `--cbp-theme-fg: #e1e4e8` rather than the background color;
- exactly two `cbp-highlighted` occurrences for a `2-3` spec (class-count precision);
- filename header with language badge, copy button by default and hidden when `copyButton: false`;
- `cbp-has-line-numbers` class on/off with the toggle;
- custom theme respected; output wrapped in `.cbp-wrapper`; empty code handled;
- `data-code="hello\nworld"` proving the trailing newline is stripped from the copy payload;
<!-- openwiki: broken internal link [/openwiki/rendering/line-annotations.md] link "/openwiki/rendering/line-annotations.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- `style="counter-reset:cbp-line 9"` for `startingLineNumber: 10` — pinning the start-minus-one seeding (see [Line Highlights and Line Numbering](/openwiki/rendering/line-annotations.md)).

### `descriptor.test.ts` — plugin contract

<!-- openwiki: broken internal link [/openwiki/architecture/block-schema.md] link "/openwiki/architecture/block-schema.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Asserts the descriptor and native runtime shapes (`src/__tests__/descriptor.test.ts#L1-L116`): `portableTextBlocks` present; `format: "native"`, version `0.2.0`, `entrypoint`, and `componentsEntry` values; `createPlugin()`'s runtime `admin.portableTextBlocks` deep-equal to the descriptor's; **options threading and instance isolation** — a plugin created with `defaultTheme: "nord"` yields `initial_value: "nord"` in both its descriptor and its runtime, while a fresh instance still defaults to `github-dark`; and each of the nine fields with its editor type, exactly nine in total (see [Block Schema](/openwiki/architecture/block-schema.md)).

### `parseLineHighlights.test.ts` — grammar edge cases

Pins the parser's full contract (`src/__tests__/parseLineHighlights.test.ts#L1-L83`): empty/whitespace input, singles, lists, ranges, mixed, whitespace tolerance, `4-4`, reversed `5-3`, non-numeric parts, malformed ranges, dedup, overlapping ranges, a `1-100` range, and nullish input defensiveness.

### Smoke suites

- `admin.test.tsx` — `CodeBlockProData` accepts full, partial, and empty objects; catalog invariants: `LANGUAGES` ≥ 10, `THEMES` exactly 24 with key entries present, defaults valid, `LANGUAGE_VALUES`/`THEME_VALUES` mirror their sources, all options have non-empty label and value.
- `exports.test.ts` — `blockComponents` has exactly one key, `code-block-pro`, mapped to a defined component.
<!-- openwiki: broken internal link [/openwiki/operations/dev-sandbox.md] link "/openwiki/operations/dev-sandbox.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- `dependency.test.ts` — dynamically imports `emdash/runtime` to prove it resolves and exports `emdashLoader` and `getDb` (functions), catching load-time breakage in the host dependency the sandbox relies on ([Development Sandbox](/openwiki/operations/dev-sandbox.md)).

## What the suite deliberately does not do

No browser/E2E tests: the copy-button click handler and hover interactions are untested (the delegated listener is verified only by inspection), and there is no test against a real EmDash install — that's the sandbox's job. The mocked `virtual:emdash` modules mean tests validate the plugin in isolation, with `dependency.test.ts` as the only live-dependency probe.
