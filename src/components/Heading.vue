<template>
  <section class="hero is-primary is-bold jump-target">
    <div class="hero-body" v-bind:style="{
      'background-image': `-webkit-linear-gradient(left, ${color}, rgba(0,0,0,0))${bannerImg ? `, url(${bannerImg})` : ''}`,
      'background-size': `auto, cover`,
    }">
      <div class="container">
        <h1 class="title" v-bind:style="{ color: textColor }">
          {{ subreddit || 'Rereddit' }}
        </h1>
        <h2 class="subtitle" v-bind:style="{ color: textColor }">
          <span v-if="title">{{ title }}</span>
          <span v-else>An alternative <i class="fa fa-reddit-alien" aria-hidden="true"></i> client</span>
        </h2>
      </div>
    </div>
  </section>
  <!-- <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <a class="navbar-item">
        Home
      </a>
    </div>
  </nav> -->
</template>

<script>
export default {
  name: 'heading',
  props: [
    'color',
    'bannerImg',
    'textColor',
    'subreddit',
    'title',
  ],
};
</script>

<style>

</style>
