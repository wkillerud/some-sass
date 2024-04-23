/** Strips the dollar prefix off a variable name */
export function asDollarlessVariable(variable: string): string {
	return variable.replace(/^\$/, "");
}
