/* eslint-disable */

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
		filename: "[name].js",
		path: path.join(__dirname, "./dist"),
		libraryTarget: "commonjs",
	},
	externals: {
		vscode: "commonjs vscode",
	},
	plugins: [],
	devtool: false,
	resolve: {
		extensions: [".ts", ".js"],
		mainFields: ["browser", "module", "main"],
		conditionNames: ["import", "require", "default"],
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
	plugins: [
		new rspack.ProvidePlugin({
			process: "process/browser",
		}),
		new rspack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: "../node_modules/some-sass-language-server/dist/**/*.js",
					to: "[name][ext]",
				},
				{
					from: "../node_modules/some-sass-language-server/dist/**/*.js.map",
					to: "[name][ext]",
				},
			],
		}),
		// Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
		process.env.RSDOCTOR && new RsdoctorRspackPlugin(),
	].filter(Boolean),
};

module.exports = (env, argv) => {
	if (argv.mode === "development") {
		config.devtool = "source-map";
	}

	return config;
};
