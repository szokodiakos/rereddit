<template>
  <article class="media">
    <figure class="media-left hide-on-mobile">
      <p class="image width-128">
        <a :href="url" target="_blank">
          <img :src="thumbnail">
        </a>
      </p>
    </figure>
    <div class="media-content">
      <PostTitle v-bind="$props"></PostTitle>
      <p class="image width-128 hide-on-desktop center" style="margin-top: 10px;">
        <a :href="url" target="_blank">
          <img :src="thumbnail">
        </a>
      </p>
      <br>
    </div>
  </article>
</template>

<script>
import PostTitle from '@/components/PostTitle';
import isUrl from 'is-url';

export default {
  name: 'thumbnailPostTitle',
  props: [
    'post',
  ],
  data() {
    return {
      url: this.post.url,
      thumbnail: (!isUrl(this.post.thumbnail)) ? 'static/reddit.jpeg' : this.post.thumbnail,
    };
  },
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
