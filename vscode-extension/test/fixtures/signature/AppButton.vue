<template>
  <p class="foo"></p>
</template>

<script>
export default {};
</script>

<style lang="scss">
@use '../functions' as *;
@use '../mixins' as *;

.test {
  @include square();
  @include square(1,);

  content: pow() + pow(1,);
}

@use '../namespace' as ns;

.foo {
  @include ns.mix-mix-square();
  @include ns.mix-mix-square(1,);

  content: ns.fun-fun-pow() + ns.fun-fun-pow(1,);
}

</style>
