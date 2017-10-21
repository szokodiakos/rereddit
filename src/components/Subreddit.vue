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
import { mapMutations } from 'vuex';
import modifiers from '@/enums/modifiers';
import Page from '@/components/Page';
import ModifierDropdown from '@/components/ModifierDropdown';
import Tabs from '@/components/Tabs';
import Posts from '@/components/Posts';

export default {
  name: 'subreddit',
  beforeRouteLeave(to, from, next) {
    this.saveScrollY(window.pageYOffset);
    next();
  },
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
    ...mapMutations(['saveScrollY']),
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
