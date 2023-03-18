/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require("path");
const webpack = require("webpack");

/** @type WebpackConfig */
const nodeClientConfig = {
	target: "node", // VScode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

	entry: {
		"node-client": "./client/src/node-client.ts",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	},
	devtool: "source-map",
	externals: {
		fsevents: 'require("fsevents")',
		vscode: "commonjs vscode", // The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							compilerOptions: {
								module: "es6", // Override `tsconfig.json` so that TypeScript emits native JavaScript modules.
							},
						},
					},
				],
			},
		],
	},
	plugins: [new webpack.IgnorePlugin({ resourceRegExp: /vertx/ })],
};

/** @type WebpackConfig */
const nodeServerConfig = {
	target: "node", // VScode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

	entry: {
		"node-server": "./server/src/node-server.ts",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	},
	devtool: "source-map",
	externals: {
		fsevents: 'require("fsevents")',
		vscode: "commonjs vscode", // The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							compilerOptions: {
								module: "es6", // Override `tsconfig.json` so that TypeScript emits native JavaScript modules.
							},
						},
					},
				],
			},
		],
	},
	plugins: [new webpack.IgnorePlugin({ resourceRegExp: /vertx/ })],
};

/** @type WebpackConfig */
const browserClientConfig = {
	context: __dirname,
	mode: "none",
	target: "webworker", // web extensions run in a webworker context
	entry: {
		"browser-client": "./client/src/browser-client.ts",
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "./dist"),
		libraryTarget: "commonjs",
	},
	resolve: {
		mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
		extensions: [".ts", ".js"],
		alias: {
			// provides alternate implementation for node module and source files
		},
		fallback: {
			events: require.resolve("events/"),
			assert: require.resolve("assert"),
			path: require.resolve("path-browserify"),
		},
	},
	module: {
		rules: [
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

/** @type WebpackConfig */
const browserServerConfig = {
	context: __dirname,
	mode: "none",
	target: "webworker", // web extensions run in a webworker context
	entry: {
		"browser-server": "./server/src/browser-server.ts",
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "dist"),
		libraryTarget: "var",
		library: "serverExportVar",
	},
	resolve: {
		mainFields: ["browser", "module", "main"],
		extensions: [".ts", ".js"],
		alias: {},
		fallback: {
			events: require.resolve("events/"),
			path: require.resolve("path-browserify"),
			util: require.resolve("util/"),
			"fs/promises": false,
		},
	},
	module: {
		rules: [
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
	devtool: "source-map",
};

module.exports = [
	nodeClientConfig,
	nodeServerConfig,
	browserClientConfig,
	browserServerConfig,
];
