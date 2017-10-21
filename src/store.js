import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    lastPostId: null,
    scrollId: null,
  },
  mutations: {
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
