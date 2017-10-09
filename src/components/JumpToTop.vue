<template>
  <a class="button is-large the" @click="click" v-bind:style="{ backgroundColor }">
    <span class="icon is-large">
      <i class="fa fa-chevron-up" v-bind:style="{ color }"></i>
    </span>
  </a>
</template>

<script>
export default {
  name: 'jumpToTop',
  props: [
    'click',
    'backgroundColor',
    'color',
  ],
};
</script>

<style scoped>
.the {
  z-index: 10;
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
