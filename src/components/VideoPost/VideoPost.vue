<template>
  <Post v-bind="$props">
    <div slot="content">
      <video class="center full-width" preload="auto" autoplay muted loop webkit-playsinline playsinline>
        <source :src="url" type="video/mp4"></source>
      </video>
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
    if (url.endsWith('.gifv')) {
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
