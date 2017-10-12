<template>
  <Post v-bind="$props" :is-loading="isLoading">
    <div slot="content">
      <p class="text-content"><vue-markdown v-bind:source="details"></vue-markdown></p>
    </div>
  </Post>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import _ from 'lodash';
import he from 'he';
import Post from '@/components/Post';

export default {
  name: 'selfPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  data() {
    return {
      url: this.post.url,
      details: this.details,
      isLoading: true,
    };
  },
  async created() {
    const response = await this.$http.get(`${this.url.slice(0, -1)}.json`);
    this.details = he.decode(_.get(response, 'body.[0].data.children[0].data.selftext', ''));
    this.isLoading = false;
  },
  components: {
    Post,
    VueMarkdown,
  },
};
</script>
