/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
	branches: ["main", { name: "next", prerelease: true }],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"semantic-release-vsce",
			{
				packageVsix: true,
				packageRoot: "./vscode-extension",
			},
		],
		[
			"@semantic-release/github",
			{
				assets: [
					{
						path: "*.vsix",
					},
				],
			},
		],
		"@semantic-release/git",
	],
};
