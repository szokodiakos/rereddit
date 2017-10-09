<template>
  <Page :is-loading="isPageLoading">
    <div slot="content">
      <Heading
        :color="subredditData.color"
        :banner-img="subredditData.bannerImg"
        :header-img="subredditData.headerImg"
        :text-color="subredditData.textColor"
        :subreddit="subreddit"
        :title="subredditData.title"
        :online-users="subredditData.onlineUsers"
        :total-users="subredditData.totalUsers"
      ></Heading>

      <JumpToTop
        :click="jumpToTop"
        :background-color="subredditData.color"
        :color="subredditData.textColor"
      ></JumpToTop>

      <Tabs></Tabs>

      <div v-if="modifier === modifiers.CONTROVERSIAL || modifier === modifiers.TOP">
        <ModifierDropdown></ModifierDropdown>
      </div>

      <Posts :modifier="modifier" :subreddit="subreddit"></Posts>
    </div>
  </Page>
</template>

<script>
import RotateLoader from 'vue-spinner/src/RotateLoader';
import jump from 'jump.js';
import modifiers from '@/enums/modifiers';
import Page from '@/components/Page';
import JumpToTop from '@/components/JumpToTop';
import Heading from '@/components/Heading';
import ModifierDropdown from '@/components/ModifierDropdown';
import Tabs from '@/components/Tabs';
import Posts from '@/components/Posts';
import common from '@/common';

const DEFAULT_SUBREDDIT_DATA = {
  color: common.DEFAULT_COLOR,
  textColor: common.getTextColor(common.DEFAULT_COLOR),
};

export default {
  name: 'subreddit',
  async created() {
    this.setTitle();
    this.subredditData = await this.getSubredditData();
    this.isPageLoading = false;
  },
  watch: {
    async $route(to, from) {
      const isNewSubredditNavigaition = to.params.subreddit !== from.params.subreddit;
      if (isNewSubredditNavigaition) {
        this.isPageLoading = true;
        this.setTitle();
        this.subredditData = await this.getSubredditData();
        this.isPageLoading = false;
      }
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
    jumpToTop() {
      jump('.jump-target');
    },
    async getSubredditData() {
      let subredditData;
      if (this.subreddit) {
        const subredditResponse = await this.$http.get(`https://www.reddit.com/${this.subreddit}/about.json`);
        const subredditDataRaw = subredditResponse.body.data;
        subredditData = {
          title: subredditDataRaw.title,
          onlineUsers: common.formatNumber(subredditDataRaw.accounts_active),
          totalUsers: common.formatNumber(subredditDataRaw.subscribers),
          headerImg: subredditDataRaw.header_img,
          bannerImg: subredditDataRaw.banner_img,
          iconImg: subredditDataRaw.icon_img,
          color: subredditDataRaw.key_color || common.DEFAULT_COLOR,
        };
        subredditData.textColor = common.getTextColor(this.subredditData.color);
      } else {
        subredditData = DEFAULT_SUBREDDIT_DATA;
      }
      return subredditData;
    },
  },
  data() {
    return {
      isPageLoading: true,
      subredditData: DEFAULT_SUBREDDIT_DATA,
      modifiers,
    };
  },
  components: {
    RotateLoader,
    Heading,
    Page,
    JumpToTop,
    Tabs,
    ModifierDropdown,
    Posts,
  },
};
</script>

<style scoped>

</style>
