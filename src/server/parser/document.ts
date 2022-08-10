import type { DocumentContext } from "vscode-css-languageservice";
import { URI, Utils } from "vscode-uri";
import { FileSystemProvider } from "../../shared/file-system";

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
				base.startsWith("file://") // Only support this extra custom resolving in a Node environment
			) {
				const folderUri = getRootFolder();
				if (folderUri) {
					return folderUri + ref.slice(1);
				}
			}
			base = base.substr(0, base.lastIndexOf("/") + 1);
			return Utils.resolvePath(URI.parse(base), ref).toString();
		},
	};
}
