<template>
  <ThumbnailPost v-bind="$props"></ThumbnailPost>
</template>

<script>
import ThumbnailPost from '@/components/ThumbnailPost';

export default {
  name: 'otherPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  components: {
    ThumbnailPost,
  },
};
</script>
