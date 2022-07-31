import fs from "fs";
import path from "path";
import type { DocumentContext } from "vscode-css-languageservice";
import { URI } from "vscode-uri";

/**
 * Returns the path to the document, relative to the current document.
 */
export function getDocumentPath(
	currentPath: string,
	symbolsPath: string | undefined,
): string {
	if (symbolsPath === undefined) {
		throw new Error(
			"Unexpected behaviour. The 'symbolsPath' argument is undefined.",
		);
	}

	const rootUri = path.dirname(currentPath);
	const docPath = path.relative(rootUri, symbolsPath);

	if (docPath === path.basename(currentPath)) {
		return "current";
	}

	return docPath.replace(/\\/g, "/");
}

export const reNewline = /\r\n|\r|\n/;

export function getLinesFromText(text: string): string[] {
	return text.split(reNewline);
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *  See https://github.com/microsoft/vscode/blob/main/LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
function getModuleNameFromPath(path: string) {
	// If a scoped module (starts with @) then get up until second instance of '/', otherwise get until first isntance of '/'
	if (path.startsWith("@")) {
		return path.slice(0, Math.max(0, path.indexOf("/", path.indexOf("/") + 1)));
	}

	return path.slice(0, Math.max(0, path.indexOf("/")));
}

function resolvePathToModule(
	_moduleName: string,
	_relativeTo: string,
): string | undefined {
	// Resolve the module relative to the document. We can't use `require` here as the code is webpacked.
	const documentFolder = path.dirname(URI.parse(_relativeTo).fsPath);
	const packPath = path.join(
		documentFolder,
		"node_modules",
		_moduleName,
		"package.json",
	);
	if (fs.existsSync(packPath)) {
		return URI.file(packPath).toString();
	}

	return undefined;
}

function resolve(from: string, to: string): string {
	const resolvedUrl = new URL(to, new URL(from, "resolve://"));
	if (resolvedUrl.protocol === "resolve:") {
		// `from` is a relative URL.
		const { pathname, search, hash } = resolvedUrl;
		return pathname + search + hash;
	}

	return resolvedUrl.toString();
}

export function buildDocumentContext(
	documentUri: string,
	workspaceRoot: URI,
): DocumentContext {
	function getRootFolder(): string | undefined {
		let folderURI = workspaceRoot.toString();
		if (!folderURI.endsWith("/")) {
			folderURI += "/";
		}

		if (documentUri.startsWith(folderURI)) {
			return folderURI;
		}

		return undefined;
	}

	return {
		resolveReference: (ref, base = documentUri) => {
			if (
				ref.startsWith("/") && // Resolve absolute path against the current workspace folder
				base.startsWith("file://")
			) {
				const folderUri = getRootFolder();
				if (folderUri) {
					return folderUri + ref.slice(1);
				}
			}

			// Following [css-loader](https://github.com/webpack-contrib/css-loader#url)
			// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#imports)
			// convention, if an import path starts with ~ then use node module resolution
			// *unless* it starts with "~/" as this refers to the user's home directory.
			if (ref.startsWith("~") && ref[1] !== "/") {
				ref = ref.slice(1);
				if (base.startsWith("file://")) {
					const moduleName = getModuleNameFromPath(ref);
					const modulePath = resolvePathToModule(moduleName, base);
					if (modulePath) {
						const pathWithinModule = ref.slice(
							Math.max(0, moduleName.length + 1),
						);
						return resolve(modulePath, pathWithinModule);
					}
				}
			}

			return resolve(base, ref);
		},
	};
}
