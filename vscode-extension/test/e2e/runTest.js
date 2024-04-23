const childProcess = require("child_process");
const path = require("path");
const {
	runTests,
	downloadAndUnzipVSCode,
	resolveCliArgsFromVSCodeExecutablePath,
} = require("@vscode/test-electron");

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, "..", "..");

		// The path to the extension test script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, "suite", "index.js");

		const workspaceDir = path.resolve(__dirname, "..", "fixtures");

		const version = "insiders";

		// Download VS Code, unzip it and run the integration test
		const vscodeExecutablePath = await downloadAndUnzipVSCode(version);

		const [cli, ...args] =
			resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

		if (!cli) {
			throw new Error(
				"Something went wrong resolving the CLI path to the download of VS Code",
			);
		}

		childProcess.spawnSync(
			cli,
			[...args, "--install-extension", "octref.vetur"],
			{
				encoding: "utf-8",
				stdio: "inherit",
			},
		);

		childProcess.spawnSync(
			cli,
			[...args, "--install-extension", "svelte.svelte-vscode"],
			{
				encoding: "utf-8",
				stdio: "inherit",
			},
		);

		childProcess.spawnSync(
			cli,
			[...args, "--install-extension", "astro-build.astro-vscode"],
			{
				encoding: "utf-8",
				stdio: "inherit",
			},
		);

		await runTests({
			vscodeExecutablePath,
			version,
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [workspaceDir],
		});
	} catch (error) {
		console.error("Failed to run tests");
		console.error(error.name);
		console.error(error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

main();
