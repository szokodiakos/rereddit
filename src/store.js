import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import DARK_MODE_STATES from '@/enums/dark-mode-states';

Vue.use(Vuex);

const persistedState = createPersistedState({
  key: 'rereddit',
  paths: ['settings'],
});

export default new Vuex.Store({
  plugins: [persistedState],
  getters: {
    isDarkModeOn: (state) => {
      if (state.settings.darkMode === DARK_MODE_STATES.AUTO) {
        const currentHour = new Date().getHours();
        return currentHour <= 7 || currentHour >= 19;
      }
      return state.settings.darkMode === DARK_MODE_STATES.ON;
    },
  },
  state: {
    settings: {
      darkMode: DARK_MODE_STATES.AUTO,
    },
    posts: [],
    lastPostId: null,
    scrollId: null,
  },
  mutations: {
    setDarkMode(state, value) {
      state.settings.darkMode = value;
    },
    initPosts(state, { posts, lastPostId }) {
      state.posts = posts;
      state.lastPostId = lastPostId;
    },
    resetPosts(state) {
      state.posts = [];
      state.lastPostId = null;
      state.scrollId = null;
    },
    appendPosts(state, { posts, lastPostId }) {
      state.posts = [...state.posts, ...posts];
      state.lastPostId = lastPostId;
    },
    saveScrollId(state, id) {
      state.scrollId = id;
    },
  },
});
