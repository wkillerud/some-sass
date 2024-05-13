import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		exclude: ["lib/**"],
		isolate: false,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
	},
});
