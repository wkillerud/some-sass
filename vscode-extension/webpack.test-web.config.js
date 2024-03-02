// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const webpack = require("webpack");

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const browserTestsConfig = {
	context: __dirname,
	mode: "none",
	target: "webworker",
	entry: {
		"suite/index": "./test/web/suite/index.ts",
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "out", "test", "web"),
		libraryTarget: "commonjs",
	},
	resolve: {
		mainFields: ["module", "main"],
		extensions: [".ts", ".js"],
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
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
					},
				],
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
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
