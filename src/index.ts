import type { PluginDescriptor } from "emdash";
import { definePlugin } from "emdash";

export function codeBlockProPlugin(options?: {
  defaultTheme?: string;
}): PluginDescriptor {
  return {
    id: "code-block-pro",
    version: "0.1.0",
    entrypoint: "emdash-plugin-code-block-pro",
    componentsEntry: "emdash-plugin-code-block-pro/astro",
    options: options ?? {},
    portableTextBlocks: [
      {
        type: "code-block-pro",
        label: "Code Block Pro",
        icon: "code",
        fields: [
          { name: "code", type: "text" },
          { name: "language", type: "select" },
          { name: "theme", type: "select" },
          { name: "filename", type: "string" },
          { name: "lineNumbers", type: "boolean" },
          { name: "lineHighlights", type: "string" },
          { name: "copyButton", type: "boolean" },
          { name: "maxHeight", type: "string" },
        ],
      },
    ],
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
      portableTextBlocks: [
        {
          type: "code-block-pro",
          label: "Code Block Pro",
          icon: "code",
          fields: [
            { name: "code", type: "text" },
            { name: "language", type: "select" },
            { name: "theme", type: "select" },
            { name: "filename", type: "string" },
            { name: "lineNumbers", type: "boolean" },
            { name: "lineHighlights", type: "string" },
            { name: "copyButton", type: "boolean" },
            { name: "maxHeight", type: "string" },
          ],
        },
      ],
    },
  });
}
