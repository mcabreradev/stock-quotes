<template>
  <div id="quotes-root" ref="root">
    <ul class="wrapper" v-if="ready" ref="content">
      <li
        v-for="(quote, index) in quotes"
        v-bind:key="'quote-' + quote.code + quote.name + index"
        v-bind:class="'is-' + quote.direction"
      >
        <div class="name">{{ quote.name }}</div>
        <div class="last">{{ quote.last }}</div>
        <div class="change">{{ quote.change }}</div>
        <div v-bind:class="'day day-'+quote.direction">
          <span class="signal" v-if="quote.direction === 'negative'">- </span>
          <span class="signal" v-else-if="quote.direction === 'positive'">+ </span>
          <span> {{ quote.day }}</span>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      ready: false,
      quotes: []
    };
  },

  async mounted() {
    const self = this;
    try {
      let res = await fetch("/api/quotes");
      let quotes = await res.json();
      this.quotes = quotes.data;
      this.ready = true;
      setTimeout(() => {
        this.scroll_right()
      }, 5000);
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    scroll_left() {
      let element = document.querySelector("body");
      let width = element.scrollWidth * (-1);
      this.scrollTo(element, width, 10000, 'scroll_right');
    },

    scroll_right() {
      let element = document.querySelector("body");
      let width = element.scrollWidth;
      this.scrollTo(element, width, 10000, 'scroll_left');
    },

    scrollTo(element, scrollPixels, duration, callback) {
      const self = this;
      const scrollPos = element.scrollLeft;
      // Condition to check if scrolling is required
      if (!((scrollPos === 0 || scrollPixels > 0) && (element.clientWidth + scrollPos === element.scrollWidth ||scrollPixels < 0))) {
        // Get the start timestamp
        const startTime = "now" in window.performance ? performance.now() : new Date().getTime();

        function scroll(timestamp) {
          //Calculate the timeelapsed
          const timeElapsed = timestamp - startTime;
          //Calculate progress
          const progress = Math.min(timeElapsed / duration, 1);
          //Set the scrolleft
          element.scrollLeft = scrollPos + scrollPixels * progress;
          //Check if elapsed time is less then duration then call the requestAnimation, otherwise exit
          if (timeElapsed < duration) {
            //Request for animation
            window.requestAnimationFrame(scroll);
          } else {
            self[callback]();
            return;
          }
        }
        //Call requestAnimationFrame on scroll function first time
        window.requestAnimationFrame(scroll);
      }
    },
  }
};
</script>

<style scoped>
</style>
