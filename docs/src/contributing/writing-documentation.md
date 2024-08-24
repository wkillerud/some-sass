# Writing documentation

Help others get the most out of their software by contributing to documentation.

- Do you have a pro tip you want to share?
- Did you take a screenshot that can help visualize something?

New contributors are especially welcome to write documentation and add examples. As a new contributor you know best what is confusing or difficult.

## Quick start

Fork and clone the repository from [GitHub][repo]. The documentation is in the `docs/src/` folder.

```sh
git clone git@github.com:wkillerud/some-sass.git
```

Once you're happy, commit the changes and prefix the commit message with `docs:`

```sh
git commit -m "docs: add GIF demoing Go to definition"
```

### Preview the documentation

You need [mdbook] to preview the documentation on your machine.

If you're on macOS and use [Homebrew][brew] you can `brew install mdbook`. Otherwise, check the [mdbook user guide](https://rust-lang.github.io/mdBook/guide/installation.html).

Once you have it installed, open a terminal and navigate to the `docs/` directory.

```sh
cd docs
mdbook serve --open
```

Changes you make in Markdown files in `docs/src/` are live updated in the browser.

## Who we are writing for

We write for three different groups:

1. Stylesheet developers who use Some Sass
2. Users of editors other than Visual Studio Code who want to use Some Sass
3. Developers who want to fix a bug or add to Some Sass

Each group should find sections and chapters in the sidebar to help guide them to what they are looking for.

### Writing for stylesheet developers

A stylesheet developer doesn't need to learn about the inner workings of Some Sass. They are here to learn what the tool can do, or because something is not matching their expectations.

Introduce the reader to recommended settings early, including settings for the editor itself.

#### Screenshots and recordings

Show what you explained in writing using one or more [screenshots](https://rust-lang.github.io/mdBook/format/markdown.html#images) if you can. Media should come after the paragraph explaining a feature.

If something is better conveyed in a screen recording, prefer an image format like GIF over video. Recordings should be short and showcase one thing. The quality must be good enough that text is legible. For an example, see the [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) documentation in Visual Studio Code.

### Writing for users of editors other than Visual Studio Code

Users of editors other than Visual Studio Code who want to use Some Sass need to know:

1. That it's possible to do so
2. How to do it

Assume the reader is new to the language server protocol and has never configured a language server client. Examples are a great help here.

### Writing for developers who want to change or add to Some Sass

Here we need to consider both new and returning developers.

#### Onboarding

For new developers:

- Assume the reader has never written an extension for Visual Studio Code.
- Assume the reader is new to the Language Server Protocol.

Introduce new contributors to these topics, and link to external material if they want to learn more. Also introduce the architecture so they have a better idea of where to start. Visualize with diagrams.

Explain how they should set up their development environment to be productive.

#### Guides

All developers (including your future self) could use a guide for common tasks like testing and debugging. This documentation can assume the reader completed the onboarding.

## Writing style guide

These are more guidelines than actual rules.

- The first time you reference Visual Studio Code below a heading, write out the full name. After that you can use VS Code.
- Prefer [Excalidraw][excalidraw] for diagrams, exported as PNG and included in Markdown as [an image][images].

[brew]: https://brew.sh
[mdbook]: https://rust-lang.github.io/mdBook/
[installation]: https://rust-lang.github.io/mdBook/guide/installation.html
[repo]: https://github.com/wkillerud/some-sass
[excalidraw]: https://excalidraw.com
[images]: https://rust-lang.github.io/mdBook/format/markdown.html#images
[gtechwriting]: https://www.williamkillerud.com/blog/notes-from-google-technical-writing-one/
