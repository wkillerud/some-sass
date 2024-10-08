const path = require("path");
const { runTests } = require("@vscode/test-web");

process.on("uncaughtException", (e) => {
	console.error(e);
});

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		const extensionDevelopmentPath = path.resolve(__dirname, "..", "..");

		// The path to module with the bundled test runner and tests
		const extensionTestsPath = path.resolve(
			__dirname,
			"..",
			"..",
			"out",
			"test",
			"web-tests.js",
		);

		const folderPath = path.resolve(
			__dirname,
			"..",
			"..",
			"test",
			"e2e",
			"defaults-scss",
			"workspace",
		);

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
			folderPath,
			waitForDebugger: waitForDebugger
				? Number(waitForDebugger.slice(attachArgName.length))
				: undefined,
		});
	} catch (err) {
		console.error("Failed to run tests");
		process.exit(1);
	}
}

main();
