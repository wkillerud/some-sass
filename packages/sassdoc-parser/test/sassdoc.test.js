import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { fileTests } from "@lezer/generator/dist/test";
import { describe, test, assert } from "vitest";
import { parser } from "../dist/parser.js";

const testcasesDirectory = path.dirname(fileURLToPath(import.meta.url));

const reParseError = /No parse at (\d)+/;

for (const file of fs.readdirSync(testcasesDirectory)) {
	if (!/\.txt$/.test(file)) continue;
	const name = /^[^.]*/.exec(file)[0];
	describe(name, () => {
		const testCases = fileTests(
			fs.readFileSync(path.join(testcasesDirectory, file), "utf8"),
			file,
		);

		for (const { name, text, expected, run } of testCases) {
			test(name, () => {
				try {
					run(parser);
				} catch (e) {
					if (e.message) {
						const errorAt = reParseError.exec(e.message);
						if (errorAt) {
							const position = Number.parseInt(errorAt[1]);
							const before = text.substring(0, position);
							const problem = text.charAt(position);
							const after = text.substring(position + 1);

							assert.fail(`Parse error when reading ${problem} at position ${errorAt[1]}:

${before}${problem}${after}`);
						}
						return;
					}

					assert.fail(`
Expected

${text}

to match

${expected}

Got ${e}`);
				}
			});
		}
	});
}
