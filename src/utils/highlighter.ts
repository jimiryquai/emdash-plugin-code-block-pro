import { createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";

// Supported themes (must be pre-loaded for the JS engine)
const THEMES = [
  "github-dark",
  "github-light",
  "dracula",
  "nord",
  "one-dark-pro",
] as const;

// Common languages for the JS engine
const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "json",
  "html",
  "css",
  "bash",
  "shell",
  "sql",
  "yaml",
  "markdown",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "text",
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Get a cached Shiki highlighter instance using the JavaScript regex engine.
 *
 * The JS engine avoids WebAssembly.instantiate(), which is disallowed in
 * Cloudflare Workers (workerd). Oniguruma (the default) requires WASM.
 */
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...THEMES],
      langs: [...LANGUAGES],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

/**
 * Highlight code to HTML using the JS regex engine (no WASM).
 */
export async function highlightCode(
  code: string,
  lang: string,
  theme: string,
): Promise<string> {
  const highlighter = await getHighlighter();

  // Load language on demand if not pre-loaded
  if (
    lang !== "text" &&
    !highlighter.getLoadedLanguages().includes(lang)
  ) {
    try {
      await highlighter.loadLanguage(lang as any);
    } catch {
      // Language not available — fall back to text
      lang = "text";
    }
  }

  // Load theme on demand if not pre-loaded
  if (!highlighter.getLoadedThemes().includes(theme as any)) {
    try {
      await highlighter.loadTheme(theme as any);
    } catch {
      theme = "github-dark";
    }
  }

  return highlighter.codeToHtml(code, {
    lang: lang || "text",
    theme: theme || "github-dark",
  });
}
