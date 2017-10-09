<template>
  <div>
    <div v-if="isLoading" class="loader">
      <rotate-loader></rotate-loader>
    </div>
    <div v-else>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import RotateLoader from 'vue-spinner/src/RotateLoader';

export default {
  name: 'page',
  props: [
    'isLoading',
  ],
  components: {
    RotateLoader,
  },
};
</script>

<style scoped>
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>


