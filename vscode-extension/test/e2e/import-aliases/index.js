const vscode = require("vscode");
const { resolve } = require("path");
const { glob } = require("tinyglobby");
const { runMocha } = require("../mocha");

/**
 * @returns {Promise<void>}
 */
async function run() {
	const files = await glob("*.test.js", {
		cwd: resolve(__dirname),
		absolute: true,
	});

	await runMocha(
		files,
		vscode.Uri.file(resolve(__dirname, "workspace", "apps", "frontpage", "styles.scss")),
	);
}

module.exports = { run };
