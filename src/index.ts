import type { PluginDescriptor, PortableTextBlockConfig } from "emdash";
import { definePlugin } from "emdash";
import { version } from "../package.json";
import { LANGUAGES, THEMES, DEFAULT_THEME, DEFAULT_LANGUAGE } from "./constants.js";

interface CodeBlockProOptions {
  defaultTheme?: string;
}

/** One block definition for the build-time descriptor and native runtime. */
function createBlockType(options: CodeBlockProOptions = {}): PortableTextBlockConfig {
  return {
    type: "code-block-pro",
    label: "Code Block Pro",
    icon: "code",
    placeholder: "Paste or type code…",
    fields: [
      { type: "text_input", action_id: "code", label: "Code", multiline: true },
      { type: "select", action_id: "language", label: "Language", options: [...LANGUAGES], initial_value: DEFAULT_LANGUAGE },
      { type: "select", action_id: "theme", label: "Theme", options: [...THEMES], initial_value: options.defaultTheme || DEFAULT_THEME },
      { type: "text_input", action_id: "filename", label: "Filename" },
      { type: "toggle", action_id: "lineNumbers", label: "Show line numbers", initial_value: false },
      { type: "text_input", action_id: "startingLineNumber", label: "Starting line number (default: 1)" },
      { type: "text_input", action_id: "lineHighlights", label: "Highlight lines (e.g. 1,3-5)" },
      { type: "toggle", action_id: "copyButton", label: "Show copy button", initial_value: true },
      { type: "text_input", action_id: "maxHeight", label: "Max height (e.g. 400px)" },
    ],
  };
}

/** EmDash 1.4 declares portableTextBlocks; this plugin always supplies them. */
interface CodeBlockProDescriptor extends PluginDescriptor<CodeBlockProOptions> {
  portableTextBlocks: PortableTextBlockConfig[];
}

export function codeBlockProPlugin(options: CodeBlockProOptions = {}): CodeBlockProDescriptor {
  return {
    id: "code-block-pro",
    version,
    format: "native",
    entrypoint: "emdash-plugin-code-block-pro",
    componentsEntry: "emdash-plugin-code-block-pro/astro",
    options,
    portableTextBlocks: [createBlockType(options)],
  };
}

/**
 * Native plugins: EmDash's virtual module generator does
 *   `import { createPlugin } from "<entrypoint>"; createPlugin({})`
 * at runtime. This must return a resolved plugin (not a PluginDescriptor).
 */
export function createPlugin(options: CodeBlockProOptions = {}) {
  return definePlugin({
    id: "code-block-pro",
    version,
    admin: {
      portableTextBlocks: [createBlockType(options)],
    },
  });
}
