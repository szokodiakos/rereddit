<template>
  <div>
    <div v-if="isInitialLoad" style="position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
      <rotate-loader></rotate-loader>
    </div>
    <div v-else>
      <section class="hero is-primary is-bold jump-target">
        <div class="hero-body" v-bind:style="{
          'background-image': `-webkit-linear-gradient(left, ${subredditData.color}, rgba(0,0,0,0))${subredditData.bannerImg ? `, url(${subredditData.bannerImg})` : ''}`,
          'background-size': `auto, cover`,
        }">
          <div class="container">
            <h1 class="title" v-bind:style="{ color: subredditData.textColor }">
              {{ subreddit || 'Rereddit' }}
            </h1>
            <h2 class="subtitle" v-bind:style="{ color: subredditData.textColor }">
              <span v-if="subredditData.title">{{ subredditData.title }}</span>
              <span v-else>An alternative <i class="fa fa-reddit-alien" aria-hidden="true"></i> client</span>
            </h2>
          </div>
        </div>
      </section>
      <!-- <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-menu">
          <a class="navbar-item">
            Home
          </a>
        </div>
      </nav> -->
      <a class="button is-large" @click="jumpToTop" v-bind:style="{
        'z-index': 10,
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        'background-color': subredditData.color
      }">
        <span class="icon is-large">
          <i class="fa fa-chevron-up" v-bind:style="{ color: subredditData.textColor }"></i>
        </span>
      </a>
      <Post
        v-for="post in posts"
        v-bind:key="post.id"
        :color="post.color"
        :text-color="post.textColor"
        :subreddit="post.subreddit"
        :date="post.date"
        :url="post.url"
        :domain="post.domain"
        :is-sticky="post.isSticky"
        :type="post.type"
        :thumbnail="post.thumbnail"
        :title="post.title"
        :details="post.details"
        :media-id="post.mediaId"
        :score="post.score"
        :comment-count="post.commentCount"
      ></Post>
      <infinite-loading
        style="height: 100px; margin-top:50px"
        v-if="lastPostId"
        @infinite="infiniteHandler"
        v-bind:distance="2000"
      >
        <span slot="spinner">
          <rotate-loader></rotate-loader>
        </span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';
import InfiniteLoading from 'vue-infinite-loading';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import jump from 'jump.js';
import Post from '@/components/Post';
import postType from '@/enums/postType';

function getRGBComponents(color) {
  const r = color.substring(1, 3);
  const g = color.substring(3, 5);
  const b = color.substring(5, 7);

  return {
    R: parseInt(r, 16),
    G: parseInt(g, 16),
    B: parseInt(b, 16),
  };
}

function getTextColor(bgColor) {
  if (!bgColor) {
    return '#000000';
  }
  const nThreshold = 105;
  const components = getRGBComponents(bgColor);
  const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

  return ((255 - bgDelta) < nThreshold) ? '#000000' : '#ffffff';
}

const DEFAULT_COLOR = '#c0392b';
const DEFAULT_SUBREDDIT_DATA = {
  color: DEFAULT_COLOR,
  textColor: getTextColor(DEFAULT_COLOR),
};

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
  if (match && match[1]) {
    return match[1];
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
  name: 'app',
  async created() {
    this.subreddit = this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
    this.posts = await this.getPosts();
    this.isInitialLoad = false;
  },
  watch: {
    async $route() {
      this.posts = [];
      this.isInitialLoad = true;
      this.subreddit = this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
      this.posts = await this.getPosts();
      this.isInitialLoad = false;
    },
  },
  methods: {
    jumpToTop() {
      jump('.jump-target');
    },
    async getColorBySubreddit(subreddit) {
      if (!this.colors[subreddit]) {
        const response = await this.$http.get(`https://www.reddit.com/${subreddit}/about.json`);
        const color = _.get(response, 'body.data.key_color') || DEFAULT_SUBREDDIT_DATA.color;
        this.colors[subreddit] = color;
      }
      return this.colors[subreddit];
    },
    async populatePostDetails(posts) {
      const subreddits = _.uniq(posts.map(post => post.subreddit));

      // prefetch subreddits
      await Promise.all(subreddits.map(subreddit => this.getColorBySubreddit(subreddit)));

      return Promise.all(posts.map(async (post) => {
        const rawDetails = await post.detailsPromise;
        const details = _.get(rawDetails, 'body.[0].data.children[0].data.selftext');
        const color = await this.getColorBySubreddit(post.subreddit);
        const textColor = getTextColor(color);
        return {
          ...post,
          details,
          color,
          textColor,
        };
      }));
    },
    async getPosts({ after } = {}) {
      if (this.subreddit) {
        const subredditResponse = await this.$http.get(`https://www.reddit.com/${this.subreddit}/about.json`);
        const subredditData = subredditResponse.body.data;
        this.subredditData = {
          title: subredditData.title,
          onlineUsers: subredditData.accounts_active,
          totalUsers: subredditData.accounts_active,
          headerImg: subredditData.header_img,
          bannerImg: subredditData.banner_img,
          iconImg: subredditData.icon_img,
          color: subredditData.key_color,
        };
        this.subredditData.textColor = getTextColor(this.subredditData.color);
      } else {
        this.subredditData = DEFAULT_SUBREDDIT_DATA;
      }

      let requestUrl = `https://www.reddit.com/${this.subreddit}.json?limit=10`;
      if (after) {
        requestUrl += `&after=t3_${after}`;
      }
      const response = await this.$http.get(requestUrl);
      const posts = response.body.data.children.map(({ data: post }) => {
        const id = post.id;
        const title = post.title;
        const format = n => (n > 1000 ? '0.0a' : '0a');
        const score = numeral(post.score).format(format(post.score));
        const commentCount = numeral(post.num_comments).format(format(post.num_comments));
        const subredditName = post.subreddit_name_prefixed;
        const author = post.author;
        const date = moment.utc(parseInt(`${post.created_utc}000`, 10)).fromNow();
        const domain = post.domain;
        const thumbnail = (!post.thumbnail || post.thumbnail === 'default') ? 'static/reddit.jpeg' : post.thumbnail;
        const isSticky = post.stickied;
        let url = post.url;
        let detailsPromise = Promise.resolve();
        let mediaId;

        let type;
        if (post.url.endsWith('.gifv')) {
          url = post.url.replace(/gifv$/, 'mp4');
          type = this.postType.VIDEO;
        } else if (post.url.endsWith('.mp4')) {
          type = this.postType.VIDEO;
        } else if (post.url.endsWith('.png') || post.url.endsWith('.jpg') || post.domain === 'i.imgur.com') {
          type = this.postType.IMAGE;
        } else if (post.url.endsWith('.gif')) {
          type = this.postType.GIF;
        } else if (post.domain.startsWith('self.')) {
          type = this.postType.SELF;
          detailsPromise = this.$http.get(`${post.url.slice(0, -1)}.json`);
        } else if (post.domain === 'imgur.com') {
          type = this.postType.IMAGE;
          const imgurId = url.split('/').slice(-1)[0];
          url = `https://i.imgur.com/${imgurId}.jpg`;
        } else if (post.domain.endsWith('youtube.com') || post.domain === 'youtu.be') {
          type = this.postType.YOUTUBE;
          mediaId = getYoutubeId(post.url);
        } else if (post.domain === 'clips.twitch.tv') {
          type = this.postType.TWITCH;
          mediaId = getTwitchId(post.url);
        } else if (post.domain === 'gfycat.com') {
          type = this.postType.GFYCAT;
          mediaId = getGfycatId(post.url);
        // } else if (post.domain === 'v.redd.it') {
        //   type = this.postType.VREDDIT;
        } else if (post.domain === 'streamable.com') {
          type = this.postType.STREAMABLE;
          mediaId = getStreamableId(post.url);
        } else {
          type = this.postType.OTHER;
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
  data() {
    return {
      isInitialLoad: true,
      subreddit: '',
      colors: {},
      posts: [],
      subredditData: DEFAULT_SUBREDDIT_DATA,
      postType,
      lastPostId: '',
    };
  },
  components: {
    InfiniteLoading,
    RotateLoader,
    Post,
  },
};
</script>

<style>
.card-header a {
  color: inherit;
}

.title a {
  color: inherit;
}
</style>
