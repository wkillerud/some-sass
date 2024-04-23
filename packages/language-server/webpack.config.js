// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const merge = require("merge-options");
const webpack = require("webpack");

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const nodeConfig = {
	target: "node",
	entry: {
		"node-server": "./src/node-server.ts",
	},
	output: {
		libraryTarget: "commonjs2",
	},
};

/** @type WebpackConfig */
const browserConfig = {
	context: __dirname,
	target: "webworker",
	entry: {
		"browser-server": "./src/browser-server.ts",
	},
	output: {
		libraryTarget: "var",
		library: "serverExportVar",
	},
	resolve: {
		mainFields: ["browser", "module", "main"],
		fallback: {
			events: require.resolve("events/"),
			path: require.resolve("path-browserify"),
			util: require.resolve("util/"),
			url: require.resolve("url/"),
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
};

function defineConfig(config) {
	/** @type WebpackConfig */
	const baseConfig = {
		output: {
			filename: "[name].js",
			path: path.join(__dirname, "dist"),
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
									module: "es6",
								},
							},
						},
					],
				},
			],
		},
		devtool: "hidden-source-map",
	};

	/** @type WebpackConfig */
	const developmentConfig = {
		devtool: "source-map",
		output: {
			path: path.join(__dirname, "dist", "development"),
		},
	};

	// Return a function so we can adjust config by mode: https://webpack.js.org/configuration/mode/#mode-development
	return (env, argv) => {
		if (argv.mode === "development") {
			return merge(baseConfig, config, developmentConfig);
		}
		return merge(baseConfig, config);
	};
}

module.exports = [defineConfig(nodeConfig), defineConfig(browserConfig)];
