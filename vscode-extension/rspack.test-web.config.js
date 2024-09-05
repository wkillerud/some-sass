// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const rspack = require("@rspack/core");

/** @typedef {import('@rspack/core').Configuration} RspackConfig **/
/** @type RspackConfig */
const browserTestsConfig = {
	context: __dirname,
	mode: "none",
	target: "webworker",
	entry: {
		"suite/index": "./test/web/suite/index.js",
	},
	output: {
		filename: "web-tests.js",
		path: path.join(__dirname, "out", "test"),
		libraryTarget: "commonjs",
	},
	resolve: {
		mainFields: ["module", "main"],
		extensions: [".js"],
		alias: {},
		fallback: {
			assert: require.resolve("assert"),
			events: require.resolve("events/"),
			path: require.resolve("path-browserify"),
			util: require.resolve("util/"),
			"fs/promises": false,
		},
	},
	module: {
		rules: [
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
		],
	},
	plugins: [
		new rspack.ProvidePlugin({
			process: "process/browser",
		}),
	],
	externals: {
		vscode: "commonjs vscode",
	},
	performance: {
		hints: false,
	},
	devtool: "nosources-source-map",
};

module.exports = browserTestsConfig;
