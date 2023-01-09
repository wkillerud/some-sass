import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createConnection,
} from "vscode-languageserver/browser";
import { SomeSassServer } from "./server";

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);

const runtime = {};
const server = new SomeSassServer(connection, runtime);

server.listen();
