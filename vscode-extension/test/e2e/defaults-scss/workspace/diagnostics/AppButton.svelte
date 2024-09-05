<p class="foo" />

<style lang="scss">
@use './helpers' as *;

/// @deprecated Use something else
$_old-private-variable: 1px;

.test {
  content: $old-variable + old-function();

  @include old-mixin();

  content: $_old-private-variable;
}
</style>
