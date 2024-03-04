import { Position, Range } from "vscode-languageserver-types";

export function newRange(start: number, end: number) {
	return Range.create(Position.create(0, start), Position.create(0, end));
}
