<p class="foo"></p>

<style lang="scss">
$color: blue;
$fonts: -apple-system;

.foo {
  color: $;
}

@import "~foo/bar.scss";

.foo {
  color: $;
}

@import "./partial";

.foo {
  color: $;
}

@use '../variables' as var;

.foo {
  color: var.
}

</style>
