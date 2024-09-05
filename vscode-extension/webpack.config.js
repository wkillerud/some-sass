// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const merge = require("merge-options");
const webpack = require("webpack");

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const nodeConfig = {
	target: "node",
	entry: {
		"node-client": "./src/node-client.ts",
	},
	output: {
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	},
	externals: {
		fsevents: 'require("fsevents")',
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
								module: "es6",
							},
						},
					},
				],
			},
		],
	},
};

/** @type WebpackConfig */
const browserConfig = {
	context: __dirname,
	mode: "none",
	target: "webworker", // web extensions run in a webworker context
	entry: {
		"browser-client": "./src/browser-client.ts",
	},
	output: {
		libraryTarget: "commonjs",
	},
	resolve: {
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
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
					},
				],
			},
		],
	},
};

function defineConfig(config) {
	/** @type WebpackConfig */
	const baseConfig = {
		output: {
			path: path.join(__dirname, "./dist"),
			filename: "[name].js",
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		externals: {
			vscode: "commonjs vscode",
		},
		plugins: [],
		devtool: false,
	};

	/** @type WebpackConfig */
	const developmentConfig = {
		devtool: "source-map",
	};

	// Return a function so we can adjust config by mode: https://webpack.js.org/configuration/mode/#mode-development
	return (env, argv) => {
		const baseFrom =
			argv.mode === "development"
				? "../node_modules/some-sass-language-server/dist/development"
				: "../node_modules/some-sass-language-server/dist/";

		if (config.target === "node") {
			baseConfig.plugins?.push(
				new CopyPlugin({
					patterns: [
						{
							from: `${baseFrom}/node-server.*`,
							to: "[name][ext]",
						},
					],
				}),
			);
		} else {
			baseConfig.plugins?.push(
				new webpack.ProvidePlugin({
					process: "process/browser",
				}),
				new CopyPlugin({
					patterns: [
						{
							from: `${baseFrom}/browser-server.*`,
							to: "[name][ext]",
						},
					],
				}),
			);
		}

		if (argv.mode === "development") {
			/** @type WebpackConfig */
			const merged = merge(baseConfig, config, developmentConfig);
			return merged;
		}
		return merge(baseConfig, config);
	};
}

module.exports = [defineConfig(nodeConfig), defineConfig(browserConfig)];
