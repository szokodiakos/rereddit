<template>
  <p :class="['title post-title', { 'text-color-for-dark': isDarkModeOn }]">
    <router-link :to="permalink" @click.native="saveScrollId(id)">
      <b-icon
        v-if="isSticky"
        size="is-medium"
        class="fa-rotate-270 sticky red-color"
        pack="fa"
        icon="thumb-tack"
      ></b-icon>
      {{ title }}
    </router-link>
    <span v-if="tag" class="tag">{{ tag }}</span>
    <span v-if="isNsfw" class="tag nsfw red-background">nsfw</span>
  </p>
</template>

<script>
import he from 'he';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'postTitle',
  props: [
    'post',
  ],
  computed: {
    ...mapGetters(['isDarkModeOn']),
  },
  methods: {
    ...mapMutations(['saveScrollId']),
  },
  data() {
    return {
      id: this.post.id,
      url: this.post.url,
      isSticky: this.post.stickied,
      isNsfw: this.post.over_18,
      title: he.decode(this.post.title),
      tag: he.decode(this.post.link_flair_text || ''),
      permalink: this.post.permalink,
    };
  },
};
</script>

<style scope>
@media screen and (max-width: 768px) {
  .post-title {
    padding: 0.7rem !important;
    line-height: 0.8;
    margin-bottom: 0px !important;
  }

  .post-title a {
    font-size: 1.1rem;
  }

  .title {
    padding: 1.5rem;
  }
}

.title a {
  color: inherit;
}

.post-title {
  text-align: justify;
}

.tag {
  text-transform: uppercase;
}

.nsfw {
  color: white !important;
}

.sticky {
  padding-left: 5px;
}
</style>
