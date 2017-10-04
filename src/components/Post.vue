<template>
  <div class="card post">
    <header class="card-header" v-bind:style="{ 'background-color': color }">
      <p class="card-header-title no-wrap" v-bind:style="{ 'color': textColor }">
        <router-link :to="`/${subreddit}`">{{ subreddit }}</router-link>&nbsp;&middot; {{ date }} &middot; <a :href="url" target="_blank">{{ domain }}</a>
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <div v-if="type !== postType.OTHER">
          <p class="title">
            <a :href="url" target="_blank">
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
          </p>
        </div>
        <div v-if="type === postType.OTHER">
          <article class="media">
            <figure class="media-left hide-on-mobile">
              <p class="image width-128">
                <a :href="url" target="_blank">
                  <img :src="thumbnail">
                </a>
              </p>
            </figure>
            <div class="media-content">
              <a :href="url" target="_blank">
                <p class="title">{{ title }}</p>
              </a>
              <p class="image width-128 hide-on-desktop center" style="margin-top: 10px;">
                <a :href="url" target="_blank">
                  <img :src="thumbnail">
                </a>
              </p>
            </div>
          </article>
        </div>
        <br>
        <div v-if="type === postType.VIDEO">
          <video class="center full-width" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
            <source :src="url" type="video/mp4"></source>
          </video>
        </div>
        <div v-if="type === postType.IMAGE || type === postType.GIF">
          <a target="_blank" :href="url"><img class="center full-width" :src="url"></img></a>
        </div>
        <div v-if="type === postType.SELF">
          <p class="text-content"><vue-markdown>{{ details }}</vue-markdown></p>
        </div>
        <div v-if="type === postType.YOUTUBE">
          <iframe
            class="center full-width"
            width="840"
            height="472"
            :src="`https://www.youtube.com/embed/${mediaId}?rel=0&amp;showinfo=0`"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <div v-if="type === postType.TWITCH">
          <iframe
            class="center full-width"
            :src="`https://clips.twitch.tv/embed?clip=${mediaId}&autoplay=false&tt_medium=clips_embed`"
            width="840"
            height="472"
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
              width="840"
              height="472"
              allowfullscreen
            ></iframe>
        </div>
        <!-- <div v-if="type === postType.VREDDIT">
        </div> -->
      </div>
    </div>
    <footer class="card-footer">
      <label class="card-footer-item" style="text-transform: uppercase;">
        <!-- <a href="#" class="card-footer-item">
          <b-icon pack="fa" icon="arrow-up"></b-icon>
        </a>
        <label class="card-footer-item" style="text-transform: uppercase;"> -->
          <b-icon style="margin-right: 8px;" pack="fa" icon="star-half-o"></b-icon> {{ score }}
        <!-- </label>
        <a href="#" class="card-footer-item">
          <b-icon pack="fa" icon="arrow-down"></b-icon>
        </a> -->
      </label>
      <a href="#" class="card-footer-item" style="text-transform: uppercase;">
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
import VueMarkdown from 'vue-markdown';

export default {
  name: 'post',
  data() {
    return {
      postType,
    };
  },
  components: {
    VueMarkdown,
  },
  props: [
    'color',
    'textColor',
    'subreddit',
    'date',
    'url',
    'domain',
    'isSticky',
    'type',
    'thumbnail',
    'title',
    'details',
    'mediaId',
    'score',
    'commentCount',
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
    max-width: 900px;
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

</style>

