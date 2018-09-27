<template>
  <div class="slides">
    <slot></slot>
    <div class="slide-image">
      <img :src="slides[currentSlide].src" v-if="slides.length > 0"/>
    </div>
    <div class="slide-content" v-html="slides[currentSlide].content" v-if="slides.length > 0"></div>
    <div class="slide-navigation">
      <div class="indicator">
        <span>{{currentSlide + 1}} / {{slides.length}}</span>
      </div>
      <div class="buttons">
        <button @click="previousSlide" v-if="currentSlide > 0">&laquo; Previous</button>
        <button @click="nextSlide" v-if="currentSlide < slides.length - 1">Next &raquo;</button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Slides',
        data() {
            return {
                slides: [],
                currentSlide: 0
            };
        },
        created() {
            this.$nextTick(() => {
                const slides = this.$el.querySelectorAll('.slide');
                slides.forEach(slide => {
                    this.slides.push({
                        src: slide.querySelector('.image img').getAttribute('data-src'),
                        content: slide.querySelector('.text').innerHTML
                    });
                });
            });
        },
        methods: {
            previousSlide() {
                this.currentSlide = Math.max(0, this.currentSlide - 1);
            },
            nextSlide() {
                this.currentSlide = Math.min(this.slides.length - 1, this.currentSlide + 1);
            },
        }
    };
</script>

<style scoped lang="sass">
  .slides
    background: #fff
    border: 1px solid #dedede
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)
    margin: 1rem 0

    .slide-image
      img
        display: block
        max-width: 100%
        margin: auto

    .slide-content
      padding: 1rem
      border-bottom: 1px solid #dedede
      border-top: 1px solid #dedede

    .slide-navigation
      display: flex
      align-items: baseline
      padding: 0 .5rem
      background: #fbfbfb

      .indicator
        width: 100%
        margin-left: .5rem
        color: #8a8a8a

      .buttons
        flex-shrink: 0

      button
        display: inline-block
        outline: none
        border: none
        background: none
        padding: .5rem .75rem
        margin: .5rem 0
        font-weight: 700
        cursor: pointer
        border-radius: 2rem
        color: #8a8a8a

        &:hover
          background: #3faf7b
          color: #fff
</style>
