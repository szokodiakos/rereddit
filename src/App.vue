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

.tippy-tooltip.light-theme {
  min-height: 200px;
  width: 680px;
  max-width: 100%;
}

.center {
  display: block;
  margin: auto;
}

.full-width {
  width: 100%;
}

.no-wrap {
  white-space: nowrap;
}

.green-background {
  background-color: #2ecc71;
}

.green-color {
  color: #2ecc71;
}

.red-background {
  background-color: #e74c3c;
}

.red-color {
  color: #e74c3c;
}

.gold-color {
  color: #ffd700;
}
</style>

