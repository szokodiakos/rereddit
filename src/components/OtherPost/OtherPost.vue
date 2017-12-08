<template>
  <div>
    <ThumbnailPost v-if="thumbnail" v-bind="$props"></ThumbnailPost>
    <Post v-else v-bind="$props"></Post>
  </div>
</template>

<script>
import ThumbnailPost from '@/components/ThumbnailPost';
import Post from '@/components/Post';
import isUrl from 'is-url';

export default {
  name: 'otherPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  computed: {
    thumbnail() {
      if (!isUrl(this.post.thumbnail)) {
        return '';
      }
      return this.post.thumbnail;
    },
  },
  components: {
    ThumbnailPost,
    Post,
  },
};
</script>
