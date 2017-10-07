import Vue from 'vue';
import Router from 'vue-router';
import Page from '@/components/Page';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'front-page',
      component: Page,
    },
    {
      path: '/:modifier',
      name: 'front-page-with-modifier',
      component: Page,
    },
    {
      path: '/r/:subreddit',
      name: 'subreddit-page',
      component: Page,
    },
    {
      path: '/r/:subreddit/:modifier',
      name: 'subreddit-page-with-modifier',
      component: Page,
    },
  ],
});
