/* eslint-disable no-undef */
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import semver from "semver";

async function call(command) {
	console.log(`[release] ${command}`);
	return new Promise((resolve, reject) => {
		exec(command, (e, stdout, stderr) => {
			if (e) return reject(e);
			if (stderr) console.log(stderr);
			resolve(stdout);
		});
	});
}

/**
 * Automate the steps in
 * https://wkillerud.github.io/some-sass/contributing/releases.html#release-process
 */
async function run() {
	await call(`git checkout main`);
	await call(`git pull`);
	await call(`npm run clean`);
	await call(`npm clean-install`);
	await call(`npm run build:production`);
	await call(`npm run release`);
	await call(`git push`);
	await call(`git push --tags`);
	console.log(`[release] pushed server release, updating client`);

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

	const oldServerVersion =
		clientPkgJson.dependencies["some-sass-language-server"];
	const newServerVersion = serverPkgJson.version;

	const diff = semver.diff(
		semver.parse(oldServerVersion),
		semver.parse(newServerVersion),
	);
	if (!diff) {
		console.warn(
			`[release] got to the point of updating the client's package.json, but semver found no diff`,
		);
		return;
	}
	clientPkgJson.version = semver.inc(clientPkgJson.version, diff);
	clientPkgJson.dependencies["some-sass-language-server"] = newServerVersion;

	await fs.writeFile(
		path.join(process.cwd(), "vscode-extension", "package.json"),
		JSON.stringify(clientPkgJson, null, 2),
	);

	await call(`npm install`);
	await call(`git add .`);

	// This is always a chore commit so we don't end up
	// affecting nx's semantic release for the next version
	// of the language server. We version the extension ourselves.
	await call(`git commit -m "chore: updated language server"`);

	await call(`git tag some-sass@${clientPkgJson.version}`);

	console.log(`[release] updated client`);

	await call(`git push`);
	await call(`git push --tags`);
}

run();
