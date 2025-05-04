/* eslint-disable */
const path = require("path");
const rspack = require("@rspack/core");

/** @type {import('@rspack/core').Configuration} */
const config = {
	target: "node",
	entry: {
		"node-main": "./src/node-main.ts",
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "dist"),
		libraryTarget: "commonjs2",
	},
	resolve: {
		extensions: [".ts", ".js"],
		conditionNames: ["import", "require", "default"],
		mainFields: ["module", "main"],
	},
	module: {
		rules: [
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
						target: "es2022",
					},
				},
			},
		],
	},
	devtool: false,
};

module.exports = (env, argv) => {
	if (argv.mode === "development") {
		config.devtool = "source-map";
	}
	return config;
};
