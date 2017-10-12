<template>
  <Page :subreddit="subreddit">

  </Page>
</template>

<script>
import Page from '@/components/Page';

export default {
  name: 'postDetails',
  created() {
  },
  computed: {
    subreddit() {
      return this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
    },
  },
  components: {
    Page,
  },
};
</script>

<style scoped>

</style>
