import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    lastPostId: null,
    scrollY: 0,
  },
  mutations: {
    initPosts(state, { posts, lastPostId }) {
      state.posts = posts;
      state.lastPostId = lastPostId;
    },
    resetPosts(state) {
      state.posts = [];
      state.lastPostId = null;
      state.scrollY = 0;
    },
    appendPosts(state, { posts, lastPostId }) {
      state.posts = [...state.posts, ...posts];
      state.lastPostId = lastPostId;
    },
    saveScrollY(state, y) {
      state.scrollY = y;
    },
  },
});
