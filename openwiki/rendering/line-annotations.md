---
type: feature
title: Line Highlights and Line Numbering
description: The lineHighlights spec grammar parsed tolerantly by parseLineHighlights, and the CSS-counter gutter with custom starting offsets plus the indigo cbp-highlighted accent styling.
tags: [line-numbers, highlights, css-counters, parsing]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T15:26:20.939Z
sources:
  - id: openwiki-source-21241928b5c940111ba88b2f
    resource: repo://src/astro/CodeBlockPro.astro
  - id: openwiki-source-de7713ea142a86f0ca60e7ec
    resource: repo://src/utils/parseLineHighlights.ts
generated: { by: "claude-code", at: "2026-11-13T15:26:20.939Z" }
---

# Line Highlights and Line Numbering

Two of the block's editor fields — `lineHighlights` (e.g. `1,3-5`) and `lineNumbers` with `startingLineNumber` — drive a small parser and a CSS-counter gutter that together annotate the rendered code without adding per-line markup by hand.

## The spec grammar (`parseLineHighlights`)

`src/utils/parseLineHighlights.ts#L1-L23` parses the free-text `lineHighlights` field into a `Set<number>` of **1-indexed** line numbers:

- **Singles and ranges**: comma-separated parts; a part containing `-` is a `start-end` range expanded inclusively, otherwise it's a single number.
- **Whitespace tolerance**: each part is trimmed; ` 1 , 3 - 5 ` parses like `1,3-5`.
- **Deduplication**: the `Set` collapses duplicates and overlapping ranges (`1-5,3,4` → 1–5).
- **Graceful ignoring** — nothing throws:
  - empty/whitespace-only input (or a falsy spec) returns an empty set (the optional chaining `spec?.trim()` makes a nullish call safe);
  - non-numeric parts (`abc`) are dropped;
  - malformed ranges (`a-b`) are dropped;
  - reversed ranges (`5-3`, `end < start`) are dropped entirely rather than clamped.

`src/__tests__/parseLineHighlights.test.ts` pins all of these behaviors, including a large `1-100` range and dedup cases.

## Consuming the set

<!-- openwiki: broken internal link [/openwiki/rendering/code-block-pipeline.md] link "/openwiki/rendering/code-block-pipeline.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`CodeBlockPro.astro` calls `parseLineHighlights(lineHighlights)` during its frontmatter pipeline. If the set is non-empty, it counts `<span class="line"` occurrences in the Shiki output (line 1 is the first match) and rewrites matching ones to `class="line cbp-highlighted"` — see [Code Block Rendering Pipeline](/openwiki/rendering/code-block-pipeline.md). So highlight indices refer to **physical output lines**, with the single trailing newline already stripped before highlighting.

## The numbered gutter (CSS counters)

Line numbers are rendered by CSS counters rather than injected text (`src/astro/CodeBlockPro.astro#L417-L441`):

- `.cbp-body.cbp-has-line-numbers … pre code` sets `counter-reset: cbp-line`;
- each `.line` sets `counter-increment: cbp-line` and `position: relative` with extra left padding;
- each `.line::before` renders `content: counter(cbp-line)` as the gutter cell — right-aligned, `user-select: none` (with `-webkit-`), `pointer-events: none`, and `speak: never`, so the gutter is decorative and never selected or copied.

**Custom starting offset**: the component computes `startNumber = parseInt(startingLineNumber ?? "1", 10) || 1` and, when line numbers are on and `startNumber !== 1`, injects `counter-reset: cbp-line ${startNumber - 1}` onto the `<code>` tag's inline style. Seeding the reset to `startNumber - 1` makes the first line display `startNumber` (e.g. seed 9 → first line reads 10) without touching per-line markup.

## Highlight styling

`.line.cbp-highlighted` (`src/astro/CodeBlockPro.astro#L444-L447`) gets a soft indigo backdrop `rgba(99, 102, 241, 0.08)` plus `box-shadow: inset 4px 0 0 0 #6366f1` — a solid 4px left accent bar drawn as an inset shadow. Hover on any line adds a faint background glow and lifts gutter opacity, the plugin's subtle micro-interaction layer.

<!-- openwiki: broken internal link [/openwiki/testing.md] link "/openwiki/testing.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
The gutter and highlight styles live in the component's global stylesheet and are covered by container render tests asserting the exact number of `cbp-highlighted` occurrences (see [Test Suites and Harness](/openwiki/testing.md)).
