<template>
  <div :style="{ 'text-align': isPostsLoading ? 'center' : 'left' }">
    <div v-if="isPostsLoading" class="post-loader">
      <rotate-loader></rotate-loader>
    </div>
    <div v-else :class="{ 'black-background': isDarkModeOn }">
      <div v-if="!posts.length" class="no-posts-message">
        <h2 class="title is-2">
          No posts <b-icon pack="fa" icon="frown-o" size="is-large"></b-icon>
        </h2>
      </div>

      <div v-for="postPack in posts" :class="`post-${postPack.post.id}`" :key="postPack.post.id">
        <component :is="postPack.component" v-bind="postPack"></component>
      </div>

      <infinite-loading v-if="lastPostId" class="infinite-loader" @infinite="infiniteHandler">
        <span slot="spinner">
          <rotate-loader></rotate-loader>
        </span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import chroma from 'chroma-js';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import _ from 'lodash';
import { mapMutations, mapState, mapGetters } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import common, { postComponents } from '@/common';
import Post from '@/components/Post';

export default {
  name: 'posts',
  data() {
    return {
      colors: {},
      isPostsLoading: true,
    };
  },
  props: [
    'subreddit',
    'modifier',
  ],
  computed: {
    ...mapGetters(['isDarkModeOn']),
    ...mapState(['posts', 'lastPostId', 'scrollId']),
    show() {
      return this.$route.query.show;
    },
  },
  async created() {
    if (_.isEmpty(this.posts)) {
      this.initPosts(await this.getPosts());
    } else if (this.scrollId) {
      this.$nextTick(() => setTimeout(() => document.querySelector(`.post-${this.scrollId}`).scrollIntoView(), 100));
    }
    this.isPostsLoading = false;
  },
  watch: {
    async $route(to, from) {
      if (from.name !== 'post') {
        this.isPostsLoading = true;
        this.resetPosts();
        this.initPosts(await this.getPosts());
        this.isPostsLoading = false;
      }
    },
  },
  methods: {
    ...mapMutations(['initPosts', 'resetPosts', 'appendPosts']),
    getColorByPost({ subreddit_name_prefixed: subreddit }) {
      return this.colors[subreddit].color;
    },
    getTextColorByPost({ subreddit_name_prefixed: subreddit }) {
      return this.colors[subreddit].textColor;
    },
    async populateColorBySubreddit(subreddit) {
      if (!this.colors[subreddit]) {
        const response = await this.$http.get(`https://www.reddit.com/${subreddit}/about.json`);
        let color = _.get(response, 'body.data.key_color') || common.DEFAULT_COLOR;
        let textColor = common.getTextColor(color);

        if (this.isDarkModeOn) {
          color = chroma(color).darken(2).hex();
          textColor = chroma(textColor).darken(2).hex();
        }

        this.colors[subreddit] = { color, textColor };
      }
    },
    async getPosts({ after } = {}) {
      const modifier = this.modifier ?
        `/${this.modifier}` :
        '';

      const show = ((this.modifier === 'controversial' || this.modifier === 'top') && this.show) ?
        `&sort=${this.modifier}&t=${this.show}` :
        '';

      let requestUrl = `https://www.reddit.com/${this.subreddit}${modifier}.json?limit=10${show}`;
      if (after) {
        requestUrl += `&after=t3_${after}`;
      }
      const response = await this.$http.get(requestUrl);
      const posts = response.body.data.children.map(({ data: post }) => post);
      const subreddits = _.uniq(posts.map(post => post.subreddit_name_prefixed));

      // prefetch subreddits
      await Promise.all(subreddits.map(subreddit => this.populateColorBySubreddit(subreddit)));

      const lastPostId = _.get(posts, `[${posts.length - 1}].id`);

      const postPacks = posts.map(post => ({
        post,
        color: this.getColorByPost(post),
        textColor: this.getTextColorByPost(post),
        component: common.handles(post),
      }));

      return { posts: postPacks, lastPostId };
    },
    async infiniteHandler($state) {
      if (!this.lastPostId) {
        $state.loaded();
        return;
      }

      this.appendPosts((await this.getPosts({ after: this.lastPostId })));
      $state.loaded();
    },
  },
  components: {
    InfiniteLoading,
    Post,
    RotateLoader,
    ...postComponents,
  },
};
</script>

<style scoped>
.post-loader {
  margin-top: 70px;
}

.no-posts-message {
  display: flex;
  justify-content: center;
}

.no-posts-message h2 {
  margin-top: 25px;
  color: #95a5a6;
}

.infinite-loader {
  height: 100px;
  margin-top:50px;
}

</style>
