# Automated tests

This document describes how to run the automated tests and what the different tests cover.

## Unit tests

All packages in `packages/` have unit tests. To run them:

```sh
npm run test
```

The main test runner is [Vitest]. `vscode-css-languageservice` uses [Mocha].

Unit tests typically cover either a utility function or a language feature such as `doHover`. For language features the tests are typically split in several files, each focusing on part of the functionality of the language feature.

## End-to-end tests

The Visual Studio Code extension includes end-to-end tests. To run them:

```sh
npm run test:e2e
```

It also includes end-to-end tests for the web extension. To run them:

```sh
npm run test:web
```

The end-to-end tests have some overlap with the unit tests for language features, but are useful to confirm the communication between client and server works as expected.

## Run all tests

A convenience script lets you run all unit tests and end-to-end tests:

```sh
npm run test:all
```

[Vitest]: https://vitest.dev/
[Mocha]: https://mochajs.org/
