import { getViteConfig } from "astro/config";

// Use Astro's Vite pipeline so .astro component imports resolve correctly.
export default getViteConfig({
	test: {
		include: ["src/**/*.test.{ts,tsx}"],
		testTimeout: 30_000,
		globals: true,
	},
});
