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

@use '../namespace' as ns;

.foo {
  color: ns.
  @include ns.
  --runtime-var: var(--other-var, #{ns.})
}

@use "sass:math";

.foo {
  padding: math.fl
}
</style>
