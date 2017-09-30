<template>
  <div id="app">
    <div class="card" v-for="post in posts" v-bind:key="post.id" style="max-width: 900px; margin: 25px auto;">
      <header class="card-header">
        <p class="card-header-title">
          {{ post.subreddit }} &middot; {{ post.date }}
        </p>
        <p class="card-header-title" style="justify-content: flex-end; color: grey; font-weight: normal;">
          {{ post.domain }}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <p class="title">{{ post.title }}</p>
          <div v-if="post.type === postType.VIDEO">
            <video style="display:block;margin:auto;"  preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
              <source :src="post.url" type="video/mp4"></source>
            </video>
          </div>
          <div v-if="post.type === postType.IMAGE || post.type === postType.GIF">
            <img style="display:block;margin:auto;" :src="post.url"></img>
          </div>
          <div v-if="post.type === postType.TEXT">
            <p>{{ post.details }}</p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <label class="card-footer-item">
          <a href="#" class="card-footer-item">
            <b-icon pack="fa" icon="arrow-up"></b-icon>
          </a>
          <label class="card-footer-item">
            {{ post.score }}
          </label>
          <a href="#" class="card-footer-item">
            <b-icon pack="fa" icon="arrow-down"></b-icon>
          </a>
        </label>
        <a href="#" class="card-footer-item">
          <b-icon style="margin-right: 8px;" pack="fa" icon="comments-o"></b-icon>{{ post.commentCount }}
        </a>
        <a href="#" class="card-footer-item">
          <b-icon style="margin-right: 8px;" pack="fa" icon="share"></b-icon>Share
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';

export default {
  name: 'app',
  created: async function created() {
    const response = await this.$http.get('https://www.reddit.com/r/all/hot.json');
    this.posts = response.body.data.children.map(({ data: post }) => {
      let type;
      if (post.url.endsWith('.gifv') || post.url.endsWith('.mp4')) {
        type = this.postType.VIDEO;
      }
      if (post.url.endsWith('.png') || post.url.endsWith('.jpg')) {
        type = this.postType.IMAGE;
      }
      if (post.url.endsWith('.gif')) {
        type = this.postType.GIF;
      }
      if (post.domain.startsWith('self.')) {
        type = this.postType.TEXT;
      }

      return {
        id: post.id,
        title: post.title,
        score: numeral(post.score).format('0a'),
        commentCount: numeral(post.num_comments).format('0a'),
        url: post.url.endsWith('.gifv') ? post.url.replace(/gifv$/, 'mp4') : post.url,
        subreddit: post.subreddit_name_prefixed,
        author: post.author,
        domain: post.domain,
        date: moment.utc(parseInt(`${post.created_utc}000`, 10)).fromNow(),
        detailsPromise: type === this.postType.TEXT ?
          this.$http.get(`${post.url.slice(0, -1)}.json`) :
          Promise.resolve(),
        type,
      };
    });

    this.posts = await Promise.all(this.posts.map(async (post) => {
      const rawDetails = await post.detailsPromise;
      const details = _.get(rawDetails, 'body.[0].data.children[0].data.selftext');
      return {
        ...post,
        details,
      };
    }));
  },
  data() {
    return {
      posts: [],
      postType: {
        TEXT: 'text',
        VIDEO: 'video',
        IMAGE: 'image',
        GIF: 'gif',
      },
    };
  },
};
</script>
