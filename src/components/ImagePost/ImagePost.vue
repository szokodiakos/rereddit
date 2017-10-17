<template>
  <Post v-bind="$props" :is-loading="isLoading">
    <div slot="content">
      <a target="_blank" :href="clickUrl"><img class="center full-width" :src="url"></img></a>
    </div>
  </Post>
</template>

<script>
import _ from 'lodash';
import Post from '@/components/Post';

export default {
  name: 'imagePost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      url: this.post.url,
      clickUrl: this.post.url,
      isLoading: true,
    };
  },
  created() {
    const domain = this.post.domain;
    const isImgurAlbum = this.url.startsWith('https://imgur.com/a/');
    if (isImgurAlbum) {
      this.url = _.get(this.post, 'media.oembed.thumbnail_url', '').replace('?fb', '');
    } else if (domain === 'imgur.com') {
      this.url = `${this.url.replace('imgur.com', 'i.imgur.com')}.jpg`;
    }
    const image = new Image();
    image.src = this.url;
    image.onload = () => { this.isLoading = false; };
  },
  components: {
    Post,
  },
};
</script>
