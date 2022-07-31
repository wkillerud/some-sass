import fs from "fs";
import fg from "fast-glob";

export function findFiles(
	pattern: string,
	options: fg.Options,
): Promise<string[]> {
	return fg(pattern, {
		...options,
		absolute: true,
		dot: true,
		suppressErrors: true,
	});
}

export async function fileExists(filepath: string): Promise<boolean> {
	try {
		await fs.promises.access(filepath, fs.constants.R_OK | fs.constants.W_OK);
		return true;
	} catch {
		return false;
	}
}

export function fileExistsSync(filepath: string): boolean {
	return fs.existsSync(filepath);
}

/**
 * Read file by specified filepath;
 */
export function readFile(filepath: string): Promise<string> {
	return fs.promises.readFile(filepath, "utf8");
}

/**
 * Read file by specified filepath;
 */
export function statFile(filepath: string): Promise<fs.Stats> {
	return fs.promises.stat(filepath);
}

export async function realPath(symlink: string): Promise<string> {
	return fs.promises.realpath(symlink);
}
