/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from "react";

export function CodeBlockProEditor() {
  return (
    <div>
      <div>
        <label htmlFor="code">Code</label>
        <textarea id="code" name="code" />
      </div>
      <div>
        <label htmlFor="language">Language</label>
        <select id="language" name="language">
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
        <select id="theme" name="theme">
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
        <input id="filename" name="filename" type="text" />
      </div>
      <div>
        <label htmlFor="lineNumbers">Line numbers</label>
        <input id="lineNumbers" name="lineNumbers" type="checkbox" />
      </div>
      <div>
        <label htmlFor="startingLineNumber">Starting line number</label>
        <input id="startingLineNumber" name="startingLineNumber" type="text" />
      </div>
      <div>
        <label htmlFor="lineHighlights">Line highlights</label>
        <input id="lineHighlights" name="lineHighlights" type="text" />
      </div>
      <div>
        <label htmlFor="copyButton">Copy button</label>
        <input id="copyButton" name="copyButton" type="checkbox" />
      </div>
      <div>
        <label htmlFor="maxHeight">Max height</label>
        <input id="maxHeight" name="maxHeight" type="text" />
      </div>
    </div>
  );
}
