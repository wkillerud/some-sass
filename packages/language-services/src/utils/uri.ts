import { URI } from "../language-services-types";

/**
 * Gets the name of the file or folder the URI points to.
 * Use with {@link FileSystemProvider.readDirectory} to get
 * names like you may expect them from Node's readdir.
 */
export function getName(uri: URI): string {
	let uriString = uri.toString();
	if (uriString.endsWith("/")) {
		uriString = uriString.slice(0, uriString.length - 1);
	}
	return uriString.substring(uriString.lastIndexOf("/") + 1);
}
