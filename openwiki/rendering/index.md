# Files

- [Code Block Rendering Pipeline](code-block-pipeline.md) - How CodeBlockPro.astro turns a Portable Text node into finished HTML server-side — Shiki generation with fallback, HTML post-processing, header/copy markup, luminance-based theming, and the delegated clipboard script.
- [Line Highlights and Line Numbering](line-annotations.md) - The lineHighlights spec grammar parsed tolerantly by parseLineHighlights, and the CSS-counter gutter with custom starting offsets plus the indigo cbp-highlighted accent styling.
- [Shiki Highlighting Engine](shiki-highlighting.md) - How highlighter.ts runs Shiki on the pure-JavaScript regex engine for Cloudflare Workers compatibility — a cached singleton highlighter, preloaded languages, on-demand theme loading through a static import map, and layered fallbacks.
