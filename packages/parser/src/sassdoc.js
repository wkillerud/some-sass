import { Parser } from "@lezer/common";
import { parseSync as parseSassdoc } from "scss-sassdoc-parser";

// start with one nodeType: SassDocBlock

class SassdocParser extends Parser {}

export const parser = new SassdocParser();
