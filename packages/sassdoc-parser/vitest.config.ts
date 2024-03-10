/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
	test: {
		forceRerunTriggers: [
			"**/package.json/**",
			"**/test/**/*.txt",
			"**/dist/parser.js",
		],
	},
});
