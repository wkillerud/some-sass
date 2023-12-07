// @ts-check

/* eslint-disable @typescript-eslint/no-var-requires */
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require("path");
const webpack = require("webpack");

/** @type WebpackConfig */
const browserTestsConfig = {
	context: __dirname,
	mode: "none",
	target: "webworker", // web extensions run in a webworker context
	entry: {
		"suite/index": "./web/src/suite/index.ts",
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "web/dist"),
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
