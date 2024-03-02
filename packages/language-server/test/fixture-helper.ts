import * as path from "path";
import { URI } from "vscode-uri";

function getDocPath(p: string) {
	return path.resolve(__dirname, "./fixtures", p);
}

export function getUri(p: string) {
	return URI.file(getDocPath(p));
}
