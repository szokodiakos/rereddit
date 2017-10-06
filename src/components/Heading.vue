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
      <!-- https://www.reddit.com/subreddits/search.json?q=wow&limit=5 -->
      <!-- <div>
        /r/ <input @focus="stopTyped" @blur="startTyped" class="go-to-subreddit" type="text"> <button>Go</button>
      </div> -->
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
import Typed from 'typed.js';
// import _ from 'lodash';

export default {
  name: 'heading',
  props: [
    'color',
    'bannerImg',
    'textColor',
    'subreddit',
    'title',
  ],
  data() {
    return {
      typed: null,
      subreddits: [],
    };
  },
  methods: {
    stopTyped() {
      this.typed.destroy();
      this.typed = null;
    },
    startTyped() {
      this.typed = new Typed('.go-to-subreddit', {
        strings: this.subreddits,
        attr: 'placeholder',
        typeSpeed: 40,
        backSpeed: 40,
        shuffle: true,
        loop: true,
      });
    },
  },
  // async mounted() {
  //   const response = await this.$http.get('https://www.reddit.com/reddits/.json');
  //   this.subreddits = _
  //     .get(response, 'body.data.children', [])
  //     .map(rawSubreddit => rawSubreddit.data.display_name);
  //   this.$nextTick(() => {
  //     this.startTyped();
  //   });
  // },
};
</script>

<style>
.center {
  display: block;
  margin: auto;
}
</style>
