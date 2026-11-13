---
type: schema
title: Block Schema and Editor Fields
description: The single code-block-pro Portable Text block definition — nine editor fields with defaults, the CodeBlockProData shape, and the shared language/theme catalog in constants.ts.
tags: [schema, editor, portable-text, fields, constants]
verified:
  - by: openwiki/0.9.0
    at: 2026-11-13T18:42:00.637Z
sources:
  - id: openwiki-source-b43ae8dcef91edce2e97fcc3
    resource: repo://src/admin.tsx
  - id: openwiki-source-dda9830742b9d312e36561cf
    resource: repo://src/constants.ts
  - id: openwiki-source-d1fbef09192ffbab6eff0bc2
    resource: repo://src/index.ts
generated: { by: "claude-code", at: "2026-11-13T18:42:00.637Z" }
---

# Block Schema and Editor Fields

The plugin registers exactly one Portable Text block type, `code-block-pro`. Its editor form, the data shape persisted into Portable Text, and the language/theme catalog it draws from are defined in three small modules that act as one contract:

- `src/index.ts` — `createBlockType()` builds the `PortableTextBlockConfig` handed to EmDash.
- `src/constants.ts` — the single source of truth for languages, themes, and defaults.
- `src/admin.tsx` — `CodeBlockProData`, the TypeScript view of the data the editor stores.

## The block definition (`createBlockType`)

`createBlockType(options)` in `src/index.ts#L11-L28` returns the block config used both by the build-time descriptor and the native runtime (see [Plugin Architecture Overview](overview.md)):

```ts
{
  type: "code-block-pro",
  label: "Code Block Pro",
  icon: "code",
  placeholder: "Paste or type code…",
  fields: [ /* nine fields */ ],
}
```

The nine fields, keyed by `action_id`, are what the admin Block Kit form captures and what later lands as top-level keys on the rendered Portable Text node:

| # | Field | Editor type | Default | Purpose |
|---|-------|-------------|---------|---------|
| 1 | `code` | `text_input`, multiline | — | The source code itself |
| 2 | `language` | `select` (from `LANGUAGES`) | `javascript` (`DEFAULT_LANGUAGE`) | Syntax language; `text` and `mermaid` are plain-text choices |
| 3 | `theme` | `select` (from `THEMES`) | `options.defaultTheme` or `github-dark` (`DEFAULT_THEME`) | Shiki theme applied at render time |
| 4 | `filename` | `text_input` | — | Optional filename shown in the header |
| 5 | `lineNumbers` | `toggle` | `false` | Show the numbered gutter |
| 6 | `startingLineNumber` | `text_input` | 1 (label says "default: 1") | Offset for the gutter counter |
| 7 | `lineHighlights` | `text_input` | — | Spec like `1,3-5` (see [Line Highlights and Line Numbering](../rendering/line-annotations.md)) |
| 8 | `copyButton` | `toggle` | `true` | Show the copy-to-clipboard button |
| 9 | `maxHeight` | `text_input` | — | Max height (e.g. `400px`) for the scroll container |

The only plugin-level option is `defaultTheme?: string` (`CodeBlockProOptions`, `src/index.ts#L6-L8`). It flows solely into the `theme` field's `initial_value` (`options.defaultTheme || DEFAULT_THEME`), so each plugin instance keeps its own theme default — including when EmDash builds the native runtime — while a block's saved `theme` always wins at render time.

EmDash 1.4 declares `portableTextBlocks` on the descriptor; this plugin always supplies the array (`src/index.ts#L31-L33`), and both `codeBlockProPlugin()` and `createPlugin()` build it by calling the same `createBlockType(options)` (`src/index.ts#L44`, `src/index.ts#L58`), guaranteeing the build-time descriptor and the runtime admin see identical field sets.

## Stored data shape (`CodeBlockProData`)

`src/admin.tsx` (the `./admin` package export) declares `CodeBlockProData`, the optional-field shape of a saved block. Every field is optional:

```ts
interface CodeBlockProData {
  code?: string;
  language?: string;
  theme?: string;
  filename?: string;
  lineNumbers?: boolean;
  startingLineNumber?: string;  // string, matching the text_input field
  lineHighlights?: string;
  copyButton?: boolean;
  maxHeight?: string;
}
```

Note the string-typed `startingLineNumber`, `lineHighlights`, and `maxHeight`: the editor persists free-text values, and the renderer tolerates missing or loosely typed values (booleans may also arrive as strings) — see [Code Block Rendering Pipeline](../rendering/code-block-pipeline.md).

## The catalog (`constants.ts`)

`src/constants.ts` is the deliberately single source of truth for languages and themes; `index.ts`, `admin.tsx`, and `highlighter.ts` all import from it (stated in the file header, `src/constants.ts#L1-L4`).

- **`LANGUAGES`** (`src/constants.ts#L6-L21`) — 14 `{ label, value }` pairs: JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, JSON, Bash, SQL, Markdown, YAML, Plain Text (`text`), and Mermaid Diagram (`mermaid`). Plain text and Mermaid render as unhighlighted source; Mermaid is deliberately *not* rendered to a diagram server-side.
- **`THEMES`** (`src/constants.ts#L23-L49`) — 24 `{ label, value }` Shiki themes (GitHub Dark/Light, Dracula, Nord, One Dark Pro, Solarized Dark/Light, Monokai, Synthwave '84, Tokyo Night, Night Owl, the three Rosé Pine variants, Ayu Dark, Light/Dark Plus, four Material Theme variants, Poimandres, Vitesse Dark/Light).
- **Defaults** — `DEFAULT_THEME = "github-dark"` (`src/constants.ts#L52`) and `DEFAULT_LANGUAGE = "javascript"` (`src/constants.ts#L55`). The highlighter also falls back to `github-dark` when a theme fails to load.
- **Derived lists** — `LANGUAGE_VALUES = LANGUAGES.map(l => l.value)` and `THEME_VALUES = THEMES.map(t => t.value)` (`src/constants.ts#L56-L60`). `LANGUAGE_VALUES` is what the Shiki highlighter preloads (see [Shiki Highlighting Engine](../rendering/shiki-highlighting.md)); tests assert the catalog invariants (24 themes, presence of key entries, defaults valid).
