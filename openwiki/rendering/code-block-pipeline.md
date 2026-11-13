---
type: pipeline
title: Code Block Rendering Pipeline
description: How CodeBlockPro.astro turns a Portable Text node into finished HTML server-side — Shiki generation with fallback, HTML post-processing, header/copy markup, luminance-based theming, and the delegated clipboard script.
tags: [rendering, astro, server-side, shiki-html, pipeline]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T15:26:20.939Z
sources:
  - id: openwiki-source-21241928b5c940111ba88b2f
    resource: repo://src/astro/CodeBlockPro.astro
generated: { by: "claude-code", at: "2026-11-13T15:26:20.939Z" }
---

# Code Block Rendering Pipeline

<!-- openwiki: broken internal link [/openwiki/architecture/overview.md] link "/openwiki/architecture/overview.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`src/astro/CodeBlockPro.astro` is the site-side renderer for the `code-block-pro` block (registered via `blockComponents`, see [Plugin Architecture Overview](/openwiki/architecture/overview.md)). It receives the raw Portable Text block as `Astro.props.node` and produces fully-styled static HTML — no client framework. Its frontmatter is a deterministic pipeline over the Shiki output.

## 1. Node defaults and input normalization

<!-- openwiki: broken internal link [/openwiki/architecture/block-schema.md] link "/openwiki/architecture/block-schema.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
The `CodeBlockProNode` interface (`src/astro/CodeBlockPro.astro#L15-L28`) mirrors the persisted shape: `_type: "code-block-pro"`, optional `_key`, required `code`, and the optional fields from [Block Schema](/openwiki/architecture/block-schema.md) — with `lineNumbers`/`copyButton` typed `boolean | string` because values may arrive stringified.

Destructuring applies defaults (`src/astro/CodeBlockPro.astro#L29-L41`): `code = ""`, `language = "text"`, `theme = DEFAULT_THEME` (github-dark), `lineNumbers = false`, `copyButton = true`, `lineHighlights = ""`.

Then:

<!-- openwiki: broken internal link [/openwiki/rendering/line-annotations.md] link "/openwiki/rendering/line-annotations.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
- `highlightedLineNumbers = parseLineHighlights(lineHighlights)` — the highlight set (see [Line Highlights and Line Numbering](/openwiki/rendering/line-annotations.md)).
- `trimmedCode = code.replace(/\n$/, "")` — strips one trailing newline so Shiki doesn't emit an empty last line.
- `codeForShiki = trimmedCode || " "` — empty code becomes a single space so Shiki still produces a well-formed `<pre><code>` skeleton.

## 2. Highlighting with a hard fallback

`highlightCode(...)` runs inside a try/catch (`#L48-L56`). On failure the component logs `[code-block-pro] Shiki highlighting failed:` and falls back to a hand-built plain `<pre class="shiki" style="background-color:#24292e;color:#e1e4e8">` containing `escapeHtml(trimmedCode)` — the page still renders readable code with the default theme colors. (`escapeHtml` covers `& < > " '`.)

## 3. Theme extraction and post-processing

Three regex passes over the Shiki HTML (`#L58-L103`):

1. **Extract theme colors** — `background-color:` and a negative-lookbehind `(?<!-)color:` are pulled from the Shiki `<pre>` style into `themeBg`/`themeFg` (defaults `#24292e`/`#e1e4e8`). They become the wrapper's `--cbp-theme-bg`/`--cbp-theme-fg` CSS variables so the whole component (header, buttons, gutter) matches the chosen theme instead of fighting it.
2. **Strip the `<pre>` inline style** — removing it avoids needing `!important` hacks in the stylesheet to restyle Shiki's output.
3. **Inject annotations** —
   - *Line highlights*: every `<span class="line"` occurrence is counted; matching indices get `class="line cbp-highlighted"` (`#L77-L89`).
   - *Starting line number*: when `lineNumbers` is enabled and `startNumber !== 1`, a `counter-reset:cbp-line ${startNumber - 1}` is injected onto the `<code>` tag's style — appended to an existing style or created (`#L91-L104`). `startNumber = parseInt(startingLineNumber ?? "1", 10) || 1`, so malformed text falls back to 1.

## 4. Markup decisions

- `hasFilename`, `hasLineNumbers = lineNumbers === true || lineNumbers === "true"`, `hasCopyButton = copyButton !== false && copyButton !== "false"` — the string-tolerant booleans (`#L105-L107`).
- `langLabel` is the language value unless it's `text` (plain text shows no badge) (`#L110`).
- `showHeader = hasFilename || !!langLabel || hasCopyButton` (`#L113`) — the header row (language badge + filename on the left, copy button on the right) only renders when it has something to show.
- The wrapper `<div class="cbp-wrapper …">` carries `cbp-has-header`, the light/dark class, and the theme CSS variables (`#L149-L152`).
- `maxHeight`, when set, becomes `max-height` on the scroll container `.cbp-scroll` (`#L205-L209`).
- The copy button stores the **trimmed, unhighlighted** code in `data-code` (`#L166`) and swaps between copy/check SVG icons via the `cbp-copied` class.

## 5. Dark/light adaptation (`isThemeDark`)

`isThemeDark(color)` (`#L116-L145`) decides whether UI chrome uses the dark or light variable palette:

- Hex colors (3- or 6-digit) and `rgb()` strings are reduced with the WCAG luminance weights `(r*299 + g*587 + b*114)/1000 < 128`.
- Unknown lengths or unparseable values default to **dark**.
- A few light named colors (`white`, `lightyellow`, `ivory`, `snow`) are special-cased to light; every other name reads as dark.

`isDark = isThemeDark(themeBg)` then selects `cbp-theme-dark` or `cbp-theme-light` on the wrapper; each palette redefines a dozen `--cbp-*` variables (header background, badge/filename/button colors, scrollbar track and thumb). A neutral fallback set lives on `.cbp-wrapper` itself for WCAG-safe defaults.

## 6. Styles and the client script

- The `<style is:global>` block (`#L214` onward) is global because the Shiki HTML is injected via `set:html`, which bypasses Astro's scoped-attribute rewriting — scoping would silently miss the injected markup. All selectors are `.cbp-` prefixed to avoid collisions.
- The `<script>` (`#L495-L514`) is the only client JavaScript: **one delegated `document` click listener** catches every `.cbp-copy-btn`, decodes HTML entities from `data-code` (`&amp; &lt; &gt; &quot; &#39;` — Astro may have encoded the attribute), writes it with `navigator.clipboard.writeText`, and toggles `cbp-copied` for 2 seconds to show the check icon. Delegation means any number of blocks share one handler, added once per page.

## Verification

<!-- openwiki: broken internal link [/openwiki/testing.md] link "/openwiki/testing.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`src/__tests__/components.test.ts` renders this component through `experimental_AstroContainer` and asserts the real HTML: highlight class counts, `--cbp-theme-fg` for plain text, `data-code` trimming, theme switching, wrapper classes, and the starting-line-number style injection (see [Test Suites and Harness](/openwiki/testing.md)).
