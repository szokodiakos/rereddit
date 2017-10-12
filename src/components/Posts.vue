<template>
  <div v-bind:style="{ 'text-align': isPostsLoading ? 'center' : 'left' }">
    <div v-if="isPostsLoading" class="post-loader">
      <rotate-loader></rotate-loader>
    </div>
    <div v-else>
      <div v-if="!posts.length" class="no-posts-message">
        <h2 class="title is-2">
          No posts <b-icon pack="fa" icon="frown-o" size="is-large"></b-icon>
        </h2>
      </div>

      <component
        v-for="postPack in posts"
        :key="postPack.post.id"
        :is="postPack.component"
        v-bind="postPack"
      >
      </component>

      <infinite-loading v-if="lastPostId" class="infinite-loader" @infinite="infiniteHandler">
        <span slot="spinner">
          <rotate-loader></rotate-loader>
        </span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import RotateLoader from 'vue-spinner/src/RotateLoader';
import _ from 'lodash';
import InfiniteLoading from 'vue-infinite-loading';
import common from '@/common';
import Post from '@/components/Post';
import ImagePost from '@/components/ImagePost';
import OtherPost from '@/components/OtherPost';
import VideoPost from '@/components/VideoPost';
import YoutubePost from '@/components/YoutubePost';
import SelfPost from '@/components/SelfPost';
import TwitchPost from '@/components/TwitchPost';
import StreamablePost from '@/components/StreamablePost';
import GfycatPost from '@/components/GfycatPost';

const postComponents = [
  ImagePost,
  VideoPost,
  YoutubePost,
  SelfPost,
  TwitchPost,
  StreamablePost,
  GfycatPost,
];
postComponents.push(OtherPost);

export default {
  name: 'posts',
  data() {
    return {
      colors: {},
      posts: [],
      isPostsLoading: true,
      lastPostId: '',
    };
  },
  props: [
    'subreddit',
    'modifier',
  ],
  computed: {
    show() {
      return this.$route.query.show;
    },
  },
  async created() {
    this.posts = await this.getPosts();
    this.isPostsLoading = false;
  },
  watch: {
    async $route() {
      this.isPostsLoading = true;
      this.posts = [];
      this.posts = await this.getPosts();
      this.isPostsLoading = false;
    },
  },
  methods: {
    getColorByPost({ subreddit_name_prefixed: subreddit }) {
      return this.colors[subreddit].color;
    },
    getTextColorByPost({ subreddit_name_prefixed: subreddit }) {
      return this.colors[subreddit].textColor;
    },
    async populateColorBySubreddit(subreddit) {
      if (!this.colors[subreddit]) {
        const response = await this.$http.get(`https://www.reddit.com/${subreddit}/about.json`);
        const color = _.get(response, 'body.data.key_color') || common.DEFAULT_COLOR;
        this.colors[subreddit] = {
          color,
          textColor: common.getTextColor(color),
        };
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

      this.lastPostId = _.get(posts, `[${posts.length - 1}].id`);

      const postPacks = posts.map(post => ({
        post,
        color: this.getColorByPost(post),
        textColor: this.getTextColorByPost(post),
        component: common.handles(post, postComponents),
      }));

      return postPacks;
    },
    async infiniteHandler($state) {
      if (!this.lastPostId) {
        $state.loaded();
        return;
      }
      this.posts = [...this.posts, ...await this.getPosts({ after: this.lastPostId })];
      $state.loaded();
    },
  },
  components: {
    InfiniteLoading,
    Post,
    RotateLoader,
    ImagePost: ImagePost.component,
    VideoPost: VideoPost.component,
    YoutubePost: YoutubePost.component,
    SelfPost: SelfPost.component,
    TwitchPost: TwitchPost.component,
    OtherPost: OtherPost.component,
    StreamablePost: StreamablePost.component,
    GfycatPost: GfycatPost.component,
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
