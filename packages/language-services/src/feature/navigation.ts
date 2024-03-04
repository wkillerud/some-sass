import {
	type DocumentContext,
	type LanguageServiceOptions,
	type Stylesheet,
	AliasSettings,
	SyntaxNodeTypes,
	DocumentLink,
	TextDocument,
	Range,
	URI,
	DocumentUri,
	Utils,
} from "@somesass/language-server-types";
import { dirname, joinPath } from "../utils/resources";

type UnresolvedLink = {
	link: DocumentLink;
	/**
	 * `true` if the link is to a Sass module, as opposed to for instance url()
	 */
	isModuleLink: boolean;
};

const startsWithSchemeRegex = /^\w+:\/\//;
const startsWithData = /^data:/;
const sassLangFile = /\.(sass|scss)$/;

export class SassNavigation {
	#aliasSettings: AliasSettings | undefined = undefined;
	#languageServerOptions: LanguageServiceOptions;

	constructor(options: LanguageServiceOptions) {
		this.#languageServerOptions = options;
	}

	configure(settings?: AliasSettings): void {
		this.#aliasSettings = settings;
	}

	async findDocumentLinks(
		document: TextDocument,
		stylesheet: Stylesheet,
		documentContext: DocumentContext,
	): Promise<DocumentLink[]> {
		const linkNodeTypeNames: string[] = [
			SyntaxNodeTypes.UseStatement,
			SyntaxNodeTypes.ForwardStatement,
			SyntaxNodeTypes.ImportStatement,
		];

		const source = document.getText();
		const cursor = stylesheet.cursor();

		const unresolvedLinks: UnresolvedLink[] = [];
		while (cursor.next()) {
			const isModuleLink = linkNodeTypeNames.includes(cursor.node.type.name);
			if (
				isModuleLink ||
				cursor.node.type.name === SyntaxNodeTypes.CallLiteral
			) {
				const innerCursor = cursor.node.cursor();
				while (innerCursor.next()) {
					if (
						innerCursor.node.type.name ===
							SyntaxNodeTypes.ParenthesizedContent ||
						innerCursor.node.type.name === SyntaxNodeTypes.StringLiteral
					) {
						const from = innerCursor.node.from;
						const to = innerCursor.node.to;
						unresolvedLinks.push(
							this.toUnresolvedLink(source, from, to, document, isModuleLink),
						);
						break;
					}
				}
			}
		}

		const resolvedLinks: DocumentLink[] = [];
		for (const unresolved of unresolvedLinks) {
			const link = unresolved.link;
			const target = link.target;
			if (!target || startsWithData.test(target)) {
				// no links for data:
			} else if (startsWithSchemeRegex.test(target)) {
				resolvedLinks.push(link);
			} else {
				const resolvedTarget = await this.resolveReference(
					target,
					document.uri,
					documentContext,
					unresolved.isModuleLink,
				);
				if (resolvedTarget !== undefined) {
					link.target = resolvedTarget;
					resolvedLinks.push(link);
				}
			}
		}
		return resolvedLinks;
	}

	protected toUnresolvedLink(
		source: string,
		from: number,
		to: number,
		document: TextDocument,
		isModuleLink: boolean,
	): UnresolvedLink {
		let target = source.substring(from, to);
		if (target.startsWith(`'`) || target.startsWith(`"`)) {
			target = target.slice(1, -1);
		}

		return {
			link: {
				target,
				range: Range.create(document.positionAt(from), document.positionAt(to)),
			},
			isModuleLink,
		};
	}

	protected async mapReference(
		target: string | undefined,
		isModuleLink: boolean,
	): Promise<string | undefined> {
		if (
			this.#languageServerOptions.fileSystemProvider &&
			target &&
			isModuleLink
		) {
			const pathVariations = this.toPathVariations(target);
			for (const variation of pathVariations) {
				if (await this.fileExists(variation)) {
					return variation;
				}
			}
		}
		return target;
	}

	protected async resolveReference(
		target: string,
		documentUri: string,
		documentContext: DocumentContext,
		isModuleLink = false,
		settings = this.#aliasSettings,
	): Promise<string | undefined> {
		if (target.startsWith("sass:")) {
			// Sass built-in
			return undefined;
		}

		// Following [css-loader](https://github.com/webpack-contrib/css-loader#url)
		// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#imports)
		// convention, if an import path starts with ~ then use node module resolution
		// *unless* it starts with "~/" as this refers to the user's home directory.
		if (
			target[0] === "~" &&
			target[1] !== "/" &&
			this.#languageServerOptions.fileSystemProvider
		) {
			target = target.substring(1);
			return this.mapReference(
				await this.resolveModuleReference(target, documentUri, documentContext),
				isModuleLink,
			);
		}

		// Following the [sass package importer](https://github.com/sass/sass/blob/f6832f974c61e35c42ff08b3640ff155071a02dd/js-api-doc/importer.d.ts#L349),
		// look for the `exports` field of the module and any `sass`, `style` or `default` that matches the import.
		// If it's only `pkg:module`, also look for `sass` and `style` on the root of package.json.
		if (target.startsWith("pkg:")) {
			return this.resolvePkgModulePath(target, documentUri, documentContext);
		}

		const ref = await this.mapReference(
			documentContext.resolveReference(target, documentUri),
			isModuleLink,
		);

		// Following [less-loader](https://github.com/webpack-contrib/less-loader#imports)
		// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules)
		// new resolving import at-rules (~ is deprecated). The loader will first try to resolve @import as a relative path. If it cannot be resolved,
		// then the loader will try to resolve @import inside node_modules.
		if (ref && (await this.fileExists(ref))) {
			return ref;
		}

		const moduleReference = await this.mapReference(
			await this.resolveModuleReference(target, documentUri, documentContext),
			isModuleLink,
		);
		if (moduleReference) {
			return moduleReference;
		}

		// Try resolving the reference from the language configuration alias settings
		if (ref && !(await this.fileExists(ref))) {
			const rootFolderUri = documentContext.resolveReference("/", documentUri);
			if (settings && rootFolderUri) {
				// Specific file reference
				if (target in settings) {
					return this.mapReference(
						joinPath(rootFolderUri, settings[target]),
						isModuleLink,
					);
				}
				// Reference folder
				const firstSlash = target.indexOf("/");
				const prefix = `${target.substring(0, firstSlash)}/`;
				if (prefix in settings) {
					const aliasPath = settings[prefix].slice(0, -1);
					let newPath = joinPath(rootFolderUri, aliasPath);
					return this.mapReference(
						(newPath = joinPath(newPath, target.substring(prefix.length - 1))),
						isModuleLink,
					);
				}
			}
		}

		// fall back. it might not exists
		return ref;
	}

	protected async resolveModuleReference(
		ref: string,
		documentUri: string,
		documentContext: DocumentContext,
	): Promise<string | undefined> {
		if (documentUri.startsWith("file://")) {
			const moduleName = this.getModuleNameFromPath(ref);
			if (moduleName && moduleName !== "." && moduleName !== "..") {
				const rootFolderUri = documentContext.resolveReference(
					"/",
					documentUri,
				);
				const documentFolderUri = dirname(documentUri);
				const modulePath = await this.resolvePathToModule(
					moduleName,
					documentFolderUri,
					rootFolderUri,
				);
				if (modulePath) {
					const pathWithinModule = ref.substring(moduleName.length + 1);
					return joinPath(modulePath, pathWithinModule);
				}
			}
		}
		return undefined;
	}

	protected async resolvePathToModule(
		_moduleName: string,
		documentFolderUri: string,
		rootFolderUri: string | undefined,
	): Promise<string | undefined> {
		// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

		const packPath = joinPath(
			documentFolderUri,
			"node_modules",
			_moduleName,
			"package.json",
		);
		if (await this.fileExists(packPath)) {
			return dirname(packPath);
		} else if (
			rootFolderUri &&
			documentFolderUri.startsWith(rootFolderUri) &&
			documentFolderUri.length !== rootFolderUri.length
		) {
			return this.resolvePathToModule(
				_moduleName,
				dirname(documentFolderUri),
				rootFolderUri,
			);
		}
		return undefined;
	}

	protected getModuleNameFromPath(path: string) {
		const firstSlash = path.indexOf("/");
		if (firstSlash === -1) {
			return "";
		}

		// If a scoped module (starts with @) then get up until second instance of '/', or to the end of the string for root-level imports.
		if (path[0] === "@") {
			const secondSlash = path.indexOf("/", firstSlash + 1);
			if (secondSlash === -1) {
				return path;
			}
			return path.substring(0, secondSlash);
		}
		// Otherwise get until first instance of '/'
		return path.substring(0, firstSlash);
	}

	protected async resolvePkgModulePath(
		target: string,
		documentUri: string,
		documentContext: DocumentContext,
	): Promise<string | undefined> {
		const bareTarget = target.replace("pkg:", "");
		const moduleName = bareTarget.includes("/")
			? this.getModuleNameFromPath(bareTarget)
			: bareTarget;
		const rootFolderUri = documentContext.resolveReference("/", documentUri);
		const documentFolderUri = dirname(documentUri);
		const modulePath = await this.resolvePathToModule(
			moduleName,
			documentFolderUri,
			rootFolderUri,
		);
		if (modulePath) {
			const packageJsonPath = `${modulePath}/package.json`;
			if (packageJsonPath) {
				// Since submodule exports import strings don't match the file system,
				// we need the contents of `package.json` to look up the correct path.
				const packageJsonContent = await this.getContent(packageJsonPath);
				if (packageJsonContent) {
					const packageJson: {
						style?: string;
						sass?: string;
						exports: Record<string, string | Record<string, string>>;
					} = JSON.parse(packageJsonContent);

					const subpath = bareTarget.substring(moduleName.length + 1);
					if (packageJson.exports) {
						if (!subpath) {
							// look for the default/index export
							const entry = this.getSubpathEntry(packageJson.exports["."]);
							// the 'default' entry can be whatever, typically .js – confirm it looks like Sass
							if (entry && entry.match(sassLangFile)) {
								const entryPath = joinPath(modulePath, entry);
								return entryPath;
							}
						} else {
							// The import string may be with or without .scss.
							// Likewise the exports entry. Look up both paths.
							// However, they need to be relative (start with ./).
							const lookupSubpath = subpath.match(sassLangFile)
								? `./${subpath.replace(sassLangFile, "")}`
								: `./${subpath}`;
							const lookupSubpathScss = subpath.match(sassLangFile)
								? `./${subpath}`
								: `./${subpath}.scss`;
							const lookupSubpathSass = subpath.match(sassLangFile)
								? `./${subpath}`
								: `./${subpath}.sass`;

							const subpathObject =
								packageJson.exports[lookupSubpath] ||
								packageJson.exports[lookupSubpathScss] ||
								packageJson.exports[lookupSubpathSass];

							if (subpathObject) {
								const entry = this.getSubpathEntry(subpathObject);

								// the 'default' entry can be whatever, typically .js – confirm it looks like Sass
								if (entry && entry.match(sassLangFile)) {
									const entryPath = joinPath(modulePath, entry);
									return entryPath;
								}
							} else {
								// We have a subpath, but found no matches on direct lookup.
								// It may be a [subpath pattern](https://nodejs.org/api/packages.html#subpath-patterns).
								for (const [maybePattern, subpathObject] of Object.entries(
									packageJson.exports,
								)) {
									if (!maybePattern.includes("*")) {
										continue;
									}
									// Patterns may also be without file extensions on the left side, so compare without on both sides
									const re = new RegExp(
										maybePattern
											.replace("./", "\\./")
											.replace(sassLangFile, "")
											.replace("*", "(.+)"),
									);
									const match = re.exec(lookupSubpath);
									if (match) {
										const entry = this.getSubpathEntry(subpathObject);

										// the 'default' entry can be whatever, typically .js – confirm it looks like `scss`
										if (entry && entry.match(sassLangFile)) {
											// The right-hand side of a subpath pattern is also a pattern.
											// Replace the pattern with the match from our regexp capture group above.
											const expandedPattern = entry.replace("*", match[1]);
											const entryPath = joinPath(modulePath, expandedPattern);
											return entryPath;
										}
									}
								}
							}
						}
					} else if (!subpath && (packageJson.sass || packageJson.style)) {
						// Fall back to a direct lookup on `sass` and `style` on package root
						const entry = packageJson.sass || packageJson.style;
						if (entry) {
							const entryPath = joinPath(modulePath, entry);
							return entryPath;
						}
					}
				}
			}
		}
		return undefined;
	}

	protected async fileExists(uri: string): Promise<boolean> {
		if (!this.#languageServerOptions.fileSystemProvider) {
			return false;
		}
		try {
			const exists =
				await this.#languageServerOptions.fileSystemProvider.exists(
					URI.parse(uri),
				);
			return exists;
		} catch (err) {
			return false;
		}
	}

	protected async getContent(uri: string): Promise<string | null> {
		if (!this.#languageServerOptions.fileSystemProvider) {
			return null;
		}
		try {
			return await this.#languageServerOptions.fileSystemProvider.readFile(
				URI.parse(uri),
			);
		} catch (err) {
			return null;
		}
	}

	protected toPathVariations(target: string): DocumentUri[] {
		// No variation for links that ends with .css suffix
		if (target.endsWith(".css")) {
			return [target];
		}

		// If a link is like a/, try resolving a/index.scss, a/_index.scss, a/index.sass and a/_index.sass
		if (target.endsWith("/")) {
			return [
				target + "index.scss",
				target + "_index.scss",
				target + "index.sass",
				target + "_index.sass",
			];
		}

		const targetUri = URI.parse(target.replace(/\.s[ac]ss$/, ""));
		const basename = Utils.basename(targetUri);
		const dirname = Utils.dirname(targetUri);
		if (basename.startsWith("_")) {
			// No variation for links such as _a
			return [
				Utils.joinPath(dirname, basename + ".scss").toString(true),
				Utils.joinPath(dirname, basename + ".sass").toString(true),
			];
		}

		const variants = [
			Utils.joinPath(dirname, basename + ".scss").toString(true),
			Utils.joinPath(dirname, "_" + basename + ".scss").toString(true),
			target + "/index.scss",
			target + "/_index.scss",
			Utils.joinPath(dirname, basename + ".sass").toString(true),
			Utils.joinPath(dirname, "_" + basename + ".sass").toString(true),
			target + "/index.sass",
			target + "/_index.sass",
			Utils.joinPath(dirname, basename + ".css").toString(true),
		];
		return variants;
	}

	protected getSubpathEntry(
		subpathObject: string | Record<string, unknown>,
	): string | undefined {
		return (
			// @ts-expect-error If subpathObject is a string this just produces undefined
			subpathObject["sass"] ||
			// @ts-expect-error If subpathObject is a string this just produces undefined
			subpathObject["styles"] ||
			// @ts-expect-error If subpathObject is a string this just produces undefined
			subpathObject["default"]
		);
	}
}
