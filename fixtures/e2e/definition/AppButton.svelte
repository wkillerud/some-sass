<p class="foo" />

<style lang="scss">
@use '../functions' as *;
@use '../mixins' as *;
@use '../variables' as *;

.test {
  content: $variable + function();

  @include mixin();
}
</style>
