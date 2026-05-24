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
