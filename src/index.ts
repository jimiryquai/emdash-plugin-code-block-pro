import type { PluginDescriptor } from "emdash";
import { definePlugin } from "emdash";

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "Bash", value: "bash" },
  { label: "SQL", value: "sql" },
  { label: "Markdown", value: "markdown" },
  { label: "YAML", value: "yaml" },
];

const THEMES = [
  { label: "GitHub Dark", value: "github-dark" },
  { label: "GitHub Light", value: "github-light" },
  { label: "Dracula", value: "dracula" },
  { label: "Nord", value: "nord" },
  { label: "One Dark Pro", value: "one-dark-pro" },
];

const blockFields = [
  { type: "text_input", action_id: "code", label: "Code", multiline: true },
  { type: "select" as const, action_id: "language", label: "Language", options: LANGUAGES },
  { type: "select" as const, action_id: "theme", label: "Theme", options: THEMES },
  { type: "text_input", action_id: "filename", label: "Filename" },
  { type: "toggle", action_id: "lineNumbers", label: "Show line numbers" },
  { type: "text_input", action_id: "lineHighlights", label: "Highlight lines (e.g. 1,3-5)" },
  { type: "toggle", action_id: "copyButton", label: "Show copy button" },
  { type: "text_input", action_id: "maxHeight", label: "Max height (e.g. 400px)" },
];

const blockType = {
  type: "code-block-pro",
  label: "Code Block Pro",
  icon: "code" as const,
  placeholder: "Paste or type code…",
  fields: blockFields,
};

export function codeBlockProPlugin(options?: {
  defaultTheme?: string;
}): PluginDescriptor {
  return {
    id: "code-block-pro",
    version: "0.1.0",
    format: "native",
    entrypoint: "emdash-plugin-code-block-pro",
    componentsEntry: "emdash-plugin-code-block-pro/astro",
    options: options ?? {},
    portableTextBlocks: [blockType],
  };
}

/**
 * Native plugins: EmDash's virtual module generator does
 *   `import { createPlugin } from "<entrypoint>"; createPlugin({})`
 * at runtime. This must return a PluginDefinition (not a PluginDescriptor).
 */
export function createPlugin(options?: { defaultTheme?: string }) {
  return definePlugin({
    id: "code-block-pro",
    version: "0.1.0",
    admin: {
      portableTextBlocks: [blockType],
    },
  });
}
