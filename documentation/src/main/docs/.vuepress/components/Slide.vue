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
        name: 'Slide',
        props: ['title'],
        mounted() {
            const img = this.$el.querySelector('img');
            const src = img.src;
            img.src = '';
            img.setAttribute('data-src', src);

            if (this.title != null) {
                img.setAttribute('data-title', this.title);
            }
        }
    };
</script>

<style scoped>
</style>
