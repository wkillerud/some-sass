import { MarkupContent } from "@somesass/language-server-types";

export type EntryStatus =
	| "standard"
	| "experimental"
	| "nonstandard"
	| "obsolete";

export interface IReference {
	name: string;
	url: string;
}

export interface IPropertyData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	restrictions?: string[];
	status?: EntryStatus;
	syntax?: string;
	values?: IValueData[];
	references?: IReference[];
	relevance?: number;
	atRule?: string;
}

export interface IAtDirectiveData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
	references?: IReference[];
}

export interface IPseudoClassData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
	references?: IReference[];
}

export interface IPseudoElementData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
	references?: IReference[];
}

export interface IValueData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
	references?: IReference[];
}

export interface ICSSDataProvider {
	provideProperties(): IPropertyData[];
	provideAtDirectives(): IAtDirectiveData[];
	providePseudoClasses(): IPseudoClassData[];
	providePseudoElements(): IPseudoElementData[];
}

export interface CSSDataV1 {
	version: 1 | 1.1;
	properties?: IPropertyData[];
	atDirectives?: IAtDirectiveData[];
	pseudoClasses?: IPseudoClassData[];
	pseudoElements?: IPseudoElementData[];
}
