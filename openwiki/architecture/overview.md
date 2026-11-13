---
type: architecture
title: Plugin Architecture Overview
description: The three package surfaces of this native EmDash plugin, the descriptor/runtime contract with EmDash 1.4+, and the end-to-end data flow from editor fields to server-rendered HTML.
tags: [architecture, plugin, emdash, data-flow, native]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T15:26:20.939Z
sources:
  - id: openwiki-source-da3b52500d3e96a34f633c4c
    resource: repo://docs/plans/fix-frontend-rendering.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-696abbcb2bd05db0f4a44b47
    resource: repo://src/astro/index.ts
  - id: openwiki-source-d1fbef09192ffbab6eff0bc2
    resource: repo://src/index.ts
generated: { by: "claude-code", at: "2026-11-13T15:26:20.939Z" }
---

# Plugin Architecture Overview

`emdash-plugin-code-block-pro` is a **native** EmDash CMS plugin: it supplies both the admin-side Portable Text block definition and the site-side Astro rendering component through a single package. It targets EmDash 1.4+ (`peerDependencies: emdash ^1.4.0`) and renders entirely on the server — no framework runtime ships to the browser.

The repository is intentionally small: one descriptor module, one constants catalog, one admin type, one Astro component, and two utilities, wrapped in a local dev sandbox.

## Package surfaces

The package exports three entrypoints (`package.json#L11-L14`):

| Export | File | Consumed by |
|--------|------|-------------|
| `.` | `src/index.ts` | Site's `astro.config.mjs` — `codeBlockProPlugin()` descriptor and `createPlugin()` runtime |
| `./admin` | `src/admin.tsx` | EmDash admin bundle — `CodeBlockProData` type |
| `./astro` | `src/astro/index.ts` | EmDash's Portable Text renderer — `blockComponents` |

## The native plugin contract

`codeBlockProPlugin(options)` (`src/index.ts#L38-L47`) returns a `PluginDescriptor` describing a native plugin:

- `id: "code-block-pro"`, `format: "native"`, `version` read from `package.json`;
- `entrypoint: "emdash-plugin-code-block-pro"` — the package root EmDash's virtual-module generator imports at runtime;
- `componentsEntry: "emdash-plugin-code-block-pro/astro"` — where EmDash loads `blockComponents` for Portable Text rendering;
<!-- openwiki: broken internal link [/openwiki/architecture/block-schema.md] link "/openwiki/architecture/block-schema.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- `portableTextBlocks: [createBlockType(options)]` — the block definition (see [Block Schema and Editor Fields](/openwiki/architecture/block-schema.md)).

`createPlugin(options)` (`src/index.ts#L51-L61`) exists for that runtime path: EmDash's virtual module generator does `import { createPlugin } from "<entrypoint>"; createPlugin({})`, so `createPlugin` must return a **resolved plugin** (not a descriptor) — it calls EmDash's `definePlugin({ id, version, admin: { portableTextBlocks } })`. Because both functions call the same `createBlockType(options)`, the descriptor and the runtime expose identical block definitions, and each plugin instance keeps its `defaultTheme` default independent (the 0.2.0 release notes call this out explicitly).

## End-to-end data flow

The traced pipeline (documented in `docs/plans/fix-frontend-rendering.md#L16-L25` while debugging an earlier rendering bug):

1. **Admin editor** — the Block Kit form captures the nine fields keyed by `action_id`, producing `values = { code, language, theme, filename, lineNumbers, lineHighlights, copyButton, maxHeight }`.
2. **ProseMirror storage** — admin stores plugin blocks as `pluginBlock` nodes with `{ blockType, id, data }` attrs, where `data` holds those keys.
3. **Portable Text conversion** — `pmToPortableText()` in `InlinePortableTextEditor.tsx` / `PortableTextEditor.tsx` spreads `data` back to top-level keys: `{ _type: "code-block-pro", _key, code, language, ... }`. The plugin's `CodeBlockProNode` interface in `CodeBlockPro.astro` matches this shape — keys at the top level, matching `CodeBlockProData`.
<!-- openwiki: broken internal link [/openwiki/rendering/code-block-pipeline.md] link "/openwiki/rendering/code-block-pipeline.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
4. **Site rendering** — EmDash merges the `componentsEntry`'s `blockComponents` (`src/astro/index.ts#L1-L6`, a one-key map from `"code-block-pro"` to the Astro component) into its Portable Text renderer; `astro-portabletext` passes the raw block as the `node` prop to `CodeBlockPro.astro`, which renders it server-side (see [Code Block Rendering Pipeline](/openwiki/rendering/code-block-pipeline.md)).

A site using `emdash/ui`'s `<PortableText>` gets the merge automatically; a site using `astro-portabletext` directly registers `components={{ type: blockComponents }}` itself (both patterns shown in `README.md`).

## Where the behavior lives

<!-- openwiki: broken internal link [/openwiki/rendering/shiki-highlighting.md] link "/openwiki/rendering/shiki-highlighting.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- **Highlighting** — `src/utils/highlighter.ts` runs Shiki on the pure-JavaScript regex engine so the plugin works on Cloudflare Workers ([Shiki Highlighting Engine](/openwiki/rendering/shiki-highlighting.md)).
<!-- openwiki: broken internal link [/openwiki/rendering/line-annotations.md] link "/openwiki/rendering/line-annotations.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- **Line features** — `src/utils/parseLineHighlights.ts` plus CSS-counter markup in the component ([Line Highlights and Line Numbering](/openwiki/rendering/line-annotations.md)).
- **Catalog** — `src/constants.ts` feeds fields, highlighter preloading, and tests.
<!-- openwiki: broken internal link [/openwiki/operations/dev-sandbox.md] link "/openwiki/operations/dev-sandbox.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/testing.md] link "/openwiki/testing.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- **Local verification** — a root sandbox (`astro.config.mjs`, `sandbox.db`) and a Vitest suite that renders the real Astro component ([Development Sandbox](/openwiki/operations/dev-sandbox.md), [Test Suites and Harness](/openwiki/testing.md)).
<!-- openwiki: broken internal link [/openwiki/operations/packaging-and-release.md] link "/openwiki/operations/packaging-and-release.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- **Release** — npm package contract and GitHub Actions gates ([Packaging, Publishing, and CI](/openwiki/operations/packaging-and-release.md)).
