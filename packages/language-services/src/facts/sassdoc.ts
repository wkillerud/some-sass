import { InsertTextFormat } from "../language-services-types";

interface SassDocAnnotation {
	annotation: string;
	aliases?: string[];
	insertText?: string;
	insertTextFormat?: InsertTextFormat;
}

export const sassDocAnnotations: readonly SassDocAnnotation[] = [
	{
		annotation: "@access",
		insertText: "@access ${1|public,private|}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@alias",
		insertText: "@alias ${1:of-other-item}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@author",
		insertText: "@author ${1:name}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@content",
		insertText: "@content ${1:description}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@deprecated",
	},
	{
		annotation: "@example",
	},
	{
		annotation: "@group",
		insertText: "@group ${1:name}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@ignore",
		insertText: "@ignore ${1:message}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@link",
		insertText: "@link ${1:url}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@name",
		insertText: "@name ${1:custom-name}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@output",
		insertText: "@output ${1:description}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@param",
		insertText: "@param ",
		insertTextFormat: InsertTextFormat.PlainText,
		aliases: ["@arg", "@argument", "@parameter"],
	},
	{
		annotation: "@property",
		aliases: ["@prop"],
		insertText: "@property ",
		insertTextFormat: InsertTextFormat.PlainText,
	},
	{
		annotation: "@require",
		insertText: "@require ",
		insertTextFormat: InsertTextFormat.PlainText,
	},
	{
		annotation: "@return",
		insertText: "@return ${1:description}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@see",
		insertText: "@see ${1:other-item}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@since",
		insertText: "@since ${1:version} ${2:description}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@throw",
		insertText: "@throw ${1:description}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@todo",
		insertText: "@todo ${1:description}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
	{
		annotation: "@type",
		insertText: "@type ${1:type}",
		insertTextFormat: InsertTextFormat.Snippet,
	},
];
