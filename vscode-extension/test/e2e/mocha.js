const Mocha = require("mocha");
const { showFile, sleep } = require("./util");

const ONE_SECOND_IN_MS = 1 * 1000;

/**
 * @param {string[]} files
 * @param {import('vscode').Uri} openFile File to open that activates the extension
 * @returns {Promise<void>}
 */
async function runMocha(files, openFile) {
	const mocha = new Mocha({
		ui: "qunit",
		timeout: ONE_SECOND_IN_MS * 30,
	});

	// Add files to the test suite
	files.forEach((file) => mocha.addFile(file));

	// Open a file to start initializing the extension and give it some time.
	await showFile(openFile);
	if (process.env["CI"]) {
		await sleep(ONE_SECOND_IN_MS * 10);
	} else {
		await sleep(ONE_SECOND_IN_MS * 3);
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

module.exports = { runMocha };
