<template>
  <Page :subreddit="subreddit">
    <div slot="content">
      <Tabs></Tabs>

      <div v-if="modifier === modifiers.CONTROVERSIAL || modifier === modifiers.TOP">
        <ModifierDropdown></ModifierDropdown>
      </div>

      <Posts :modifier="modifier" :subreddit="subreddit"></Posts>
    </div>
  </Page>
</template>

<script>
import modifiers from '@/enums/modifiers';
import Page from '@/components/Page';
import ModifierDropdown from '@/components/ModifierDropdown';
import Tabs from '@/components/Tabs';
import Posts from '@/components/Posts';

export default {
  name: 'subreddit',
  created() {
    this.setTitle();
  },
  watch: {
    $route() {
      this.setTitle();
    },
  },
  computed: {
    subreddit() {
      return this.$route.params.subreddit ? `/r/${this.$route.params.subreddit}` : '';
    },
    modifier() {
      return this.$route.params.modifier;
    },
  },
  methods: {
    setTitle() {
      if (this.subreddit) {
        document.title = `${this.subreddit} - Rereddit`;
      } else {
        document.title = 'Rereddit - alternative Reddit client';
      }
    },
  },
  data() {
    return {
      modifiers,
    };
  },
  components: {
    Page,
    Tabs,
    ModifierDropdown,
    Posts,
  },
};
</script>
