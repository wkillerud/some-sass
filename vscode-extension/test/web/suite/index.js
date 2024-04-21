// imports mocha for the browser, defining the `mocha` global.
require("mocha/mocha");

/**
 * @returns {Promise<void>}
 */
function run() {
	return new Promise((c, e) => {
		mocha.setup({
			ui: "bdd",
			reporter: undefined,
			timeout: 20000,
		});

		// bundles all files in the current directory matching `*.test`
		const importAll = (r) => r.keys().forEach(r);
		importAll(require.context(".", true, /\.test$/));

		try {
			// Run the mocha test
			mocha.run((failures) => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}

module.exports = { run };
