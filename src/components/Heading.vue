<template>
  <section class="hero is-primary is-bold jump-target">
    <div class="hero-body" v-bind:style="{
      'background-image': `-webkit-linear-gradient(left, ${color}, rgba(0,0,0,0))${bannerImg ? `, url(${bannerImg})` : ''}`,
      'background-size': `auto, cover`,
    }">
      <div class="container">
        <h1 class="title" v-bind:style="{ color: textColor }">
          {{ subreddit || 'Rereddit' }}
        </h1>
        <h2 class="subtitle" v-bind:style="{ color: textColor }">
          <span v-if="title">{{ title }}</span>
          <span v-else>An alternative <i class="fa fa-reddit-alien" aria-hidden="true"></i> client</span>
        </h2>
        <div class="field has-addons" style="justify-content: center;">
          <div class="control">
            <a class="button is-static" v-bind:style="{ 'background-color': color, color: textColor, 'width': '72px' }">Go to /r/</a>
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
              style="padding-left: 3px;"
            >
            <ul class="options-list" v-bind:style="{ opacity: isResultsShown ? 100 : 0 }">
              <li v-if="results.length === 1 && results[0] === '-1'">Nothing found.</li>
              <li
                v-else
                v-for="result in results"
                v-bind:key="result.name"
                @click="openSubreddit(result)"
                @mouseover="resultMouseover(result)"
                v-bind:style="{
                  'background-color': isActive(result, results[0]) ? color : 'white',
                  color: isActive(result, results[0]) ? textColor: '#363636',
                  'text-overflow': 'ellipsis',
                  'white-space': 'nowrap'
                }"
                :title="result.title"
                v-tippy="{
                  position: 'bottom-start',
                  delay: [200, 0],
                  size: 'small'
                }">
              >
                {{ result.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <a class="navbar-item">
        Home
      </a>
    </div>
  </nav> -->
</template>

<script>
import Typed from 'typed.js';
import _ from 'lodash';

const TAB_KEY = 9;
const ENTER_KEY = 13;
const DOWN_ARROW = 40;
const UP_ARROW = 38;

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default {
  name: 'heading',
  props: [
    'color',
    'bannerImg',
    'textColor',
    'subreddit',
    'title',
  ],
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
    openSubreddit(result) {
      const subreddit = result ? result.name : this.$refs.subredditSearch.value;
      if (subreddit) {
        this.$router.push({ name: 'subreddit-page', params: { subreddit } });
      } else {
        this.$router.push({ name: 'front-page' });
      }
    },
    isActive(result) {
      return (this.mouseoveredResult.name === result.name);
    },
    resultMouseover(result) {
      if (result.name !== '-1') {
        this.mouseoveredResult = result;
      }
    },
    hideResults() {
      this.isResultsShown = false;
    },
    showResults() {
      if (!_.isEmpty(this.results)) {
        this.isResultsShown = true;
      }
    },
    subredditSearchKeydown(results, event) {
      if (event.which === TAB_KEY) {
        event.preventDefault();
        this.$refs.subredditSearch.value = this.mouseoveredResult.name;
      }

      if (event.which === ENTER_KEY) {
        if (this.isResultsShown) {
          if (_.toLower(this.$refs.subredditSearch.value) === _.toLower(this.mouseoveredResult.name)) {
            this.$refs.subredditSearch.value = this.mouseoveredResult.name;
            this.openSubreddit();
          } else {
            this.$refs.subredditSearch.value = this.mouseoveredResult.name;
            this.hideResults();
          }
        } else {
          this.openSubreddit();
        }
      }

      if (event.which === DOWN_ARROW) {
        event.preventDefault();
        this.mouseoveredResult =
          results[mod(
            _.findIndex(results, result => result.name === this.mouseoveredResult.name) + 1,
            results.length,
          )];
      }

      if (event.which === UP_ARROW) {
        event.preventDefault();
        this.mouseoveredResult =
          results[mod(
            _.findIndex(results, result => result.name === this.mouseoveredResult.name) - 1,
            results.length,
          )];
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
      this.typed = new Typed('.go-to-subreddit', {
        strings: this.subreddits,
        attr: 'placeholder',
        typeSpeed: 40,
        backSpeed: 40,
        shuffle: true,
        loop: true,
      });
    },
  },
  async mounted() {
    const response = await this.$http.get('https://www.reddit.com/reddits/.json');
    this.subreddits = _
      .get(response, 'body.data.children', [])
      .map(rawSubreddit => rawSubreddit.data.display_name);
    this.$nextTick(() => {
      this.startTyped();
    });
  },
};
</script>

<style scoped>
.center {
  display: block;
  margin: auto;
}

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
</style>
