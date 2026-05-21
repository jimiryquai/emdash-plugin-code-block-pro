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
