<template>
  <Post v-bind="$props">
    <div slot="content">
      <video class="center full-width full-screen-height-max" preload="auto" autoplay muted loop webkit-playsinline playsinline>
        <source :src="url" type="video/mp4"></source>
      </video>
      <br class="hide-on-desktop">
    </div>
  </Post>
</template>

<script>
import Post from '@/components/Post';

export default {
  name: 'videoPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    let url = this.post.url;
    const domain = this.post.domain;

    if (domain === 'v.redd.it') {
      url = this.post.media.reddit_video.fallback_url;
    } else if (url.endsWith('.gifv')) {
      url = url.replace(/gifv$/, 'mp4');
    }

    return {
      url,
    };
  },
  components: {
    Post,
  },
};
</script>
