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
  { label: "Solarized Dark", value: "solarized-dark" },
  { label: "Solarized Light", value: "solarized-light" },
  { label: "Monokai", value: "monokai" },
  { label: "Synthwave '84", value: "synthwave-84" },
  { label: "Tokyo Night", value: "tokyo-night" },
  { label: "Night Owl", value: "night-owl" },
  { label: "Rosé Pine", value: "rose-pine" },
  { label: "Rosé Pine Moon", value: "rose-pine-moon" },
  { label: "Rosé Pine Dawn", value: "rose-pine-dawn" },
  { label: "Ayu Dark", value: "ayu-dark" },
  { label: "Light Plus", value: "light-plus" },
  { label: "Dark Plus", value: "dark-plus" },
  { label: "Material Theme", value: "material-theme" },
  { label: "Material Theme Darker", value: "material-theme-darker" },
  { label: "Material Theme Lighter", value: "material-theme-lighter" },
  { label: "Material Theme Palenight", value: "material-theme-palenight" },
  { label: "Poimandres", value: "poimandres" },
  { label: "Vitesse Dark", value: "vitesse-dark" },
  { label: "Vitesse Light", value: "vitesse-light" },
];

const blockFields = [
  { type: "text_input", action_id: "code", label: "Code", multiline: true },
  { type: "select" as const, action_id: "language", label: "Language", options: LANGUAGES, initial_value: "javascript" },
  { type: "select" as const, action_id: "theme", label: "Theme", options: THEMES, initial_value: "github-dark" },
  { type: "text_input", action_id: "filename", label: "Filename" },
  { type: "toggle", action_id: "lineNumbers", label: "Show line numbers", initial_value: false },
  { type: "text_input", action_id: "startingLineNumber", label: "Starting line number (default: 1)" },
  { type: "text_input", action_id: "lineHighlights", label: "Highlight lines (e.g. 1,3-5)" },
  { type: "toggle", action_id: "copyButton", label: "Show copy button", initial_value: true },
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
    adminEntry: "emdash-plugin-code-block-pro/admin",
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
