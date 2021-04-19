<template>
  <div class="definition">
    <span class="term">{{term}}</span>
    <slot></slot>
  </div>
</template>

<script>
    export default {
        name: 'Definition',
        props: ['term']
    };
</script>

<style scoped lang="stylus">
  .definition
    padding-left: 1.5em
    text-indent: -1.5em
    margin-bottom: 1rem

    .term
      font-weight: 500
      margin-right: .25rem
</style>
