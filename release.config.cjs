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
				publish: false,
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
	],
};
