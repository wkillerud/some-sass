import ColorDotJS from "colorjs.io";

export function isColor(value: string): string | null {
	try {
		ColorDotJS.parse(value);
		// Yup, it's color.
		return value;
	} catch (e) {
		return null;
	}
	return null;
}
