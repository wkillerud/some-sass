import * as assert from "assert";
import { changeConfiguration, useContext } from "../../src/context-provider";
import { doCompletion } from "../../src/features/completion";
import { NodeFileSystem } from "../../src/node-file-system";
import { IScssDocument } from "../../src/parser";
import ScannerService from "../../src/scanner";
import { getUri } from "../fixture-helper";
import * as helpers from "../helpers";

describe("Providers/Completion", () => {
	beforeEach(async () => {
		helpers.createTestContext(new NodeFileSystem());

		const settings = helpers.makeSettings({
			suggestFromUseOnly: true,
		});
		changeConfiguration(settings);
	});

	describe("Hide", () => {
		it("supports multi-level hiding", async () => {
			const workspaceUri = getUri("completion/multi-level-hide/");
			const docUri = getUri("completion/multi-level-hide/styles.scss");
			const scanner = new ScannerService();
			await scanner.scan([docUri], workspaceUri);
			const { storage } = useContext();
			const stylesDoc = storage.get(docUri) as IScssDocument;

			const completions = await doCompletion(
				stylesDoc,
				stylesDoc.getText().indexOf("|"),
			);

			// $color-black and $color-white are hidden at different points

			assert.equal(
				completions.items.length,
				1,
				"Expected only one suggestion from the multi-level-hide fixture",
			);
			assert.equal(completions.items[0].label, "$color-grey");
		});

		it("doesn't hide symbol with same name in different part of dependency graph", async () => {
			const workspaceUri = getUri("completion/same-symbol-name-hide/");
			const docUri = getUri("completion/same-symbol-name-hide/styles.scss");
			const scanner = new ScannerService();
			await scanner.scan([docUri], workspaceUri);
			const { storage } = useContext();
			const stylesDoc = storage.get(docUri) as IScssDocument;

			const completions = await doCompletion(
				stylesDoc,
				stylesDoc.getText().indexOf("|"),
			);

			// $color-white is hidden in branch-a, but not in branch-b
			assert.equal(
				completions.items.length,
				1,
				"Expected a suggestion from the same-symbol-name-hide fixture",
			);
			assert.equal(completions.items[0].label, "$color-white");
		});
	});

	describe("Show", () => {
		it("doesn't show symbol with same name in different part of dependency graph", async () => {
			const workspaceUri = getUri("completion/same-symbol-name-show/");
			const docUri = getUri("completion/same-symbol-name-show/styles.scss");
			const scanner = new ScannerService();
			await scanner.scan([docUri], workspaceUri);
			const { storage } = useContext();
			const stylesDoc = storage.get(docUri) as IScssDocument;

			const completions = await doCompletion(
				stylesDoc,
				stylesDoc.getText().indexOf("|"),
			);

			// One branch only shows $color-black, but the other has three symbols including another $color-black
			assert.equal(
				completions.items.length,
				4,
				"Expected four suggestions from the same-symbol-name-show fixture",
			);
		});
	});
});
