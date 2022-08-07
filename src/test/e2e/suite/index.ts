import { resolve } from "path";
import * as fg from "fast-glob";
import * as Mocha from "mocha";
import { getDocUri, showFile, sleep } from "./util";

const ONE_SECOND_IN_MS = 1 * 1000;

export async function run(): Promise<void> {
	const mocha = new Mocha({
		ui: "bdd",
		timeout: ONE_SECOND_IN_MS * 30,
	});

	const files = await fg("**/*.test.js", {
		cwd: resolve(__dirname, ".."),
		absolute: true,
	});

	// Add files to the test suite
	files.forEach((file) => mocha.addFile(file));

	// Open a file to start initializing the extension and give it some time.
	await showFile(getDocUri("definition/main.scss"));
	if (process.env["CI"]) {
		await sleep(ONE_SECOND_IN_MS * 10);
	} else {
		await sleep(ONE_SECOND_IN_MS * 2);
	}

	return new Promise((resolve, reject) => {
		mocha.run((failures) => {
			if (failures === 0) {
				resolve();
				return;
			}

			const error = new Error(`${failures} tests failed.`);

			reject(error);
		});
	});
}
