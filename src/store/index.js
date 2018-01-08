import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as mutations from '@/store/mutations';
import * as getters from '@/store/getters';
import state from '@/store/state';

Vue.use(Vuex);

const createStore = () => {
  const persistedState = createPersistedState({
    key: 'rereddit',
    paths: ['settings'],
  });

  return new Vuex.Store({
    plugins: [persistedState],
    getters,
    state,
    mutations,
  });
};

export default createStore;
