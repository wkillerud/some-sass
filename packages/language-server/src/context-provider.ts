import { ClientCapabilities } from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import { FileSystemProvider } from "./file-system";
import { IEditorSettings, ISettings } from "./settings";
import StorageService from "./storage";

export type SomeSassContext = {
	workspaceRoot: URI;
	clientCapabilities: ClientCapabilities;
	fs: FileSystemProvider;
	settings: ISettings;
	editorSettings: IEditorSettings;
	storage: StorageService;
};

let context: SomeSassContext;

export const createContext = (ctx: SomeSassContext): void => {
	context = ctx;
};

export const changeConfiguration = (settings: ISettings): void => {
	if (!context) {
		return;
	}
	context.settings = settings;
};

export const useContext = (): SomeSassContext => context;
