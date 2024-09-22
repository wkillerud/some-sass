// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const merge = require("merge-options");
const rspack = require("@rspack/core");

/** @typedef {import('@rspack/core').Configuration} RspackConfig **/
/** @type RspackConfig */
const nodeConfig = {
	target: "node",
	entry: {
		"node-server": "./src/node-server.ts",
	},
	output: {
		libraryTarget: "commonjs2",
	},
};

/** @type RspackConfig */
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
	plugins: [
		new rspack.ProvidePlugin({
			process: "process/browser",
		}),
	],
};

function defineConfig(config, mode) {
	/** @type RspackConfig */
	const baseConfig = {
		mode,
		output: {
			filename: "[name].js",
			path: path.join(__dirname, "dist"),
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		optimization: {
			mangleExports: false,
			minimize: true,
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
						},
					},
				},
			],
		},
		devtool: "cheap-source-map",
	};

	/** @type RspackConfig */
	const developmentConfig = {
		devtool: "source-map",
		output: {
			path: path.join(__dirname, "dist", "development"),
		},
	};

	if (mode === "development") {
		return merge(baseConfig, config, developmentConfig);
	}
	return merge(baseConfig, config);
}

module.exports = [
	defineConfig(nodeConfig, "production"),
	defineConfig(browserConfig, "production"),
];
