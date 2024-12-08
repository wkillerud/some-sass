import { test, assert, beforeEach } from "vitest";
import {
	defaultConfiguration,
	getLanguageService,
} from "../../language-services";
import { DiagnosticSeverity } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
	ls.configure(defaultConfiguration);
});

test("reports an unknown at-rule", async () => {
	const document = fileSystemProvider.createDocument(`
@tailwind base;
`);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			code: "unknownAtRules",
			message: "Unknown at rule @tailwind",
			range: {
				start: {
					line: 1,
					character: 0,
				},
				end: {
					line: 1,
					character: 9,
				},
			},
			severity: DiagnosticSeverity.Warning,
			source: "scss",
		},
	]);
});

test("ignores unknown at-rules if configured", async () => {
	const document = fileSystemProvider.createDocument(`
@tailwind base;
`);

	ls.configure({
		...defaultConfiguration,
		scss: {
			...defaultConfiguration.scss,
			diagnostics: {
				...defaultConfiguration.scss.diagnostics,
				lint: {
					...defaultConfiguration.scss.diagnostics.lint,
					unknownAtRules: "ignore",
				},
			},
		},
	});
	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, []);
});
