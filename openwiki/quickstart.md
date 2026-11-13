---
type: quickstart
title: Code Block Pro Plugin Quickstart
description: Orientation and task-routing map for emdash-plugin-code-block-pro — a native EmDash 1.4+ Portable Text code block rendered server-side with Shiki on a WASM-free JavaScript engine.
tags: [quickstart, navigation, overview]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T18:42:00.637Z
sources:
  - id: openwiki-source-c50574f22a4c0741148fc769
    resource: repo://astro.config.mjs
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-9d3a612fc5f743486919ec77
    resource: repo://src/__tests__/components.test.ts
  - id: openwiki-source-d1fbef09192ffbab6eff0bc2
    resource: repo://src/index.ts
  - id: openwiki-source-ce293371f1279f96f1b95d30
    resource: repo://src/utils/highlighter.ts
generated: { by: "claude-code", at: "2026-11-13T18:42:00.637Z" }
---

# Code Block Pro Plugin Quickstart

This repository is `emdash-plugin-code-block-pro` — a **native EmDash 1.4+ plugin** that adds a professional code block to the Portable Text editor and renders it to static HTML with Shiki. Highlighting runs on `@shikijs/engine-javascript` (pure-JS regex engine, no WebAssembly), so it works on Cloudflare Workers and other edge runtimes; nothing but a tiny copy-button script ships to the browser.

The plugin integrates on two sides:

- **CMS side** — the site's `astro.config.mjs` registers `codeBlockProPlugin(options)` in the EmDash integration's `plugins` array; that descriptor supplies the block definition EmDash's admin and virtual-module runtime consume.
- **Site side** — EmDash loads `blockComponents` from the descriptor's `componentsEntry` (`emdash-plugin-code-block-pro/astro`) and merges them into its Portable Text renderer.

## Where to go for a task

| If you're working on… | Read |
|-----------------------|------|
| Understanding the plugin contract, entrypoints, or the editor→Portable Text→HTML data flow | [Plugin Architecture Overview](architecture/overview.md) |
| The block's editor fields, defaults, `defaultTheme` option, or the language/theme catalog | [Block Schema and Editor Fields](architecture/block-schema.md) |
| The renderer: Shiki HTML post-processing, header/copy markup, dark/light theming | [Code Block Rendering Pipeline](rendering/code-block-pipeline.md) |
| Themes, language loading, the JS regex engine, or Workers compatibility | [Shiki Highlighting Engine](rendering/shiki-highlighting.md) |
| Line numbers, starting offsets, or the `1,3-5` highlight spec | [Line Highlights and Line Numbering](rendering/line-annotations.md) |
| Running the plugin locally against the sandbox database | [Development Sandbox](operations/dev-sandbox.md) |
| The npm package, peer ranges, releases, or the GitHub Actions workflows | [Packaging, Publishing, and CI](operations/packaging-and-release.md) |
| The Vitest harness or any test suite | [Test Suites and Harness](testing.md) |

## Fast paths

- **Run it locally**: `npm run sandbox:init` then `npm run sandbox:dev` (Astro dev server on port 4323 with the plugin registered from source).
- **Run the tests**: `npm test` — the component suite renders the real Astro component in a container.
- **Use it in a site**: `npm install emdash-plugin-code-block-pro shiki @shikijs/engine-javascript`, add `codeBlockProPlugin({ defaultTheme: "one-dark-pro" })` to the EmDash integration, and render content with `<PortableText value={value} />` (full snippets in `README.md`).

Source map: `src/index.ts` (descriptor/runtime) · `src/admin.tsx` (data type) · `src/constants.ts` (catalog) · `src/astro/` (renderer) · `src/utils/` (highlighter, line parsing) · `src/__tests__/` (suites).
