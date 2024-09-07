# Testing in other editors

While it's recommended to use Visual Studio Code or VSCodium, you can use other editors to test and debug the language server.

In this document we'll look at how we can test our local development build in the Helix editor.

## Install the local version globally

To make the local version of `some-sass-language-server` available on `PATH`, go to its directory and run `npm install --global .`.

```sh
cd packages/language-server/
npm install --global .
```

Editors using Some Sass from `PATH` now use your local build.

## Check the logs

In Helix, run the `hx` command with the `-v` verbose flag. Do your test, and then run the `:log-open` command to see the traffic between server and client.
