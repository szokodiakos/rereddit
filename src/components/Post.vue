<template>
  <PostFrame v-bind="$props">
    <div slot="content">
      <PostTitle :post="post"></PostTitle>
      <div v-if="isLoading" class="post-loader">
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
