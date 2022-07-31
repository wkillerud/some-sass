import { createConnection, ProposedFeatures } from "vscode-languageserver/node";
import { SomeSassServer } from "./server";

const connection = createConnection(ProposedFeatures.all);

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const server = new SomeSassServer(connection);
server.listen();
