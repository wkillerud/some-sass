// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const rspack = require("@rspack/core");

/** @type {import('@rspack/core').Configuration} **/
const config = {
	context: __dirname,
	mode: "none",
	target: "webworker", // web extensions run in a webworker context
	entry: {
		"browser-client": "./src/browser-client.ts",
	},
	output: {
		libraryTarget: "commonjs",

		path: path.join(__dirname, "./dist"),
		filename: "[name].js",
	},
	externals: {
		vscode: "commonjs vscode",
	},
	plugins: [],
	devtool: false,
	resolve: {
		extensions: [".ts", ".js"],

		mainFields: ["browser", "module", "main"], // prefer `browser` entry point in imported modules
		fallback: {
			events: require.resolve("events/"),
			assert: require.resolve("assert"),
			path: require.resolve("path-browserify"),
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
				exclude: [/[\\/]node_modules[\\/]/],
				loader: "builtin:swc-loader",
				options: {
					jsc: {
						parser: {
							syntax: "typescript",
						},
						externalHelpers: true,
					},
				},
			},
		],
	},
};

module.exports = (env, argv) => {
	config.plugins?.push(
		new rspack.ProvidePlugin({
			process: "process/browser",
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: "../node_modules/some-sass-language-server/dist/browser-server.*",
					to: "[name][ext]",
				},
			],
		}),
	);

	if (argv.mode === "development") {
		config.devtool = "source-map";
	}

	return config;
};
