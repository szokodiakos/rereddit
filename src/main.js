import Vue from 'vue';
import VueResource from 'vue-resource';
import Buefy from 'buefy';
import moment from 'moment';
import 'buefy/lib/buefy.min.css';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';

moment.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'seconds',
    ss: '%ss',
    m: 'a minute',
    mm: '%dm',
    h: 'an hour',
    hh: '%dh',
    d: 'a day',
    dd: '%dd',
    M: 'a month',
    MM: '%dM',
    y: 'a year',
    yy: '%dY',
  },
});

Vue.use(Buefy);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
