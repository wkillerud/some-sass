import { createConnection, ProposedFeatures } from "vscode-languageserver/node";
import { NodeFileSystem } from "./node-file-system";
import { SomeSassServer } from "./server";

const connection = createConnection(ProposedFeatures.all);

/* eslint-disable no-console */
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
/* eslint-enable no-console */

const runtime = { file: new NodeFileSystem() };
const server = new SomeSassServer(connection, runtime);

server.listen();
