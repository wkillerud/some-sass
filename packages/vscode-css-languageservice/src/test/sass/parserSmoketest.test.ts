import fs from "node:fs/promises";
import path from "node:path";
import { test } from "vitest";
import { SassParser } from "../../parser/sassParser";
import { assertNode } from "../css/parser.test";

test("SCSS parser handles example stylesheet", async () => {
	const parser = new SassParser({ syntax: "scss" });
	const stylesheet = await fs.readFile(path.join(__dirname, "example.scss"), "utf-8");
	assertNode(stylesheet, parser, parser._parseStylesheet.bind(parser));
});

test("Indented parser handles example stylesheet", async () => {
	const parser = new SassParser({ syntax: "indented" });
	const stylesheet = await fs.readFile(path.join(__dirname, "example.sass"), "utf-8");
	assertNode(stylesheet, parser, parser._parseStylesheet.bind(parser));
});
