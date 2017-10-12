<template>
  <Post v-bind="$props">
    <div slot="content" style="position:relative;padding-bottom:57%" class="full-width">
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
  </Post>
</template>

<script>
import _ from 'lodash';
import Post from '@/components/Post';

function getGfycatId(url) {
  const regExp = /^.*gfycat\.com\/(.*)/;
  const match = url.match(regExp);
  if (match) {
    return _.last(url.split('/'));
  }
  return undefined;
}

export default {
  name: 'gfycatPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      mediaId: getGfycatId(this.post.url),
    };
  },
  components: {
    Post,
  },
};
</script>
