import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { fileTests } from "@lezer/generator/dist/test";
import { describe, test } from "vitest";
import { parser } from "../dist/index.js";

const testcasesDirectory = path.dirname(fileURLToPath(import.meta.url));

for (const file of fs.readdirSync(testcasesDirectory)) {
	if (!/\.txt$/.test(file)) continue;
	const name = /^[^.]*/.exec(file)[0];
	describe(name, () => {
		for (const { name, run } of fileTests(
			fs.readFileSync(path.join(testcasesDirectory, file), "utf8"),
			file,
		))
			test(name, () => run(parser));
	});
}
