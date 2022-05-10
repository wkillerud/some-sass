import * as sassdoc from 'sassdoc';

interface ISymbol {
	document?: string;
	info: any;
}

interface ISassDocOptions {
	displayOptions?: {
		access?: boolean;
		author?: boolean;
		content?: boolean;
		deprecated?: boolean;
		description?: boolean;
		example?: boolean;
		output?: boolean;
		parameters?: boolean;
		return?: boolean;
		see?: boolean;
		type?: boolean;
	};
}

const defaultOptions = {
	displayOptions: {
		access: false,
		author: true,
		content: true,
		deprecated: true,
		example: true,
		description: true,
		output: true,
		parameters: true,
		return: true,
		see: true,
		type: true,
	},
};

export async function applySassDoc(symbol: ISymbol, identifierType: "function" | "mixin" | "variable", options?: ISassDocOptions): Promise<string> {
	try {
		const sassdocs = await sassdoc.parse(symbol.document);
		if (sassdocs.length) {
			const name = symbol.info.name.replace("$", "");
			const displayOptions = options?.displayOptions || defaultOptions.displayOptions;

			for (let doc of sassdocs) {
				if (doc.description && doc.context.type === identifierType && doc.context.name === name) {
					let description = '';

					if (displayOptions.description && doc.description) {
						description += doc.description.trimStart();
					}

					if (displayOptions.deprecated && doc.deprecated) {
						description += `\n\n@deprecated \`${doc.deprecated}\``;
					}

					if (displayOptions.access) {
						description += `\n\n@access \`${doc.access}\``;
					}

					if (displayOptions.type && doc.type) {
						description += `\n\n@type {\`${doc.type}\`}`;
					}

					if (displayOptions.parameters && doc.parameter) {
						for (let parameter of doc.parameter) {
							description += `\n\n@param ${parameter.type ? `{${parameter.type}}` : ''} \`${parameter.name}\`${parameter.description ? ` - ${parameter.description}` : ''}`;
						}
					}

					if (displayOptions.content && doc.content) {
						description += `\n\n@content {\`${doc.content}\`}`;
					}

					if (displayOptions.output && doc.output) {
						description += `\n\n@output {\`${doc.output}\`}`;
					}

					if (displayOptions.return && doc.return) {
						description += `\n\n@return {\`${doc.return.type}\`}`;
					}

					if (displayOptions.see && doc.see) {
						description += `\n\n@see {\`${doc.see}\`}`;
					}

					if (displayOptions.author && doc.author) {
						for (let author of doc.author) {
							description += `\n\n@author ${author}`;
						}
					}

					return description;
				}
			}
		}
		return "";

	} catch (e) {
		// Shouldn't happen, but let's not crash the rest of the plugin in case this fails
		return "";
	}
}
