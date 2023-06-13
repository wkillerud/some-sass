import type { ScssSymbol } from "../parser";

export function applySassDoc(symbol: ScssSymbol): string {
	if (!symbol.sassdoc) {
		return "";
	}

	let description = "";
	const doc = symbol.sassdoc;

	if (doc.description) {
		description += doc.description.trimStart();
	}

	// Make it visible early on if something is marked as deprecated
	if (doc.deprecated) {
		description += `\n\n@deprecated ${doc.deprecated}`;
	}

	// Function and mixin parameters, listed one per line like JSDoc
	if (doc.parameter) {
		for (const parameter of doc.parameter) {
			description += "\n\n@param";

			if (parameter.type) {
				description += ` ${parameter.type}`;
			}

			description += `\`${parameter.name}\``;

			if (parameter.default) {
				description += ` [${parameter.default}]`;
			}

			if (parameter.description) {
				description += ` - ${parameter.description}`;
			}
		}
	}

	// Type is for standalone variable annotation
	// Type and Parameters is likely mutually exclusive
	if (doc.type) {
		description += `\n\n@type ${doc.type}`;
	}

	// Documents the properties of a map
	if (doc.property) {
		for (const prop of doc.property) {
			description += "\n\n@prop";

			if (prop.type) {
				description += ` {${prop.type}}`;
			}

			description += `\`${prop.path}\``;

			if (prop.default) {
				description += ` [${prop.default}]`;
			}

			if (prop.description) {
				description += ` - ${prop.description}`;
			}
		}
	}

	// For mixins that take @content
	if (doc.content) {
		description += `\n\n@content ${doc.content}`;
	}

	// Describes mixin output
	if (doc.output) {
		description += `\n\n@output ${doc.output}`;
	}

	// Describes function return values with a type and optional description
	if (doc.return) {
		description += `\n\n@return ${doc.return.type}${
			doc.return.description ? ` - ${doc.return.description}` : ""
		}`;
	}

	if (doc.throws) {
		for (const thrown of doc.throws) {
			description += `\n\n@throw ${thrown}`;
		}
	}

	if (doc.require && doc.require.length > 0) {
		for (const requirement of doc.require) {
			description += "\n\n@require";

			if (requirement.type) {
				description += ` {${requirement.type}}`;
			}

			description += `\`${requirement.name}\``;

			if (requirement.description) {
				description += ` - ${requirement.description}`;
			}

			if (requirement.url) {
				description += ` ${requirement.url}`;
			}
		}
	}

	if (doc.alias) {
		const aliases = typeof doc.alias === "string" ? [doc.alias] : doc.alias;
		for (const alias of aliases) {
			description += `\n\n@alias \`${alias}\``;
		}
	}

	// Hint to related variables, functions, or mixins
	if (doc.see) {
		for (const see of doc.see) {
			description += `\n\n@see \`${see.name}\``;
		}
	}

	if (doc.since) {
		for (const since of doc.since) {
			description += `\n\n@since ${since.version}`;
			if (since.description) {
				description += ` - ${since.description}`;
			}
		}
	}

	// Show credit to authors
	if (doc.author) {
		for (const author of doc.author) {
			description += `\n\n@author ${author}`;
		}
	}

	if (doc.link) {
		for (const link of doc.link) {
			description += link.caption
				? `\n\n[${link.caption}](${link.url})`
				: `\n\n${link.url}`;
		}
	}

	if (doc.example) {
		for (const example of doc.example) {
			description += "\n\n@example";
			if (example.description) {
				description += ` ${example.description}`;
			}

			description += ["\n", "```scss", example.code, "```"].join("\n");
		}
	}

	return description;
}
