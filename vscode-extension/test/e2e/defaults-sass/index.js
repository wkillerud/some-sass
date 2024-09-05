const vscode = require("vscode");
const { resolve } = require("path");
const fg = require("fast-glob");
const { runMocha } = require("../mocha");

/**
 * @returns {Promise<void>}
 */
async function run() {
	const files = await fg("*.test.js", {
		cwd: resolve(__dirname),
		absolute: true,
	});

	await runMocha(
		files,
		vscode.Uri.file(resolve(__dirname, "workspace", "styles.sass")),
	);
}

module.exports = { run };
