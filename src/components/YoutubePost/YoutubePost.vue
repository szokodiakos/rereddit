<template>
  <Post v-bind="$props">
    <div slot="content">
      <iframe
        class="center full-width"
        width="640"
        height="360"
        :src="`https://www.youtube.com/embed/${mediaId}?rel=0&amp;showinfo=0`"
        frameborder="0"
        allowfullscreen
      ></iframe>
      <br class="hide-on-desktop">
    </div>
  </Post>
</template>

<script>
import Post from '@/components/Post';

function getYoutubeId(url) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return undefined;
}

export default {
  name: 'youtubePost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      mediaId: getYoutubeId(this.post.url),
    };
  },
  components: {
    Post,
  },
};
</script>
