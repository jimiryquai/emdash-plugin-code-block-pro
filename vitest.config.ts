import { defineConfig } from "vitest/config";

// Plain vitest config — the descriptor test doesn't need Astro's Vite pipeline.
// For .astro component tests, use `getViteConfig` from `astro/config` instead
// (requires astro as a devDependency).
export default defineConfig({
	test: {
		include: ["src/**/*.test.{ts,tsx}"],
		testTimeout: 30_000,
		globals: true,
	},
});
