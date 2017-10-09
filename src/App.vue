<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
@media screen and (min-width: 769px) {
  .hide-on-desktop {
    display: none !important;
  }
}

@media screen and (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
}
</style>

