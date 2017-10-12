<template>
  <Page :subreddit="subreddit">
    <div slot="content">
      <div v-if="isPostLoading" class="post-loader">
        <rotate-loader></rotate-loader>
      </div>

      <div v-else>
        <component :is="postPack.component" v-bind="postPack"></component>
        <div class="container" style="margin-bottom: 100px;">
          <Comment v-for="comment in comments" :key="comment.id" :comment="comment"></Comment>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import _ from 'lodash';
import Page from '@/components/Page';
import Comment from '@/components/Comment';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import common, { postComponents } from '@/common';

export default {
  name: 'postDetails',
  data() {
    return {
      isPostLoading: true,
      postPack: null,
      comments: [],
    };
  },
  async created() {
    const permalink = this.$route.path;
    const response = await this.$http.get(`https://www.reddit.com${permalink}.json`);
    const subredditResponse = await this.$http.get(`https://www.reddit.com/${this.subreddit}/about.json`);
    const color = _.get(subredditResponse, 'body.data.key_color') || common.DEFAULT_COLOR;
    const textColor = common.getTextColor(color);
    const post = _.get(response, 'body[0].data.children[0].data', {});
    this.comments = _.get(response, 'body[1].data.children', [])
      .filter(({ kind }) => kind !== 'more')
      .map(({ data: comment }) => comment);

    this.postPack = {
      post,
      color,
      textColor,
      component: common.handles(post),
    };

    this.isPostLoading = false;
  },
  computed: {
    subreddit() {
      return this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
    },
  },
  components: {
    Page,
    RotateLoader,
    Comment,
    ...postComponents,
  },
};
</script>

<style scoped>
.post-loader {
  text-align: center;
  margin-top: 70px;
}
</style>
