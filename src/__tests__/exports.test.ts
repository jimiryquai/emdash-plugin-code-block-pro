import { describe, it, expect } from "vitest";
import { blockComponents } from "../astro/index.js";

describe("blockComponents export", () => {
	it("has a 'code' key", () => {
		expect(blockComponents).toHaveProperty("code");
	});

	it("has a 'code-block-pro' key", () => {
		expect(blockComponents).toHaveProperty("code-block-pro");
	});

	it("has exactly 2 keys", () => {
		expect(Object.keys(blockComponents)).toHaveLength(2);
	});

	it("'code' value is a defined component (not null/undefined)", () => {
		expect(blockComponents["code"]).toBeDefined();
		expect(blockComponents["code"]).not.toBeNull();
	});

	it("'code-block-pro' value is a defined component (not null/undefined)", () => {
		expect(blockComponents["code-block-pro"]).toBeDefined();
		expect(blockComponents["code-block-pro"]).not.toBeNull();
	});

	it("both values are distinct components (not the same reference)", () => {
		expect(blockComponents["code"]).not.toBe(blockComponents["code-block-pro"]);
	});
});
