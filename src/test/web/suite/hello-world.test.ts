import { strictEqual } from "assert";
import { window } from "vscode";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as myExtension from '../../extension';

describe("Web Extension Test Suite", () => {
	window.showInformationMessage("Start all tests.");

	it("Sample test", () => {
		strictEqual(-1, [1, 2, 3].indexOf(5));
		strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
