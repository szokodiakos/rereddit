<template>
  <PostFrame v-bind="$props">
    <div slot="content">
      <ThumbnailPostTitle :post="post"></ThumbnailPostTitle>
      <slot name="content"></slot>
    </div>
  </PostFrame>
</template>

<script>
import PostFrame from '@/components/PostFrame';
import ThumbnailPostTitle from '@/components/ThumbnailPostTitle';

export default {
  name: 'thumbnailPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  components: {
    PostFrame,
    ThumbnailPostTitle,
  },
};
</script>

<style scoped>

</style>
