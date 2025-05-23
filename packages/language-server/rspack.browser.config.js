/* eslint-disable */
const path = require("path");
const rspack = require("@rspack/core");

/** @type {import('@rspack/core').Configuration} */
const config = {
	context: __dirname,
	target: "webworker",
	entry: {
		"browser-main": "./src/browser-main.ts",
	},
	output: {
		libraryTarget: "var",
		library: "serverExportVar",
		filename: "[name].js",
		path: path.join(__dirname, "dist"),
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
	resolve: {
		extensions: [".ts", ".js"],
		mainFields: ["browser", "module", "main"],
		conditionNames: ["import", "require", "default"],
		fallback: {
			events: require.resolve("events/"),
			path: require.resolve("path-browserify"),
			util: require.resolve("util/"),
			url: require.resolve("url/"),
			"fs/promises": false,
		},
	},
	plugins: [
		new rspack.ProvidePlugin({
			process: "process/browser",
		}),
		new rspack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
	devtool: false,
};

module.exports = (env, argv) => {
	if (argv.mode === "development") {
		config.devtool = "source-map";
	}
	return config;
};
