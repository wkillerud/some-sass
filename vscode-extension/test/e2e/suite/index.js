const { resolve } = require("path");
const fg = require("fast-glob");
const Mocha = require("mocha");
const { getDocUri, showFile, sleep } = require("./util");

const ONE_SECOND_IN_MS = 1 * 1000;

/**
 * @returns {Promise<void>}
 */
async function run() {
	const mocha = new Mocha({
		ui: "bdd",
		timeout: ONE_SECOND_IN_MS * 30,
	});

	const files = await fg("**/*.test.js", {
		cwd: resolve(__dirname, ".."),
		absolute: true,
	});

	// Add files to the test suite
	files.forEach((file) => mocha.addFile(file));

	// Open a file to start initializing the extension and give it some time.
	await showFile(getDocUri("definition/main.scss"));
	if (process.env["CI"]) {
		await sleep(ONE_SECOND_IN_MS * 10);
	} else {
		await sleep(ONE_SECOND_IN_MS * 2);
	}

	return new Promise((resolve, reject) => {
		mocha.run((failures) => {
			if (failures === 0) {
				resolve();
				return;
			}

			const error = new Error(`${failures} tests failed.`);

			reject(error);
		});
	});
}

module.exports = { run };
