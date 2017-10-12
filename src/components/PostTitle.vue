<template>
  <p class="title post-title">
    <a :href="url" target="_blank">
      <b-icon
        v-if="isSticky"
        size="is-medium"
        class="fa-rotate-270 sticky red-color"
        pack="fa"
        icon="thumb-tack"
      ></b-icon>
      {{ title }}
    </a>
    <span v-if="tag" class="tag">{{ tag }}</span>
    <span v-if="isNsfw" class="tag nsfw red-background">nsfw</span>
  </p>
</template>

<script>
import he from 'he';

export default {
  name: 'postTitle',
  props: [
    'post',
  ],
  data() {
    return {
      url: this.post.url,
      isSticky: this.post.stickied,
      isNsfw: this.post.over_18,
      title: he.decode(this.post.title),
      tag: he.decode(this.post.link_flair_text || ''),
    };
  },
};
</script>

<style scope>
@media screen and (max-width: 768px) {
  .post-title {
    padding: 0.7rem !important;
    line-height: 0.8;
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

.tag {
  text-transform: uppercase;
}

.nsfw {
  color: white;
}

.sticky {
  padding-left: 5px;
}
</style>
