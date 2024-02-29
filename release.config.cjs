/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
	branches: ["main", { name: "next", prerelease: true }],
	tagFormat: "${version}",
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"semantic-release-vsce",
			{
				packageVsix: true,
			},
		],
		[
			// Release the server portion on npm for use with other editors
			"@semantic-release/npm",
			{
				pkgRoot: "server",
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
