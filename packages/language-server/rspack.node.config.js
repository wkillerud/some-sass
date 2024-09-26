/* eslint-disable */
const path = require("path");
const rspack = require("@rspack/core");
const { RsdoctorRspackPlugin } = require("@rsdoctor/rspack-plugin");

/** @type {import('@rspack/core').Configuration} */
const config = {
	target: "node",
	entry: {
		"node-server": "./src/node-server.ts",
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "dist"),
		libraryTarget: "commonjs2",
	},
	resolve: {
		extensions: [".ts", ".js"],
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
	devtool: "cheap-source-map",
	plugins: [
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
