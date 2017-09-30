<template>
  <div>
    <div v-if="isInitialLoad" style="position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
      <rotate-loader></rotate-loader>
    </div>
    <section v-if="!isInitialLoad" class="hero is-primary is-bold">
      <div v-if="!subreddit" class="hero-body" v-bind:style="{ 'background-color': defaultColor }">
        <div class="container">
          <h1 class="title">
            Rereddit
          </h1>
          <h2 class="subtitle">
            An alternative <i class="fa fa-reddit-alien" aria-hidden="true"></i> client
          </h2>
        </div>
      </div>
      <div v-if="subreddit" class="hero-body" v-bind:style="{
        'background-image': `-webkit-linear-gradient(left, ${subredditData.color}, rgba(0,0,0,0))${subredditData.bannerImg ? `, url(${subredditData.bannerImg})` : ''}`,
        'background-size': `auto, cover`,
      }">
        <div class="container">
          <h1 class="title" v-bind:style="{ color: subredditData.textColor }">
            {{ subreddit }}
          </h1>
          <h2 v-if="subredditData.title" class="subtitle" v-bind:style="{ color: subredditData.textColor }">
            {{ subredditData.title }}
          </h2>
        </div>
      </div>
    </section>
    <div class="card" v-for="post in posts" v-bind:key="post.id" style="max-width: 900px; margin: 25px auto;">
      <header class="card-header" v-bind:style="{ 'background-color': post.color }">
        <p class="card-header-title" v-bind:style="{ 'color': post.textColor }">
          <router-link :to="`/${post.subreddit}`">{{ post.subreddit }}</router-link>&nbsp;&middot; {{ post.date }} &middot; {{ post.domain }}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <div v-if="post.type !== postType.OTHER">
            <p class="title">
              <a :href="post.url" target="_blank">
                <b-icon
                  v-if="post.isSticky"
                  style="padding-left: 5px; color: #e74c3c;"
                  size="is-medium"
                  class="fa-rotate-270"
                  pack="fa"
                  icon="thumb-tack"
                ></b-icon>
                {{ post.title }}
              </a>
            </p>
          </div>
          <div v-if="post.type === postType.OTHER">
            <article class="media">
              <figure class="media-left">
                <p class="image is-128x128">
                  <a :href="post.url" target="_blank">
                    <img :src="post.thumbnail">
                  </a>
                </p>
              </figure>
              <div class="media-content">
                <a :href="post.url" target="_blank">
                  <p class="title">{{ post.title }}</p>
                </a>
              </div>
            </article>
          </div>
          <br>
          <div v-if="post.type === postType.VIDEO">
            <video style="display:block;margin:auto;"  preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
              <source :src="post.url" type="video/mp4"></source>
            </video>
          </div>
          <div v-if="post.type === postType.IMAGE || post.type === postType.GIF">
            <img style="display:block;margin:auto;" :src="post.url"></img>
          </div>
          <div v-if="post.type === postType.SELF">
            <p><vue-markdown>{{ post.details }}</vue-markdown></p>
          </div>
          <div v-if="post.type === postType.YOUTUBE">
            <iframe
              style="display:block;margin:auto;"
              width="840"
              height="472"
              :src="`https://www.youtube.com/embed/${post.youtubeId}?rel=0&amp;showinfo=0`"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          <div v-if="post.type === postType.TWITCH">
            <iframe
              style="display:block;margin:auto;"
              :src="`https://clips.twitch.tv/embed?clip=${post.twitchId}&autoplay=false&tt_medium=clips_embed`"
              width="840"
              height="472"
              frameborder="0"
              scrolling="no"
              allowfullscreen="true"
            ></iframe>
          </div>
          <div v-if="post.type === postType.GFYCAT">
            <div style="position:relative;padding-bottom:57%">
              <iframe
                :src="`https://gfycat.com/ifr/${post.gfycatId}`"
                frameborder="0"
                scrolling="no"
                width="100%"
                height="100%"
                style="position:absolute;top:0;left:0;"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <div v-if="post.type === postType.STREAMABLE">
              <iframe
                :src="`https://streamable.com/s/${post.streamableId}`"
                frameborder="0"
                width="840"
                height="472"
                allowfullscreen
              ></iframe>
          </div>
          <!-- <div v-if="post.type === postType.VREDDIT">
          </div> -->
        </div>
      </div>
      <footer class="card-footer">
        <label class="card-footer-item">
          <a href="#" class="card-footer-item">
            <b-icon pack="fa" icon="arrow-up"></b-icon>
          </a>
          <label class="card-footer-item" style="text-transform: uppercase;">
            {{ post.score }}
          </label>
          <a href="#" class="card-footer-item">
            <b-icon pack="fa" icon="arrow-down"></b-icon>
          </a>
        </label>
        <a href="#" class="card-footer-item" style="text-transform: uppercase;">
          <b-icon style="margin-right: 8px;" pack="fa" icon="comments-o"></b-icon>{{ post.commentCount }}
        </a>
        <a href="#" class="card-footer-item">
          <b-icon size="is-medium" style="margin-right: 8px;" pack="fa" icon="share"></b-icon>
        </a>
      </footer>
    </div>
    <infinite-loading
      style="height: 100px; margin-top:50px"
      v-if="lastPostId && !isInitialLoad"
      @infinite="infiniteHandler"
      v-bind:distance="2000"
    >
      <span slot="spinner">
        <rotate-loader></rotate-loader>
      </span>
    </infinite-loading>
  </div>
</template>

<script>
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';
import InfiniteLoading from 'vue-infinite-loading';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import VueMarkdown from 'vue-markdown';

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
    async getColorBySubreddit(subreddit) {
      if (!this.colors[subreddit]) {
        const response = await this.$http.get(`https://www.reddit.com/${subreddit}/about.json`);
        const color = _.get(response, 'body.data.key_color') || this.defaultColor;
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
          color: subredditData.key_color || this.defaultColor,
        };
        this.subredditData.textColor = getTextColor(this.subredditData.color);
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
        let youtubeId;
        let twitchId;
        let gfycatId;
        let streamableId;

        let type;
        if (post.url.endsWith('.gifv')) {
          url = post.url.replace(/gifv$/, 'mp4');
          type = this.postType.VIDEO;
        } else if (post.url.endsWith('.mp4')) {
          type = this.postType.VIDEO;
        } else if (post.url.endsWith('.png') || post.url.endsWith('.jpg')) {
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
          youtubeId = getYoutubeId(post.url);
        } else if (post.domain === 'clips.twitch.tv') {
          type = this.postType.TWITCH;
          twitchId = getTwitchId(post.url);
        } else if (post.domain === 'gfycat.com') {
          type = this.postType.GFYCAT;
          gfycatId = getGfycatId(post.url);
        // } else if (post.domain === 'v.redd.it') {
        //   type = this.postType.VREDDIT;
        } else if (post.domain === 'streamable.com') {
          type = this.postType.STREAMABLE;
          streamableId = getStreamableId(post.url);
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
          youtubeId,
          twitchId,
          isSticky,
          gfycatId,
          streamableId,
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
      defaultColor: '#c0392b',
      isInitialLoad: true,
      subreddit: '',
      colors: {},
      posts: [],
      subredditData: {},
      postType: {
        SELF: 'self',
        VIDEO: 'video',
        IMAGE: 'image',
        GIF: 'gif',
        YOUTUBE: 'youtube',
        TWITCH: 'twitch',
        OTHER: 'other',
        GFYCAT: 'gfycat',
        VREDDIT: 'vreddit',
        STREAMABLE: 'streamable',
      },
      lastPostId: '',
    };
  },
  components: {
    InfiniteLoading,
    RotateLoader,
    VueMarkdown,
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
