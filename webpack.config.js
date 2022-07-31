/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check


const path = require('path');

const webpack = require('webpack');

/** @type {import('webpack').Configuration} */
const config = {
	target: 'node', // VScode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

	entry: {
		'node-client': './src/client/node-client.ts',
		'node-server': './src/server/node-server.ts',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		devtoolModuleFilenameTemplate: '../[resource-path]',
		clean: true,
	},
	devtool: 'source-map',
	externals: {
		fsevents: 'require("fsevents")',
		vscode: 'commonjs vscode', // The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					compilerOptions: {
						module: 'es6', // Override `tsconfig.json` so that TypeScript emits native JavaScript modules.
					},
				},
			}],
		}],
	},
	plugins: [
		new webpack.IgnorePlugin({ resourceRegExp: /vertx/ }),
	],
};

module.exports = config;
