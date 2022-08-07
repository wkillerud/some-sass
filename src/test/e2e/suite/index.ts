import { resolve } from "path";
import * as fg from "fast-glob";
import * as Mocha from "mocha";

const ONE_SECOND_IN_MS = 1 * 1000;

export async function run(): Promise<void> {
	const mocha = new Mocha({
		ui: "bdd",
		timeout: ONE_SECOND_IN_MS * 10,
	});

	const files = await fg("**/*.test.js", {
		cwd: resolve(__dirname, ".."),
		absolute: true,
	});

	// Add files to the test suite
	files.forEach((file) => mocha.addFile(file));

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
