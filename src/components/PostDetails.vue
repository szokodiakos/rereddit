<template>
  <Page :subreddit="subreddit">
    <div slot="content">
      <div v-if="!isLoading">
        <component :is="postPack.component" v-bind="postPack"></component>
      </div>
    </div>
  </Page>
</template>

<script>
import _ from 'lodash';
import Page from '@/components/Page';
import common, { postComponents } from '@/common';

export default {
  name: 'postDetails',
  data() {
    return {
      isLoading: true,
      postPack: null,
    };
  },
  async created() {
    const permalink = this.$route.path;
    const response = await this.$http.get(`https://www.reddit.com${permalink}.json`);
    const subredditResponse = await this.$http.get(`https://www.reddit.com/${this.subreddit}/about.json`);
    const color = _.get(subredditResponse, 'body.data.key_color', common.DEFAULT_COLOR);
    const textColor = common.getTextColor(color);
    const post = _.get(response, 'body[0].data.children[0].data', {});

    this.postPack = {
      post,
      color,
      textColor,
      component: common.handles(post),
    };

    this.isLoading = false;
  },
  computed: {
    subreddit() {
      return this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
    },
  },
  components: {
    Page,
    ...postComponents,
  },
};
</script>

<style scoped>

</style>
