<template>
  <div class="card post">
    <header class="card-header" v-bind:style="{ 'background-color': color }">
      <p class="card-header-title no-wrap" v-bind:style="{ 'color': textColor }">
        <router-link :to="`/${subreddit}`">{{ subreddit }}</router-link>
        &nbsp;&middot;
        {{ date }}
        &middot;&nbsp;
        <a :href="clickUrl" target="_blank">{{ domain }}</a>
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <div v-if="type !== postType.OTHER">
          <p class="title">
            <a :href="clickUrl" target="_blank">
              <b-icon
                v-if="isSticky"
                style="padding-left: 5px; color: #e74c3c;"
                size="is-medium"
                class="fa-rotate-270"
                pack="fa"
                icon="thumb-tack"
              ></b-icon>
              {{ title }}
            </a>
            <span v-if="tag" class="tag">{{ tag }}</span>
          </p>
        </div>
        <div v-if="type === postType.OTHER">
          <article class="media">
            <figure class="media-left hide-on-mobile">
              <p class="image width-128">
                <a :href="clickUrl" target="_blank">
                  <img :src="thumbnail">
                </a>
              </p>
            </figure>
            <div class="media-content">
              <a :href="clickUrl" target="_blank">
                <p class="title">{{ title }} <span v-if="tag" class="tag">{{ tag }}</span></p>
              </a>
              <p class="image width-128 hide-on-desktop center" style="margin-top: 10px;">
                <a :href="clickUrl" target="_blank">
                  <img :src="thumbnail">
                </a>
              </p>
              <br>
            </div>
          </article>
        </div>
        <br v-if="type !== postType.OTHER" class="hide-on-mobile">
        <div v-if="type === postType.VIDEO">
          <video class="center full-width" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
            <source :src="url" type="video/mp4"></source>
          </video>
        </div>
        <div v-if="type === postType.IMAGE || type === postType.GIF">
          <a target="_blank" :href="clickUrl"><img class="center full-width" :src="url"></img></a>
        </div>
        <div v-if="type === postType.SELF && details" style="overflow-x: auto;">
          <p class="text-content"><vue-markdown>{{ details }}</vue-markdown></p>
        </div>
        <div v-if="type === postType.YOUTUBE">
          <iframe
            class="center full-width"
            width="640"
            height="360"
            :src="`https://www.youtube.com/embed/${mediaId}?rel=0&amp;showinfo=0`"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <div v-if="type === postType.TWITCH">
          <iframe
            class="center full-width"
            :src="`https://clips.twitch.tv/embed?clip=${mediaId}&autoplay=false&tt_medium=clips_embed`"
            width="640"
            height="360"
            frameborder="0"
            scrolling="no"
            allowfullscreen="true"
          ></iframe>
        </div>
        <div v-if="type === postType.GFYCAT">
          <div style="position:relative;padding-bottom:57%" class="full-width">
            <iframe
              :src="`https://gfycat.com/ifr/${mediaId}`"
              frameborder="0"
              scrolling="no"
              width="100%"
              height="100%"
              style="position:absolute;top:0;left:0;"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div v-if="type === postType.STREAMABLE" class="full-width">
            <iframe
              :src="`https://streamable.com/s/${mediaId}`"
              frameborder="0"
              width="640"
              height="360"
              allowfullscreen
              style="max-width: 100%"
            ></iframe>
        </div>
        <!-- <div v-if="type === postType.VREDDIT">
        </div> -->
        <br v-if="type !== postType.OTHER" class="hide-on-desktop">
      </div>
    </div>
    <footer class="card-footer">
      <label class="card-footer-item" style="text-transform: uppercase; color: #2ecc71;">
        <!-- <a href="#" class="card-footer-item">
          <b-icon pack="fa" icon="arrow-up"></b-icon>
        </a>
        <label class="card-footer-item" style="text-transform: uppercase;"> -->
          <b-icon style="margin-right: 8px;" pack="fa" icon="arrow-up"></b-icon> {{ score }}
        <!-- </label>
        <a href="#" class="card-footer-item">
          <b-icon pack="fa" icon="arrow-down"></b-icon>
        </a> -->
      </label>
      <a @mouseover="loadTopComments(permalink)" ref="tippy" v-tippy="{
        theme: 'light',
        arrow: true,
        interactive: true,
        size: 'small',
        sticky: true,
        delay: [300, 100]
      }" class="card-footer-item" style="text-transform: uppercase;" :data-html="`#tooltip-content-${id}`">
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
            <article class="media" v-for="comment in comments" v-bind:key="comment.id">
              <div class="media-content">
                <div class="content">
                  <strong>{{ comment.author }}</strong>
                  &middot;
                  {{ comment.date }}
                  &middot;
                  <b-icon pack="fa" icon="arrow-up" size="is-small" style="margin-bottom: 4px; color: #2ecc71"></b-icon>
                  <span style="color: #2ecc71; text-transform: uppercase;">{{ comment.score }}</span>
                  <b-icon v-if="comment.isGilded" pack="fa" icon="star" size="is-small" style="margin-bottom: 3px; color: #FFD700"></b-icon>
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
      <!-- <a href="#" class="card-footer-item">
        <b-icon size="is-medium" style="margin-right: 8px;" pack="fa" icon="share"></b-icon>
      </a> -->
    </footer>
  </div>
</template>

<script>
import postType from '@/enums/postType';
import utils from '@/utils';
import VueMarkdown from 'vue-markdown';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import _ from 'lodash';
import he from 'he';
import moment from 'moment';

export default {
  name: 'post',
  data() {
    return {
      postType,
      areCommentsLoading: false,
      comments: [],
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
            score: utils.formatNumber(comment.score),
            date: moment.utc(parseInt(`${comment.created_utc}000`, 10)).fromNow(),
            isOP: comment.is_submitter,
            isGilded: comment.gilded > 0,
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
  },
  props: [
    'id',
    'color',
    'textColor',
    'subreddit',
    'date',
    'url',
    'clickUrl',
    'domain',
    'isSticky',
    'type',
    'thumbnail',
    'title',
    'details',
    'mediaId',
    'score',
    'commentCount',
    'permalink',
    'author',
    'tag',
  ],
};
</script>

<style>
@media screen and (max-width: 768px) {
  .post {
    width: 100%;
    margin: 25px auto;
  }

  .hide-on-mobile {
    display: none !important;
  }

  .card-content {
    padding: 0px;
  }

  .card-content .title {
    padding: 1.5rem;
  }

  .card-content .text-content {
    padding: 1.5rem;
  }

  .full-width {
    width: 100%;
  }
}

@media screen and (min-width: 769px) {
  .post {
    max-width: 700px;
    margin: 25px auto;
  }

  .hide-on-desktop {
    display: none !important;
  }
}

.center {
  display: block;
  margin: auto;
}

.width-128 {
  width: 128px;
}

.no-wrap {
  white-space: nowrap;
}

.tippy-tooltip.light-theme {
  min-height: 200px;
  width: 680px;
  max-width: 100%;
}

.tag {
  text-transform: uppercase;
}

</style>

