<template>
  <Post v-bind="$props">
    <div slot="content" class="full-width">
      <iframe
        :src="`https://streamable.com/s/${mediaId}`"
        frameborder="0"
        width="640"
        height="360"
        allowfullscreen
        style="max-width: 100%;display: flex;justify-content: center;"
      ></iframe>
      <br class="hide-on-desktop">
    </div>
  </Post>
</template>

<script>
import Post from '@/components/Post';

function getStreamableId(url) {
  const regExp = /^.*streamable\.com\/(.*)/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

export default {
  name: 'streamablePost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      mediaId: getStreamableId(this.post.url),
    };
  },
  components: {
    Post,
  },
};
</script>
