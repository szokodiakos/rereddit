<template>
  <Post v-bind="$props">
    <div slot="content">
      <iframe
        class="center full-width"
        :src="`https://clips.twitch.tv/embed?clip=${mediaId}&autoplay=false&tt_medium=clips_embed`"
        width="640"
        height="360"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
      ></iframe>
      <br class="hide-on-desktop">
    </div>
  </Post>
</template>

<script>
import Post from '@/components/Post';

function getTwitchId(url) {
  const regExp = /^.*clips\.twitch\.tv\/(.*)\??/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

export default {
  name: 'twitchPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      mediaId: getTwitchId(this.post.url),
    };
  },
  components: {
    Post,
  },
};
</script>
