import fs from "node:fs/promises";
import path from "node:path";
import { assert, describe, it } from "vitest";

describe("Built output", () => {
	it("does not include hard-coded paths from the runner", async () => {
		const dist = await fs.readdir(
			path.join(import.meta.dirname, "..", "..", "dist"),
			{ withFileTypes: true },
		);
		for (const file of dist) {
			const content = await fs.readFile(
				path.join(file.parentPath, file.name),
				"utf-8",
			);
			assert.notMatch(
				content,
				/(C:\\|file:\/\/\/).*\/some-sass\//,
				"Expected not to find a hard-coded path to the workspace in the built output",
			);
		}
	});
});
