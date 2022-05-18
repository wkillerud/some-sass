<template>
  <p class="foo"></p>
</template>

<script>
export default {};
</script>

<style lang="scss">
@use "../functions" as *;
@use "../mixins" as *;
@use "../variables" as *;

.test {
  content: $variable + function();

  @include mixin();
}
</style>
