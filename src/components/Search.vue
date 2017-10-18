<template>
  <div class="field has-addons" style="justify-content: center;">
    <div class="control">
      <a class="button is-static go-to-button" :style="{ 'background-color': color, color: textColor }">
        Go to /r/
      </a>
    </div>
    <div class="control">
      <input
        @keyup="subredditSearchChange"
        @keydown="subredditSearchKeydown(results, $event)"
        @focus="stopTyped();showResults();"
        @click="showResults();"
        @blur="startTyped();hideResults();"
        ref="subredditSearch"
        class="input go-to-subreddit"
        type="text"
      >
      <ul class="options-list" @mousedown="prevent" v-show="isResultsShown">
        <li v-if="results.length === 1 && results[0].name === '-1'">Nothing found.</li>
        <li
          v-else
          v-for="result in results"
          :key="result.name"
          @click="openSubreddit(result)"
          @mouseover="resultMouseover(result)"
          :style="{
            'background-color': isActive(result, results[0]) ? color : 'white',
            color: isActive(result, results[0]) ? textColor: '#363636',
          }"
          :title="result.title"
          v-tippy="{
            position: 'bottom-start',
            delay: [200, 0],
            size: 'small'
          }"
          class="results-list-item"
        >
          {{ result.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Typed from 'typed.js';
import common from '@/common';

const TAB_KEY = 9;
const ENTER_KEY = 13;
const DOWN_ARROW = 40;
const UP_ARROW = 38;

export default {
  name: 'search',
  props: [
    'color',
    'textColor',
  ],
  async mounted() {
    const response = await this.$http.get('https://www.reddit.com/reddits/.json');
    this.subreddits = _
      .get(response, 'body.data.children', [])
      .map(rawSubreddit => rawSubreddit.data.display_name);
    this.$nextTick(() => {
      this.startTyped();
    });
  },
  data() {
    return {
      typed: null,
      subreddits: [],
      results: [],
      isResultsShown: false,
      mouseoveredResult: null,
    };
  },
  methods: {
    isActive(result) {
      return (this.mouseoveredResult.name === result.name);
    },
    subredditSearchKeydown(results, event) {
      if (event.which === TAB_KEY) {
        event.preventDefault();
        this.$refs.subredditSearch.value = this.mouseoveredResult.name;
      }

      if (event.which === ENTER_KEY) {
        if (this.isResultsShown) {
          this.$refs.subredditSearch.value = this.mouseoveredResult.name;
          this.openSubreddit();
        } else {
          this.openSubreddit();
        }
      }

      if (event.which === DOWN_ARROW) {
        event.preventDefault();
        this.mouseoveredResult =
          results[common.mod(
            _.findIndex(results, result => result.name === this.mouseoveredResult.name) + 1,
            results.length,
          )];
      }

      if (event.which === UP_ARROW) {
        event.preventDefault();
        this.mouseoveredResult =
          results[common.mod(
            _.findIndex(results, result => result.name === this.mouseoveredResult.name) - 1,
            results.length,
          )];
      }
    },
    openSubreddit(result) {
      const subreddit = result ? result.name : this.$refs.subredditSearch.value;
      if (subreddit) {
        this.$router.push({ name: 'subreddit-page', params: { subreddit } });
      } else {
        this.$router.push({ name: 'front-page' });
      }
      this.hideResults();
    },
    resultMouseover(result) {
      if (result.name !== '-1') {
        this.mouseoveredResult = result;
      }
    },
    prevent(e) {
      e.preventDefault();
    },
    hideResults() {
      this.isResultsShown = false;
    },
    showResults() {
      if (!_.isEmpty(this.results)) {
        this.isResultsShown = true;
      }
    },
    subredditSearchChange: _.debounce(/* eslint-disable func-names */async function (event) {
      if (event.which === ENTER_KEY || event.which === DOWN_ARROW || event.which === UP_ARROW) {
        return;
      }

      const search = this.$refs.subredditSearch.value;
      if (!search) {
        this.results = [];
        this.hideResults();
        return;
      }

      const response = await this.$http.get(`https://www.reddit.com/subreddits/search.json?q=${search}&limit=5`);

      const results = _.get(response, 'body.data.children', [])
        .map(({ data }) => ({
          name: data.display_name,
          subscribers: data.subscribers,
          title: data.public_description || data.title,
        }))
        .filter(({ subscribers }) => subscribers !== null);

      if (_.isEmpty(results)) {
        this.results = [{ name: '-1' }];
        return;
      }

      this.results = results;
      this.mouseoveredResult = results[0];
      this.showResults();
    }, 200),
    stopTyped() {
      if (this.typed) {
        this.typed.destroy();
      }
      this.typed = null;
    },
    startTyped() {
      if (!this.typed) {
        this.typed = new Typed('.go-to-subreddit', {
          strings: this.subreddits,
          attr: 'placeholder',
          typeSpeed: 40,
          backSpeed: 40,
          shuffle: true,
          loop: true,
        });
      }
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  z-index: 2;
}

li {
  display: inline-block;
  margin: 0 10px;
}

ul.options-list {
  display: flex;
  flex-direction: column;
  border: 1px solid #dbdbdb;
  border-radius: 0 0 3px 3px;
  position: absolute;
  width: 100%;
  overflow: hidden;
}

ul.options-list li {
  width: 100%;
  flex-wrap: wrap;
  background: white;
  margin: 0;
  border-bottom: 1px solid #eee;
  color: #363636;
  padding: 7px;
  cursor: pointer;
}

.go-to-button {
  width: 72px;
}

.go-to-subreddit {
  padding-left: 3px;
}

.results-list-item {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
