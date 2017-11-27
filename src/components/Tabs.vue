<template>
  <div class="tabs is-centered">
    <ul :class="{ 'dark-borders': isDarkModeOn }">
      <li v-for="tab in tabs" :key="tab.name" :class="{ 'is-active': isActiveTab(tab.modifier) }">
        <router-link :to="getRouteLink(tab.modifier)" :class="['tab-item', { 'dark-borders': isDarkModeOn }]">
          <i :class="`fa fa-${tab.icon}`"></i>
          <span :class="{ 'hide-on-mobile': !isActiveTab(tab.modifier) }">&nbsp;{{ tab.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modifiers from '@/enums/modifiers';

export default {
  name: 'tabs',
  data() {
    return {
      currentModifier: modifiers.HOT,
      tabs: [{
        name: 'Hot',
        icon: 'fire',
        modifier: modifiers.HOT,
      }, {
        name: 'New',
        icon: 'bolt',
        modifier: modifiers.NEW,
      }, {
        name: 'Rising',
        icon: 'line-chart',
        modifier: modifiers.RISING,
      }, {
        name: 'Controversial',
        icon: 'compress',
        modifier: modifiers.CONTROVERSIAL,
      }, {
        name: 'Top',
        icon: 'trophy',
        modifier: modifiers.TOP,
      }],
    };
  },
  watch: {
    async $route() {
      this.currentModifier = this.$route.params.modifier;
    },
  },
  created() {
    this.currentModifier = this.$route.params.modifier;
  },
  computed: {
    ...mapGetters(['isDarkModeOn']),
  },
  methods: {
    getRouteLink(tabModifier = '') {
      const currentModifier = this.currentModifier;

      if (currentModifier === tabModifier) {
        return this.$route.path;
      }

      if (!currentModifier) {
        if (this.$route.path === '/') {
          return `${this.$route.path}${tabModifier}`;
        }
        return `${this.$route.path}/${tabModifier}`;
      }

      if (!tabModifier) {
        const result = this.$route.path.replace(`/${currentModifier}`, tabModifier);
        if (!result) {
          return '/';
        }
        return result;
      }
      return this.$route.path.replace(currentModifier, tabModifier);
    },
    isActiveTab(tabModifier) {
      const currentModifier = this.currentModifier;
      return tabModifier === currentModifier;
    },
  },
};
</script>

<style scoped>
.tab-item {
  height: 41px;
}

.dark-borders {
  border-color: black;
}
</style>
