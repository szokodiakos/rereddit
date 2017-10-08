<template>
  <div>
    <div v-if="isPageLoading" style="position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
      <rotate-loader></rotate-loader>
    </div>
    <div v-else>
      <Heading
        :color="subredditData.color"
        :banner-img="subredditData.bannerImg"
        :text-color="subredditData.textColor"
        :subreddit="subreddit"
        :title="subredditData.title"
        :online-users="subredditData.onlineUsers"
        :total-users="subredditData.totalUsers"
      ></Heading>
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
      <div class="tabs is-centered">
        <ul>
          <li v-for="tab in tabs" v-bind:key="tab.name" v-bind:class="{ 'is-active': isActiveTab(tab) }">
            <router-link :to="getRouteLink(tab)" style="height: 41px;">
              <i :class="`fa fa-${tab.icon}`"></i>
              <span v-bind:class="{ 'hide-on-mobile': !isActiveTab(tab) }">&nbsp;{{ tab.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div v-if="isPostsLoading" style="position: absolute;left: 50%;top: 70%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
        <rotate-loader></rotate-loader>
      </div>
      <div v-else>
        <div v-if="!posts.length" style="display: flex; justify-content: center;">
          <h2 class="title is-2" style="margin-top: 25px; color: #95a5a6;">No posts <b-icon pack="fa" icon="frown-o" size="is-large"></b-icon></h2>
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
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import InfiniteLoading from 'vue-infinite-loading';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import jump from 'jump.js';
import he from 'he';
import Post from '@/components/Post';
import Heading from '@/components/Heading';
import postType from '@/enums/postType';
import utils from '@/utils';

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
  name: 'app',
  async created() {
    this.setTitle();
    this.subredditData = await this.getSubredditData();
    this.posts = await this.getPosts();
    this.isPageLoading = false;
  },
  watch: {
    async $route(to, from) {
      this.isPostsLoading = true;

      const isNewSubredditNavigaition = to.params.subreddit !== from.params.subreddit;
      if (isNewSubredditNavigaition) {
        this.isPageLoading = true;
        this.setTitle();
        this.subredditData = await this.getSubredditData();
        this.isPageLoading = false;
      }

      this.posts = [];
      this.posts = await this.getPosts();
      this.isPostsLoading = false;
    },
  },
  computed: {
    subreddit() {
      return this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
    },
  },
  methods: {
    getRouteLink(tab) {
      const currentModifier = this.$route.params.modifier || '';
      const tabModifier = tab.modifier || '';

      if (currentModifier === tabModifier) {
        return this.$route.path;
      }

      if (!currentModifier) {
        if (this.$route.path === '/') {
          return `${this.$route.path}${tabModifier}`;
        }
        return `${this.$route.path}/${tabModifier}`;
      }

      if (!tabModifier) {
        const result = this.$route.path.replace(`/${currentModifier}`, tabModifier);
        if (!result) {
          return '/';
        }
        return result;
      }
      return this.$route.path.replace(currentModifier, tabModifier);
    },
    isActiveTab(tab) {
      return tab.modifier === this.$route.params.modifier;
    },
    setTitle() {
      if (this.subreddit) {
        document.title = `${this.subreddit} - Rereddit`;
      } else {
        document.title = 'Rereddit - alternative Reddit client';
      }
    },
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
        const details = he.decode(_.get(rawDetails, 'body.[0].data.children[0].data.selftext', ''));
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
    async getSubredditData() {
      let subredditData;
      if (this.subreddit) {
        const subredditResponse = await this.$http.get(`https://www.reddit.com/${this.subreddit}/about.json`);
        const subredditDataRaw = subredditResponse.body.data;
        subredditData = {
          title: subredditDataRaw.title,
          onlineUsers: utils.formatNumber(subredditDataRaw.accounts_active),
          totalUsers: utils.formatNumber(subredditDataRaw.subscribers),
          headerImg: subredditDataRaw.header_img,
          bannerImg: subredditDataRaw.banner_img,
          iconImg: subredditDataRaw.icon_img,
          color: subredditDataRaw.key_color || DEFAULT_COLOR,
        };
        subredditData.textColor = getTextColor(this.subredditData.color);
      } else {
        subredditData = DEFAULT_SUBREDDIT_DATA;
      }
      return subredditData;
    },
    async getPosts({ after } = {}) {
      const modifier = this.$route.params.modifier;
      let requestUrl = `https://www.reddit.com/${this.subreddit}${modifier ? `/${modifier}` : ''}.json?limit=10`;
      if (after) {
        requestUrl += `&after=t3_${after}`;
      }
      const response = await this.$http.get(requestUrl);
      const posts = response.body.data.children.map(({ data: post }) => {
        const id = post.id;
        const title = he.decode(post.title);
        const score = utils.formatNumber(post.score);
        const commentCount = utils.formatNumber(post.num_comments);
        const subredditName = post.subreddit_name_prefixed;
        const author = post.author;
        const date = moment.utc(parseInt(`${post.created_utc}000`, 10)).fromNow();
        const domain = post.domain;
        const thumbnail = (!post.thumbnail || post.thumbnail === 'default') ? 'static/reddit.jpeg' : post.thumbnail;
        const permalink = post.permalink;
        const isSticky = post.stickied;
        const tag = he.decode(post.link_flair_text || '');
        let url = post.url;
        let clickUrl;
        let detailsPromise = Promise.resolve();
        let mediaId;

        let type;
        if (url.endsWith('.gifv')) {
          url = url.replace(/gifv$/, 'mp4');
          type = this.postType.VIDEO;
        } else if (url.endsWith('.mp4')) {
          type = this.postType.VIDEO;
        } else if (url.startsWith('https://imgur.com/a/')) {
          type = this.postType.IMAGE;
          clickUrl = url;
          url = _.get(post, 'media.oembed.thumbnail_url', '').replace('?fb', '');
        } else if (url.endsWith('.gif')) {
          type = this.postType.GIF;
        } else if (url.endsWith('.png') || url.endsWith('.jpg') || domain === 'i.imgur.com') {
          type = this.postType.IMAGE;
        } else if (domain === 'imgur.com') {
          type = this.postType.IMAGE;
          url = `${url.replace('imgur.com', 'i.imgur.com')}.jpg`;
        } else if (domain.startsWith('self.')) {
          type = this.postType.SELF;
          detailsPromise = this.$http.get(`${url.slice(0, -1)}.json`);
        } else if (domain.endsWith('youtube.com') || domain === 'youtu.be') {
          type = this.postType.YOUTUBE;
          mediaId = getYoutubeId(url);
        } else if (domain === 'clips.twitch.tv') {
          type = this.postType.TWITCH;
          mediaId = getTwitchId(url);
        } else if (domain === 'gfycat.com') {
          type = this.postType.GFYCAT;
          mediaId = getGfycatId(url);
        // } else if (domain === 'v.redd.it') {
        //   type = this.postType.VREDDIT;
        // instagram
        } else if (domain === 'streamable.com') {
          type = this.postType.STREAMABLE;
          mediaId = getStreamableId(url);
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
          permalink,
          clickUrl,
          tag,
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
      tabs: [{
        name: 'Hot',
        icon: 'fire',
        modifier: undefined,
      }, {
        name: 'New',
        icon: 'bolt',
        modifier: 'new',
      }, {
        name: 'Rising',
        icon: 'line-chart',
        modifier: 'rising',
      }, {
        name: 'Controversial',
        icon: 'compress',
        modifier: 'controversial',
      }, {
        name: 'Top',
        icon: 'trophy',
        modifier: 'top',
      }],
      isPageLoading: true,
      isPostsLoading: false,
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
    Heading,
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
