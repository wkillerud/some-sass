import * as sassdoc from 'sassdoc';

interface ISymbol {
	document?: string;
	info: any;
}

interface ISassDocOptions {
	displayOptions?: {
		asDocString?: boolean;
		description?: boolean;
		author?: boolean;
		access?: boolean;
		parameters?: boolean;
		return?: boolean;
	};
}

const defaultOptions = {
	displayOptions: {
		description: true,
		author: true,
		access: false,
		parameters: true,
		return: true,
		see: true,
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

					if (displayOptions.description) {
						description += doc.description.trimStart();
					}

					if (displayOptions.author && doc.author) {
						for (let author of doc.author) {
							description += `\n\n@author ${author}`;
						}
					}

					if (displayOptions.access) {
						description += `\n\n@access \`${doc.access}\``;
					}

					if (displayOptions.parameters && doc.parameter) {
						for (let parameter of doc.parameter) {
							description += `\n\n@param ${parameter.type ? `{${parameter.type}}` : ''} \`${parameter.name}\`${parameter.description ? ` - ${parameter.description}` : ''}`;
						}
					}

					if (displayOptions.return && doc.return) {
						description += `\n\n@return {\`${doc.return.type}\`}`;
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
