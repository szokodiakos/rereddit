<template>
  <p class="title post-title">
    <a :href="clickUrl" target="_blank">
      <b-icon
        v-if="isSticky"
        style="padding-left: 5px; color: #e74c3c;"
        size="is-medium"
        class="fa-rotate-270"
        pack="fa"
        icon="thumb-tack"
      ></b-icon>
      {{ title }}
    </a>
    <span v-if="tag" class="tag">{{ tag }}</span>
    <span v-if="isNsfw" class="tag" style="background-color: #e74c3c; color: white">nsfw</span>
  </p>
</template>

<script>
export default {
  name: 'postTitle',
  props: [
    'title',
    'clickUrl',
    'isSticky',
    'tag',
    'isNsfw',
  ],
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
</style>
