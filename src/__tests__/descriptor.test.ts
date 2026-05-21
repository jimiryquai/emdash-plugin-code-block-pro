import { describe, it, expect } from "vitest";
import { codeBlockProPlugin } from "../index.js";

describe("codeBlockProPlugin descriptor — portableTextBlocks", () => {
  const descriptor = codeBlockProPlugin();

  it("has a portableTextBlocks array", () => {
    expect(descriptor).toHaveProperty("portableTextBlocks");
    expect(Array.isArray(descriptor.portableTextBlocks)).toBe(true);
  });

  describe("code-block-pro block type", () => {
    const blocks = descriptor.portableTextBlocks ?? [];
    const block = blocks.find((b: any) => b.type === "code-block-pro");

    it("declares a block with type 'code-block-pro'", () => {
      expect(block).toBeDefined();
    });

    it("has label 'Code Block Pro'", () => {
      expect(block.label).toBe("Code Block Pro");
    });

    it("has icon 'code'", () => {
      expect(block.icon).toBe("code");
    });

    it("has a 'code' field (textarea)", () => {
      const field = block.fields.find((f: any) => f.name === "code");
      expect(field).toBeDefined();
      expect(field.type).toBe("text");
    });

    it("has a 'language' field (dropdown)", () => {
      const field = block.fields.find((f: any) => f.name === "language");
      expect(field).toBeDefined();
      expect(field.type).toBe("select");
    });

    it("has a 'theme' field (dropdown)", () => {
      const field = block.fields.find((f: any) => f.name === "theme");
      expect(field).toBeDefined();
      expect(field.type).toBe("select");
    });

    it("has a 'filename' field (text input)", () => {
      const field = block.fields.find((f: any) => f.name === "filename");
      expect(field).toBeDefined();
      expect(field.type).toBe("string");
    });

    it("has a 'lineNumbers' field (toggle)", () => {
      const field = block.fields.find((f: any) => f.name === "lineNumbers");
      expect(field).toBeDefined();
      expect(field.type).toBe("boolean");
    });

    it("has a 'lineHighlights' field (text input)", () => {
      const field = block.fields.find((f: any) => f.name === "lineHighlights");
      expect(field).toBeDefined();
      expect(field.type).toBe("string");
    });

    it("has a 'copyButton' field (toggle)", () => {
      const field = block.fields.find((f: any) => f.name === "copyButton");
      expect(field).toBeDefined();
      expect(field.type).toBe("boolean");
    });

    it("has a 'maxHeight' field (text input)", () => {
      const field = block.fields.find((f: any) => f.name === "maxHeight");
      expect(field).toBeDefined();
      expect(field.type).toBe("string");
    });

    it("declares exactly 8 fields", () => {
      expect(block.fields).toHaveLength(8);
    });
  });
});
