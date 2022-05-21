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

</style>
