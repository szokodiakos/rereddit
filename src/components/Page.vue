<template>
  <div>
    <div
      v-if="isLoading"
      style="position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);"
    >
      <rotate-loader></rotate-loader>
    </div>
    <div v-else :class="{ 'black-background': isDarkModeOn }">
      <Heading
        :is-compact="isCompactHeading"
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

      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RotateLoader from 'vue-spinner/src/RotateLoader';
import jump from 'jump.js';
import JumpToTop from '@/components/JumpToTop';
import Heading from '@/components/Heading';
import common from '@/common';

const DEFAULT_SUBREDDIT_DATA = {
  color: common.DEFAULT_COLOR,
  textColor: common.getTextColor(common.DEFAULT_COLOR),
};

export default {
  name: 'page',
  props: [
    'subreddit',
    'isCompactHeading',
  ],
  computed: {
    ...mapGetters(['isDarkModeOn']),
  },
  methods: {
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

        subredditData.textColor = common.getTextColor(subredditData.color);
      } else {
        subredditData = DEFAULT_SUBREDDIT_DATA;
      }

      return subredditData;
    },
  },
  data() {
    return {
      isLoading: true,
      subredditData: DEFAULT_SUBREDDIT_DATA,
    };
  },
  watch: {
    async $route(to, from) {
      const isNewSubredditNavigaition = to.params.subreddit !== from.params.subreddit;
      if (isNewSubredditNavigaition) {
        this.isPageLoading = true;
        this.subredditData = await this.getSubredditData();
        this.isPageLoading = false;
      }
    },
  },
  async created() {
    this.subredditData = await this.getSubredditData();
    this.isLoading = false;
  },
  components: {
    RotateLoader,
    JumpToTop,
    Heading,
  },
};
</script>
