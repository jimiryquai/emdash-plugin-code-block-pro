/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Import the actual admin component — fails in RED phase because it's not
// exported yet (admin.tsx currently only does `export {};`).
import { CodeBlockProEditor } from "../admin.js";

describe("CodeBlockProEditor", () => {
	it("renders a code textarea", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
	});

	it("renders a language selector", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
	});

	it("renders a theme selector with at least 5 options", () => {
		render(<CodeBlockProEditor />);
		const themeSelect = screen.getByLabelText(/theme/i);
		expect(themeSelect).toBeInTheDocument();
		const options = themeSelect.querySelectorAll("option");
		expect(options.length).toBeGreaterThanOrEqual(5);
	});

	it("renders a filename input", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/filename/i)).toBeInTheDocument();
	});

	it("renders a line numbers toggle", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/line numbers/i)).toBeInTheDocument();
	});

	it("renders a line highlights input", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/line highlights/i)).toBeInTheDocument();
	});

	it("renders a copy button toggle", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/copy button/i)).toBeInTheDocument();
	});

	it("renders a max height input", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/max height/i)).toBeInTheDocument();
	});

	it("renders a starting line number input", () => {
		render(<CodeBlockProEditor />);
		expect(screen.getByLabelText(/starting line number/i)).toBeInTheDocument();
	});

	it("renders a theme selector with all 24 options", () => {
		render(<CodeBlockProEditor />);
		const themeSelect = screen.getByLabelText(/theme/i);
		const options = themeSelect.querySelectorAll("option");
		expect(options.length).toBe(24);
		expect(screen.getByRole("option", { name: "Synthwave '84" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Rosé Pine" })).toBeInTheDocument();
	});
});
