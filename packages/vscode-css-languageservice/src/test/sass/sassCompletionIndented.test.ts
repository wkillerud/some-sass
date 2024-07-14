import * as path from "path";
import { suite, test } from "vitest";

import { Position, InsertTextFormat, CompletionItemKind, LanguageSettings } from "../../cssLanguageService";
import { testCompletionFor as testCSSCompletionFor, ExpectedCompetions } from "../css/completion.test";
import { newRange } from "../css/navigation.test";
import { URI } from "vscode-uri";

function testCompletionFor(
	value: string,
	expected: ExpectedCompetions,
	settings: LanguageSettings | undefined = undefined,
	testUri: string = "test://test/test.sass",
	workspaceFolderUri: string = "test://test",
) {
	return testCSSCompletionFor(value, expected, settings, testUri, workspaceFolderUri);
}

suite("Sass indented - Completions", () => {
	test("declarations suggest properties as expected", async () => {
		await testCompletionFor(
			`.foo
	color: red
	|`,

			{
				items: [
					{
						label: "position",
						resultText: `.foo
	color: red
	position: `,
					},
					{
						label: "display",
						resultText: `.foo
	color: red
	display: `,
					},
				],
			},
		);
	});
});
