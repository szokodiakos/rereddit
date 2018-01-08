<template>
  <Post v-bind="$props" :is-loading="isLoading">
    <div slot="content">
      <p v-if="details" class="text-content"><vue-markdown :source="details"></vue-markdown></p>
      <br v-else class="hide-on-desktop">
    </div>
  </Post>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import _ from 'lodash';
import axios from 'axios';
import he from 'he';
import Post from '@/components/Post';

async function getDetails(url) {
  const response = await axios.get(`${url.slice(0, -1)}.json`);
  const details = he.decode(_.get(response, 'data.[0].data.children[0].data.selftext', ''));
  return details;
}

export default {
  name: 'selfPost',
  props: [
    'post',
    'color',
    'textColor',
  ],
  methods: {
    getDetails: _.memoize(getDetails),
  },
  data() {
    return {
      url: this.post.url,
      details: this.details,
      isLoading: true,
    };
  },
  async created() {
    this.details = await this.getDetails(this.url);
    this.isLoading = false;
  },
  components: {
    Post,
    VueMarkdown,
  },
};
</script>
