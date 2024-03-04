import * as path from "path";
import { runTests } from "@vscode/test-web";

process.on("uncaughtException", (e) => {
	// eslint-disable-next-line no-console
	console.error(e);
});

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		const extensionDevelopmentPath = path.resolve(__dirname, "..", "..", "..");

		// The path to module with the test runner and tests
		const extensionTestsPath = path.resolve(__dirname, "suite", "index");

		const folderPath = path.resolve(__dirname, "..", "fixtures");

		const attachArgName = "--waitForDebugger=";
		const waitForDebugger = process.argv.find((arg) =>
			arg.startsWith(attachArgName),
		);

		// Start a web server that serves VSCode in a browser, run the tests
		await runTests({
			headless: true,
			browserType: "chromium",
			extensionDevelopmentPath,
			extensionTestsPath,
			extensionIds: [
				// At time of writing, these don't work in the browser
				// { id: "octref.vetur" },
				// { id: "svelte.svelte-vscode" },
				// { id: "astro-build.astro-vscode" },
			],
			folderPath,
			waitForDebugger: waitForDebugger
				? Number(waitForDebugger.slice(attachArgName.length))
				: undefined,
		});
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error("Failed to run tests");
		process.exit(1);
	}
}

main();
