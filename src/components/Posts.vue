<template>
  <div v-bind:style="{ 'text-align': isPostsLoading ? 'center' : 'left' }">
    <div v-if="isPostsLoading" style="margin-top: 70px;">
      <rotate-loader></rotate-loader>
    </div>
    <div v-else>
      <div v-if="!posts.length" style="display: flex; justify-content: center;">
        <h2 class="title is-2" style="margin-top: 25px; color: #95a5a6;">
          No posts <b-icon pack="fa" icon="frown-o" size="is-large"></b-icon>
        </h2>
      </div>
      <Post
        v-for="post in posts"
        v-bind:key="post.id"
        :id="post.id"
        :color="post.color"
        :author="post.author"
        :text-color="post.textColor"
        :subreddit="post.subreddit"
        :date="post.date"
        :url="post.url"
        :click-url="post.clickUrl || post.url"
        :domain="post.domain"
        :is-sticky="post.isSticky"
        :type="post.type"
        :thumbnail="post.thumbnail"
        :title="post.title"
        :details="post.details"
        :media-id="post.mediaId"
        :score="post.score"
        :comment-count="post.commentCount"
        :permalink="post.permalink"
        :tag="post.tag"
        :is-nsfw="post.isNsfw"
      ></Post>
      <infinite-loading
        style="height: 100px; margin-top:50px"
        v-if="lastPostId"
        @infinite="infiniteHandler"
      >
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
import he from 'he';
import moment from 'moment';
import InfiniteLoading from 'vue-infinite-loading';
import common from '@/common';
import Post from '@/components/Post';
import postTypes from '@/enums/postTypes';

function getStreamableId(url) {
  const regExp = /^.*streamable\.com\/(.*)/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

function getGfycatId(url) {
  const regExp = /^.*gfycat\.com\/(.*)/;
  const match = url.match(regExp);
  if (match) {
    return _.last(url.split('/'));
  }
  return undefined;
}

function getTwitchId(url) {
  const regExp = /^.*clips\.twitch\.tv\/(.*)\?/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

function getYoutubeId(url) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return undefined;
}

export default {
  name: 'posts',
  data() {
    return {
      colors: {},
      posts: [],
      isPostsLoading: true,
      postTypes,
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
    async populatePostDetails(posts) {
      const subreddits = _.uniq(posts.map(post => post.subreddit));

      // prefetch subreddits
      await Promise.all(subreddits.map(subreddit => this.getColorBySubreddit(subreddit)));

      return Promise.all(posts.map(async (post) => {
        const rawDetails = await post.detailsPromise;
        const details = he.decode(_.get(rawDetails, 'body.[0].data.children[0].data.selftext', ''));
        const color = await this.getColorBySubreddit(post.subreddit);
        const textColor = common.getTextColor(color);
        return {
          ...post,
          details,
          color,
          textColor,
        };
      }));
    },
    async getColorBySubreddit(subreddit) {
      if (!this.colors[subreddit]) {
        const response = await this.$http.get(`https://www.reddit.com/${subreddit}/about.json`);
        const color = _.get(response, 'body.data.key_color') || common.DEFAULT_COLOR;
        this.colors[subreddit] = color;
      }
      return this.colors[subreddit];
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
      const posts = response.body.data.children.map(({ data: post }) => {
        const id = post.id;
        const title = he.decode(post.title);
        const score = common.formatNumber(post.score);
        const commentCount = common.formatNumber(post.num_comments);
        const subredditName = post.subreddit_name_prefixed;
        const author = post.author;
        const date = moment.utc(parseInt(`${post.created_utc}000`, 10)).fromNow();
        const domain = post.domain;
        const thumbnail = (!post.thumbnail || post.thumbnail === 'default') ? 'static/reddit.jpeg' : post.thumbnail;
        const permalink = post.permalink;
        const isSticky = post.stickied;
        const isNsfw = post.over_18;
        const tag = he.decode(post.link_flair_text || '');
        let url = post.url;
        let clickUrl;
        let detailsPromise = Promise.resolve();
        let mediaId;

        let type;
        if (url.endsWith('.gifv')) {
          url = url.replace(/gifv$/, 'mp4');
          type = this.postTypes.VIDEO;
        } else if (url.endsWith('.mp4')) {
          type = this.postTypes.VIDEO;
        } else if (url.startsWith('https://imgur.com/a/')) {
          type = this.postTypes.IMAGE;
          clickUrl = url;
          url = _.get(post, 'media.oembed.thumbnail_url', '').replace('?fb', '');
        } else if (url.endsWith('.gif')) {
          type = this.postTypes.GIF;
        } else if (url.endsWith('.png') || url.endsWith('.jpg') || domain === 'i.imgur.com') {
          type = this.postTypes.IMAGE;
        } else if (domain === 'imgur.com') {
          type = this.postTypes.IMAGE;
          url = `${url.replace('imgur.com', 'i.imgur.com')}.jpg`;
        } else if (domain.startsWith('self.')) {
          type = this.postTypes.SELF;
          detailsPromise = this.$http.get(`${url.slice(0, -1)}.json`);
        } else if (domain.endsWith('youtube.com') || domain === 'youtu.be') {
          type = this.postTypes.YOUTUBE;
          mediaId = getYoutubeId(url);
        } else if (domain === 'clips.twitch.tv') {
          type = this.postTypes.TWITCH;
          mediaId = getTwitchId(url);
        } else if (domain === 'gfycat.com') {
          type = this.postTypes.GFYCAT;
          mediaId = getGfycatId(url);
        // } else if (domain === 'v.redd.it') {
        //   type = this.postTypes.VREDDIT;
        // instagram
        } else if (domain === 'streamable.com') {
          type = this.postTypes.STREAMABLE;
          mediaId = getStreamableId(url);
        } else {
          type = this.postTypes.OTHER;
        }

        return {
          id,
          title,
          score,
          commentCount,
          url,
          subreddit: subredditName,
          author,
          domain,
          date,
          detailsPromise,
          type,
          thumbnail,
          mediaId,
          isSticky,
          permalink,
          clickUrl,
          tag,
          isNsfw,
        };
      });
      const populatedPosts = await this.populatePostDetails(posts);
      this.lastPostId = _.get(posts, `[${posts.length - 1}].id`);
      return populatedPosts;
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
  },
};
</script>

<style scoped>

</style>
