import { suite, test } from "vitest";

import { LanguageSettings } from "../../cssLanguageService";
import { testCompletionFor as testCSSCompletionFor, ExpectedCompetions } from "../css/completion.test";

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
