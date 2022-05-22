<p class="foo" />

<style lang="scss">
@use '../functions' as *;
@use '../mixins' as *;

.test {
  @include square();
  @include square(1,);

  content: pow() + pow(1,);
}
</style>
