import {
	Sassdoc,
	SassdocDescription,
	SassdocAccess,
	SassdocAlias,
	SassdocAuthor,
	SassdocContent,
	SassdocDeprecated,
	SassdocExample,
	SassdocGroup,
	SassdocGroupDescription,
	SassdocIgnore,
	SassdocLink,
	SassdocName,
	SassdocOutput,
	SassdocParameter,
	SassdocProperty,
	SassdocRequire,
	SassdocReturn,
	SassdocSee,
	SassdocSince,
	SassdocThrow,
	SassdocTodo,
	SassdocType,
} from "./parser.terms.js";

const spaces = [
	9, 11, 12, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199,
	8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
];
const newlines = [10, 13];
const whitespace = [...newlines, ...spaces];
const slash = 47;

/**
 * Starts right after the first /// of the Sassdoc block.
 * @param {import("@lezer/lr").InputStream} input
 */
export function readSassdoc(input) {
	/* Looking for:
	 SassdocDescription |
	SassdocAccessAnnotation |
	SassdocAccess |
	SassdocAliasAnnotation |
	SassdocAlias |
	SassdocAuthorAnnotation |
	SassdocAuthor |
	SassdocContentAnnotation |
	SassdocContent |
	SassdocDeprecatedAnnotation |
	SassdocDeprecated |
	SassdocExampleAnnotation |
	SassdocExampleLanguage |
	SassdocExampleDescription |
	SassdocExample |
	SassdocGroupAnnotation |
	SassdocGroup |
	SassdocGroupDescription |
	SassdocIgnoreAnnotation |
	SassdocIgnore |
	SassdocLinkAnnotation |
	SassdocLink |
	SassdocNameAnnotation |
	SassdocName |
	SassdocOutputAnnotation |
	SassdocOutput |
	SassdocParameterAnnotation |
	SassdocParameter |
	SassdocPropertyAnnotation |
	SassdocProperty |
	SassdocRequireAnnotation |
	SassdocRequire |
	SassdocReturnAnnotation |
	SassdocReturn |
	SassdocSeeAnnotation |
	SassdocSee |
	SassdocSinceAnnotation |
	SassdocSince |
	SassdocThrowAnnotation |
	SassdocThrow |
	SassdocTodoAnnotation,
	SassdocTodo |
	SassdocTypeAnnotation |
	SassdocType
	*/
	while (input.next >= 0) {
		let { next } = input;
		input.advance();
		if (newlines.includes(next) && spaces.includes(input.next)) {
			do {
				input.advance();
			} while (spaces.includes(input.next));

			if (input.next !== slash) {
				break;
			}
		}
	}
}
