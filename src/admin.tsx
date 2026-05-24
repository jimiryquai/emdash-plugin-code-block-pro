/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from "react";

export interface CodeBlockProData {
  code?: string;
  language?: string;
  theme?: string;
  filename?: string;
  lineNumbers?: boolean;
  startingLineNumber?: string;
  lineHighlights?: string;
  copyButton?: boolean;
  maxHeight?: string;
}

export function CodeBlockProEditor({
  value,
  onChange,
}: {
  value?: string | CodeBlockProData;
  onChange?: (v: string) => void;
}) {
  const data = React.useMemo<CodeBlockProData>(() => {
    if (!value) return {};
    if (typeof value === "object") return value;
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }, [value]);

  const updateField = (key: keyof CodeBlockProData, val: any) => {
    if (onChange) {
      const next = { ...data, [key]: val };
      onChange(JSON.stringify(next));
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="code">Code</label>
        <textarea
          id="code"
          name="code"
          value={data.code ?? ""}
          onChange={(e) => updateField("code", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="language">Language</label>
        <select
          id="language"
          name="language"
          value={data.language ?? "javascript"}
          onChange={(e) => updateField("language", e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="bash">Bash</option>
          <option value="sql">SQL</option>
          <option value="markdown">Markdown</option>
          <option value="yaml">YAML</option>
        </select>
      </div>
      <div>
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          name="theme"
          value={data.theme ?? "github-dark"}
          onChange={(e) => updateField("theme", e.target.value)}
        >
          <option value="github-dark">GitHub Dark</option>
          <option value="github-light">GitHub Light</option>
          <option value="dracula">Dracula</option>
          <option value="nord">Nord</option>
          <option value="one-dark-pro">One Dark Pro</option>
          <option value="solarized-dark">Solarized Dark</option>
          <option value="solarized-light">Solarized Light</option>
          <option value="monokai">Monokai</option>
          <option value="synthwave-84">Synthwave '84</option>
          <option value="tokyo-night">Tokyo Night</option>
          <option value="night-owl">Night Owl</option>
          <option value="rose-pine">Rosé Pine</option>
          <option value="rose-pine-moon">Rosé Pine Moon</option>
          <option value="rose-pine-dawn">Rosé Pine Dawn</option>
          <option value="ayu-dark">Ayu Dark</option>
          <option value="light-plus">Light Plus</option>
          <option value="dark-plus">Dark Plus</option>
          <option value="material-theme">Material Theme</option>
          <option value="material-theme-darker">Material Theme Darker</option>
          <option value="material-theme-lighter">Material Theme Lighter</option>
          <option value="material-theme-palenight">Material Theme Palenight</option>
          <option value="poimandres">Poimandres</option>
          <option value="vitesse-dark">Vitesse Dark</option>
          <option value="vitesse-light">Vitesse Light</option>
        </select>
      </div>
      <div>
        <label htmlFor="filename">Filename</label>
        <input
          id="filename"
          name="filename"
          type="text"
          value={data.filename ?? ""}
          onChange={(e) => updateField("filename", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lineNumbers">Line numbers</label>
        <input
          id="lineNumbers"
          name="lineNumbers"
          type="checkbox"
          checked={data.lineNumbers ?? false}
          onChange={(e) => updateField("lineNumbers", e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="startingLineNumber">Starting line number</label>
        <input
          id="startingLineNumber"
          name="startingLineNumber"
          type="text"
          value={data.startingLineNumber ?? ""}
          onChange={(e) => updateField("startingLineNumber", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lineHighlights">Line highlights</label>
        <input
          id="lineHighlights"
          name="lineHighlights"
          type="text"
          value={data.lineHighlights ?? ""}
          onChange={(e) => updateField("lineHighlights", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="copyButton">Copy button</label>
        <input
          id="copyButton"
          name="copyButton"
          type="checkbox"
          checked={data.copyButton ?? false}
          onChange={(e) => updateField("copyButton", e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="maxHeight">Max height</label>
        <input
          id="maxHeight"
          name="maxHeight"
          type="text"
          value={data.maxHeight ?? ""}
          onChange={(e) => updateField("maxHeight", e.target.value)}
        />
      </div>
    </div>
  );
}

export const fields = {
  CodeBlockProEditor,
};

