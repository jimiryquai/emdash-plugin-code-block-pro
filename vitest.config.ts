import { getViteConfig } from "astro/config";

// Use Astro's Vite pipeline so .astro files are compiled automatically.
// We point root at the plugin directory itself (no astro.config = no Cloudflare adapter)
// but still get the Astro Vite plugin for .astro compilation.
export default getViteConfig({
	test: {
		include: ["src/**/*.test.{ts,tsx}"],
		// Shiki needs a bit longer for first load (WASM grammar init)
		testTimeout: 30_000,
		globals: true,
	},
});
