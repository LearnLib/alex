(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{396:function(t,e,i){var n=i(0),s=i(44),l=i(4),r=i(67),c=i(69),u=i(204),d=/MSIE .\./.test(r),o=n.Function,a=function(t){return d?function(e,i){var n=u(arguments.length,1)>2,r=l(e)?e:o(e),d=n?c(arguments,2):void 0;return t(n?function(){s(r,this,d)}:r,i)}:t};t.exports={setTimeout:a(n.setTimeout),setInterval:a(n.setInterval)}},397:function(t,e,i){},484:function(t,e,i){i(485),i(486)},485:function(t,e,i){var n=i(1),s=i(0),l=i(396).setInterval;n({global:!0,bind:!0,forced:s.setInterval!==l},{setInterval:l})},486:function(t,e,i){var n=i(1),s=i(0),l=i(396).setTimeout;n({global:!0,bind:!0,forced:s.setTimeout!==l},{setTimeout:l})},487:function(t,e,i){"use strict";i(397)},495:function(t,e,i){"use strict";i.r(e);i(484),i(96),i(9),i(97);var n={name:"Slides",data:function(){return{slides:[],currentSlide:0}},mounted:function(){var t=this;this.$nextTick((function(){setTimeout((function(){return t.loadSlides()}),0)}))},methods:{loadSlides:function(){var t=this;this.$el.querySelectorAll(".slide").forEach((function(e){t.slides.push({src:e.querySelector(".image img").getAttribute("data-src"),title:e.querySelector(".image img").getAttribute("data-title"),content:e.querySelector(".text").innerHTML})}))},previousSlide:function(){this.currentSlide=Math.max(0,this.currentSlide-1)},nextSlide:function(){this.currentSlide=Math.min(this.slides.length-1,this.currentSlide+1)}}},s=(i(487),i(65)),l=Object(s.a)(n,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"slides"},[t._t("default"),t._v(" "),i("div",{staticClass:"slide-image"},[t.slides.length>0?i("img",{attrs:{src:t.slides[t.currentSlide].src}}):t._e()]),t._v(" "),t.slides.length>0?i("div",{staticClass:"slide-content"},[null!=t.slides[t.currentSlide].title?i("h4",{staticClass:"slide-title"},[t._v(t._s(t.slides[t.currentSlide].title))]):t._e(),t._v(" "),i("div",{domProps:{innerHTML:t._s(t.slides[t.currentSlide].content)}})]):t._e(),t._v(" "),i("div",{staticClass:"slide-navigation"},[i("div",{staticClass:"indicator"},[i("span",[t._v(t._s(t.currentSlide+1)+" / "+t._s(t.slides.length))])]),t._v(" "),i("div",{staticClass:"buttons"},[t.currentSlide>0?i("button",{on:{click:t.previousSlide}},[t._v("« Previous")]):t._e(),t._v(" "),t.currentSlide<t.slides.length-1?i("button",{on:{click:t.nextSlide}},[t._v("Next »")]):t._e()])])],2)}),[],!1,null,"516b99a7",null);e.default=l.exports}}]);