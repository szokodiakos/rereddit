<template>
  <div>
    <ThumbnailPost v-if="thumbnail" v-bind="$props"></ThumbnailPost>
    <Post v-else v-bind="$props"></Post>
  </div>
</template>

<script>
import ThumbnailPost from '@/components/ThumbnailPost';
import Post from '@/components/Post';

export default {
  name: 'otherPost',
  props: [
    'post',
    'color',
    'textColor',
    'thumbnail',
  ],
  components: {
    ThumbnailPost,
    Post,
  },
};
</script>
