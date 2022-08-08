import { dirname, join } from "path";
import type { DocumentContext } from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import { FileSystemProvider } from "../../shared/file-system";
import type { NodeFileSystem } from "../../shared/node-file-system";

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
	moduleName: string,
	relativeTo: string,
	fs: FileSystemProvider,
): string | undefined {
	// Resolve the module relative to the document. We can't use `require` here as the code is webpacked.
	// fsPath use is OK here since we never reach this function unless the URI is a file://.
	const documentFolder = dirname(URI.parse(relativeTo).fsPath);

	// Assume this path exists. If not, let VS Code deal with the "404" and have the user fix a typo or install node_modules.
	const packPath = join(
		documentFolder,
		"node_modules",
		moduleName,
		"package.json",
	);

	if (Object.prototype.hasOwnProperty.call(fs, "existsSync")) {
		if ((fs as NodeFileSystem).existsSync(packPath)) {
			return URI.file(packPath).toString();
		}
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
	fs: FileSystemProvider,
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
				base.startsWith("file://") // Only support this extra custom resolving in a Node environment
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
					const modulePath = resolvePathToModule(moduleName, base, fs);
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
