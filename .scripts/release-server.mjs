/* eslint-disable no-undef */
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import semver from "semver";

async function call(command) {
	console.log(`[release-server] ${command}`);
	return new Promise((resolve, reject) => {
		exec(command, (e, stdout, stderr) => {
			if (e) return reject(e);
			if (stderr) console.log(stderr);
			resolve(stdout);
		});
	});
}

async function run() {
	// await call(`git checkout main`);
	// await call(`git pull`);
	// await call(`npm clean-install`);
	// await call(`npm run release`);
	// await call(`git push`);
	// await call(`git push --tags`);
	console.log(`[release-server] pushed server release, updating client`);

	let serverPkgJson = await fs.readFile(
		path.join(process.cwd(), "packages", "language-server", "package.json"),
		"utf-8",
	);
	let clientPkgJson = await fs.readFile(
		path.join(process.cwd(), "vscode-extension", "package.json"),
		"utf-8",
	);
	serverPkgJson = JSON.parse(serverPkgJson);
	clientPkgJson = JSON.parse(clientPkgJson);

	let oldServerVersion =
		clientPkgJson.dependencies["some-sass-language-server"];
	let newServerVersion = serverPkgJson.version;

	newServerVersion = semver.parse(newServerVersion);
	oldServerVersion = semver.parse(oldServerVersion);

	let diff = semver.diff(newServerVersion, oldServerVersion);
	if (!diff) {
		console.warn(
			`[release-server] got to the point of updating the client's package.json, but semver found no diff`,
		);
		return;
	}
	clientPkgJson.version = semver.inc(clientPkgJson.version, diff);

	await fs.writeFile(
		path.join(process.cwd(), "vscode-extension", "package.json"),
		JSON.stringify(clientPkgJson, null, 2),
	);

	await call(`npm install`);
	await call(`git add .`);
	if (diff === "major") {
		await call(`git commit -m "feat!: update for language server"`);
	} else if (diff === "minor") {
		await call(`git commit -m "feat: feature update for language server"`);
	} else {
		await call(`git commit -m "fix: bugfix update for language server"`);
	}

	await call(`git tag some-sass@${clientPkgJson.version}`);

	console.log(`[release-server] updated client`);
	console.log(
		`[release-server] review the last commit and run git push && git push --tags manually`,
	);
	// TODO: when this works consistently, push automatically.
	// await call(`git push`);
	// await call(`git push --tags`);
}

run();
