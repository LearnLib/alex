<template>
  <div class="slide" style="display: none">
    <div class="image">
      <slot name="image"></slot>
    </div>
    <div class="text">
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Slide'
    };
</script>

<style scoped>
</style>
