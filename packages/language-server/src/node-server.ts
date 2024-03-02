import { createConnection, ProposedFeatures } from "vscode-languageserver/node";
import { NodeFileSystem } from "./node-file-system";
import { SomeSassServer } from "./server";

const connection = createConnection(ProposedFeatures.all);

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const runtime = { file: new NodeFileSystem() };
const server = new SomeSassServer(connection, runtime);

server.listen();
