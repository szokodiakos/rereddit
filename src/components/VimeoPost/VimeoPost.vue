<template>
  <Post v-bind="$props">
    <div slot="content">
      <iframe
        :src="`https://player.vimeo.com/video/${mediaId}?color=dcd5cc`"
        width="640"
        height="360"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
      ></iframe>
      <br class="hide-on-desktop">
    </div>
  </Post>
</template>

<script>
import Post from '@/components/Post';

function getVimeoId(url) {
  const regExp = /^.*vimeo\.com\/(.*)\??/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

export default {
  name: 'vimeoPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      mediaId: getVimeoId(this.post.url),
    };
  },
  components: {
    Post,
  },
};
</script>
