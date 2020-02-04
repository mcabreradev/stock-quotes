<template>
  <div id="quotes-root">
    <ul>
      <li
        v-for="quote in quotes"
        v-bind:key="quote.code+quote.name"
        v-bind:class="'is-'+quote.direction"
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
      quotes: []
    };
  },
  async mounted() {
    try {
      let res = await fetch("/quotes");
      let quotes = await res.json();
      this.quotes = quotes.data;
      console.log(quotes);
    } catch (e) {
      console.error(e);
    }
  }
};
</script>

<style scoped>
</style>