// imports mocha for the browser, defining the `mocha` global.
require("mocha/mocha");

export function run(): Promise<void> {
	return new Promise((c, e) => {
		mocha.setup({
			ui: "bdd",
			reporter: undefined,
			timeout: 20000,
		});

		// bundles all files in the current directory matching `*.test`
		const importAll = (r: __WebpackModuleApi.RequireContext) =>
			r.keys().forEach(r);
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
			// eslint-disable-next-line no-console
			console.error(err);
			e(err);
		}
	});
}
