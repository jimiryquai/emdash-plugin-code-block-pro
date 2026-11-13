---
type: engine
title: Shiki Highlighting Engine
description: How highlighter.ts runs Shiki on the pure-JavaScript regex engine for Cloudflare Workers compatibility — a cached singleton highlighter, preloaded languages, on-demand theme loading through a static import map, and layered fallbacks.
tags: [shiki, highlighting, workers, edge, themes]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T15:26:20.939Z
sources:
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-a2d5568b3954a4931370c48c
    resource: repo://src/__tests__/admin.test.tsx
  - id: openwiki-source-ce293371f1279f96f1b95d30
    resource: repo://src/utils/highlighter.ts
generated: { by: "claude-code", at: "2026-11-13T15:26:20.939Z" }
---

# Shiki Highlighting Engine

`src/utils/highlighter.ts` is the only place the plugin touches Shiki. It exists to answer one constraint: the plugin must render server-side **on edge runtimes like Cloudflare Workers**, where `WebAssembly.instantiate()` is prohibited — and Shiki's default Oniguruma engine requires WASM. The fix is `@shikijs/engine-javascript` (a peer dependency, `^4.0.0` alongside `shiki ^4.0.0`): `createJavaScriptRegexEngine()` performs tokenization with pure-JavaScript regexes, no WASM anywhere.

## The cached singleton

`getHighlighter()` (`src/utils/highlighter.ts#L46-L58`) memoizes a single `Promise<Highlighter>` in the module-level `highlighterPromise`:

```ts
highlighterPromise = createHighlighter({
  themes: ["github-dark"],      // baseline theme
  langs: [...LANGUAGE_VALUES],  // all 14 catalog languages
  engine: createJavaScriptRegexEngine(),
});
```

<!-- openwiki: broken internal link [/openwiki/architecture/block-schema.md] link "/openwiki/architecture/block-schema.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- **All languages preload upfront.** `LANGUAGE_VALUES` comes from the catalog (`src/constants.ts`, see [Block Schema](/openwiki/architecture/block-schema.md)), so first render pays the cost once and every later block — any language in the catalog — hits the warm highlighter.
- **Only `github-dark` preloads as a theme**; the other 23 load lazily (below), keeping unused themes out of the initial cost.
- The promise (not the instance) is cached, so concurrent first renders share one initialization instead of racing.

## `highlightCode(code, lang, theme)`

The rendering pipeline's single entry point (`src/utils/highlighter.ts#L61-L99`) walks a fallback ladder:

1. **Language** — if `lang` isn't `"text"` and isn't loaded yet, `highlighter.loadLanguage(lang)` runs on demand; if it throws (language unavailable), `lang` silently degrades to `"text"`.
2. **Theme** — if the theme isn't loaded, it resolves through `THEME_MAP[theme]`, a static record of **dynamic `import()` thunks** (`src/utils/highlighter.ts#L12-L41`) whose keys are exactly the 24 `THEMES` values from `constants.ts`. The static map is what lets Vite see and bundle each theme as its own chunk — a bare `loadTheme(themeName)` string can't be statically analyzed. If the map misses, it still tries `loadTheme(theme)` by name. On any failure it logs `[code-block-pro] Failed to load theme "<theme>":` and falls back to `github-dark`.
3. **Render** — `highlighter.codeToHtml(code, { lang: lang || "text", theme: theme || "github-dark" })`.

<!-- openwiki: broken internal link [/openwiki/rendering/code-block-pipeline.md] link "/openwiki/rendering/code-block-pipeline.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
The net contract for callers (only `CodeBlockPro.astro`): a highlighted HTML string for any catalog language/theme, with unknown inputs degrading to plain text on the default theme rather than throwing. The component additionally wraps this in its own try/catch with an escaped plain-`<pre>` fallback ([Code Block Rendering Pipeline](/openwiki/rendering/code-block-pipeline.md)).

## Maintenance invariants

- **`THEME_MAP` keys must stay in lockstep with `THEMES` values.** The map's header comment states each key matches a value from `constants.ts`; a theme added to the catalog without a map entry loses its Vite-chunked loading (it still works via the by-name fallback, but bundles less predictably).
- **Preloading is a deliberate tradeoff**: all 14 languages initialize on first use — simpler and faster per-request at steady state, at the cost of a heavier cold start and bundle. The tests pin the theme count (24) and language count (≥10) so catalog drift is caught.

## Why it matters for packaging

<!-- openwiki: broken internal link [/openwiki/operations/packaging-and-release.md] link "/openwiki/operations/packaging-and-release.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Because Shiki and the JS engine are peer dependencies, the host site controls their versions (`^4.0.0`); the plugin never bundles a tokenizer itself. Combined with server-only rendering, nothing highlighting-related ships to the browser — the client payload is one small delegated click handler (see [Packaging, Publishing, and CI](/openwiki/operations/packaging-and-release.md)).
