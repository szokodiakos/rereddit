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

.full-screen-height-max {
  max-height: 80vh;
}

.full-screen-height {
  height: 100vh;
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
  background-color: #2ecc71 !important;
}

.green-color {
  color: #2ecc71 !important;
}

.red-background {
  background-color: #e74c3c !important;
}

.red-color {
  color: #e74c3c !important;
}

.gold-color {
  color: #ffd700 !important;
}

.black-background {
  background-color: black;
}

.dark-background {
  background-color: #191919;
}

.darkish-background {
  background-color: #2b2b2b;
}

.text-color-for-dark, .text-color-for-dark a {
  color: rgb(155, 155, 155);
}

.dark-box-shadow {
  box-shadow: 0 2px 3px #2c3e50, 0 0 0 1px #2c3e50;
}
</style>

