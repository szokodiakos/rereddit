<template>
  <PostFrame v-bind="$props">
    <div slot="content">
      <PostTitle :post="post"></PostTitle>
      <div v-if="showNsfwNotice">
        <NsfwPost :post="post"></NsfwPost>
      </div>
      <div v-else-if="isLoading" class="post-loader">
        <rotate-loader></rotate-loader>
      </div>
      <slot v-else name="content"></slot>
    </div>
  </PostFrame>
</template>

<script>
import RotateLoader from 'vue-spinner/src/RotateLoader';
import PostFrame from '@/components/PostFrame';
import PostTitle from '@/components/PostTitle';
import NsfwPost from '@/components/NsfwPost';

export default {
  name: 'post',
  props: [
    'post',
    'color',
    'textColor',
    'isLoading',
  ],
  components: {
    PostFrame,
    PostTitle,
    RotateLoader,
    NsfwPost,
  },
  computed: {
    showNsfwNotice() {
      const isNsfw = this.post.over_18;
      const settings = this.$store.state.settings;
      return isNsfw && !settings.showNsfw;
    },
  },
};
</script>

<style scoped>
.post-loader {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
}
</style>
