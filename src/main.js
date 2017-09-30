import Vue from 'vue';
import VueResource from 'vue-resource';
import Buefy from 'buefy';
import moment from 'moment';
import 'buefy/lib/buefy.min.css';
import 'font-awesome/css/font-awesome.min.css';
import router from './router';
import App from './App';

moment.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: '%ss',
    ss: '%ss',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dd',
    dd: '%dd',
    M: '%dmo',
    MM: '%dmo',
    y: '%dY',
    yy: '%dY',
  },
});

Vue.use(Buefy);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});

