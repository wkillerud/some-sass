// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const rspack = require("@rspack/core");

/** @type {import('@rspack/core').Configuration} **/
const config = {
	target: "node",
	entry: {
		"node-client": "./src/node-client.ts",
	},
	output: {
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
		path: path.join(__dirname, "./dist"),
		filename: "[name].js",
	},
	externals: {
		fsevents: 'require("fsevents")',
		vscode: "commonjs vscode",
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	plugins: [],
	devtool: false,
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
					},
				},
			},
		],
	},
};

module.exports = (env, argv) => {
	config.plugins?.push(
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: "../node_modules/some-sass-language-server/dist/node-server.*",
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
