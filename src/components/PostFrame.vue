<template>
  <div class="card post">
    <header class="card-header" v-bind:style="{ 'background-color': color }">
      <p class="card-header-title no-wrap" v-bind:style="{ 'color': textColor, overflow: 'auto' }">
        <router-link :to="`/${subreddit}`">{{ subreddit }}</router-link>
        &nbsp;&middot;
        {{ date }}
        &middot;&nbsp;
        <a :href="url" target="_blank">{{ domain }}</a>
      </p>
    </header>

    <div class="card-content" style="overflow-x: auto;">
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>

    <footer class="card-footer">
      <label class="card-footer-item" style="color: #2ecc71;">
          <b-icon style="margin-right: 8px;" pack="fa" icon="arrow-up"></b-icon> {{ score }}
      </label>
      <a @mouseover="loadTopComments(permalink)" ref="tippy" v-tippy="{
        theme: 'light',
        arrow: true,
        interactive: true,
        size: 'small',
        sticky: true,
        delay: [300, 100],
        popperOptions: {
          modifiers: {
            flip: {
              enabled: false
            }
          }
        }
      }" class="card-footer-item" :data-html="`#tooltip-content-${id}`">
        <div :id="`tooltip-content-${id}`" style="display:none">
          <strong>
            <b-icon pack="fa" icon="trophy" size="is-small" style="margin-bottom: 4px;"></b-icon> Top Comments
          </strong>
          <div v-if="areCommentsLoading">
            <rotate-loader style="margin-top: 14%; margin-bottom: 13%;"></rotate-loader>
          </div>
          <div v-else style="padding: 10px">
            <div v-if="!comments.length">
              <h4 class="title is-4" style="margin-top: 25px; color: #95a5a6;">No comments</h4>
            </div>
            <article class="media" v-for="comment in comments" :key="comment.id">
              <div class="media-content">
                <div class="content">
                  <strong>{{ comment.author }}</strong>
                  &middot;
                  {{ comment.date }}
                  &middot;
                  <b-icon pack="fa" icon="arrow-up" size="is-small" style="margin-bottom: 4px; color: #2ecc71"></b-icon>
                  <span style="color: #2ecc71;">{{ comment.score }}</span>
                  <b-icon v-if="comment.isGilded" pack="fa" icon="star" size="is-small" style="margin-bottom: 3px; color: #FFD700"></b-icon>
                  <b-icon v-if="comment.isSticky" pack="fa" icon="thumb-tack" class="fa-rotate-270" size="is-small" style="margin-bottom: 3px; color: #e74c3c;"></b-icon>
                  <strong v-if="comment.isOP" style="color: #3498db; text-transform: uppercase;">op</strong>
                  <br>
                  <span v-html="comment.body"></span>
                </div>
              </div>
            </article>
          </div>
          <button
            @click="closeTooltip"
            :onclick="`document.getElementById('close-tooltip-${id}').click()`"
            :id="`close-tooltip-${id}`"
            class="button is-primary hide-on-desktop"
            style="width: 55%; margin-bottom: 10px; margin-top: 20px;"
          >
            Close
          </button>
        </div>
        <b-icon style="margin-right: 8px;" pack="fa" icon="comments-o"></b-icon>{{ commentCount }}
      </a>
    </footer>
  </div>
</template>

<script>
import common from '@/common';
import PostTitle from '@/components/PostTitle';
import ThumbnailPostTitle from '@/components/ThumbnailPostTitle';
import VueMarkdown from 'vue-markdown';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import _ from 'lodash';
import he from 'he';
import moment from 'moment';

export default {
  name: 'postFrame',
  data() {
    return {
      areCommentsLoading: false,
      comments: [],
      subreddit: this.post.subreddit_name_prefixed,
      date: common.formatDate(this.post.created_utc),
      url: this.post.url,
      domain: this.post.domain,
      score: common.formatNumber(this.post.score),
      permalink: this.post.permalink,
      id: this.post.id,
      commentCount: common.formatNumber(this.post.num_comments),
    };
  },
  methods: {
    closeTooltip() {
      this.$tippy.hidePopper(this.$refs.tippy);
    },
    async loadTopComments(permalink) {
      if (_.isEmpty(this.comments)) {
        this.areCommentsLoading = true;
        const response = await this.$http.get(`https://www.reddit.com${permalink}.json`);
        const comments = _.get(response, 'body[1].data.children', []);
        this.comments = comments
          .map(({ data: comment }) => ({
            id: comment.id,
            author: comment.author,
            body: comment.body_html ? he.decode(comment.body_html) : comment.body,
            score: common.formatNumber(comment.score),
            date: moment.utc(parseInt(`${comment.created_utc}000`, 10)).fromNow(),
            isOP: comment.is_submitter,
            isGilded: comment.gilded > 0,
            isSticky: comment.stickied,
          }))
          .filter(({ body }) => !_.includes(body, '<div class="md"><p>[removed]</p>'))
          .slice(0, 3);
        this.areCommentsLoading = false;
      }
    },
  },
  components: {
    VueMarkdown,
    RotateLoader,
    PostTitle,
    ThumbnailPostTitle,
  },
  props: [
    'post',
    'color',
    'textColor',
  ],
};
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .card-header-title {
    padding: 0.4rem;
    font-size: 0.8rem;
  }

  .post {
    width: 100%;
    margin: 25px auto;
  }

  .card-content {
    padding: 0px;
  }

  .card-content .text-content {
    padding: 1.5rem;
  }
}

@media screen and (min-width: 769px) {
  .post {
    max-width: 700px;
    margin: 25px auto;
  }
}

.card-header a {
  color: inherit;
}

.text-content {
  text-align: justify;
}

</style>

