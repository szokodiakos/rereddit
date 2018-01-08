import Vue from 'vue';
import VueTippy from 'vue-tippy';
import VueAnalytics from 'vue-analytics';
import Buefy from 'buefy';
import moment from 'moment';
import 'buefy/lib/buefy.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'cool-checkboxes-for-bulma.io/dist/css/bulma-radio-checkbox.min.css';
import 'scroll-restoration-polyfill';
import router from './router';
import App from './App';
import createStore from './store';

history.scrollRestoration = 'manual';

moment.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'now',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

Vue.use(Buefy);
Vue.use(VueTippy);
Vue.use(VueAnalytics, {
  id: 'UA-100520893-2',
  router,
  autoTracking: {
    exception: true,
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: createStore(),
  template: '<App/>',
  components: { App },
});

