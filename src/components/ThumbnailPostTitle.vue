<template>
  <article class="media">
    <figure class="media-left hide-on-mobile">
      <p class="image width-128">
        <a :href="clickUrl" target="_blank">
          <img :src="thumbnail">
        </a>
      </p>
    </figure>
    <div class="media-content">
      <PostTitle
        :title="title"
        :click-url="clickUrl"
        :is-sticky="isSticky"
        :is-nsfw="isNsfw"
        :tag="tag"
      ></PostTitle>
      <p class="image width-128 hide-on-desktop center" style="margin-top: 10px;">
        <a :href="clickUrl" target="_blank">
          <img :src="thumbnail">
        </a>
      </p>
      <br>
    </div>
  </article>
</template>

<script>
import PostTitle from '@/components/PostTitle';

export default {
  name: 'thumbnailPostTitle',
  props: [
    'title',
    'clickUrl',
    'isSticky',
    'tag',
    'isNsfw',
    'thumbnail',
  ],
  components: {
    PostTitle,
  },
};
</script>

<style scope>
.width-128 {
  width: 128px;
}
</style>
