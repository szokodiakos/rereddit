import Vue from 'vue';
import Router from 'vue-router';
import Subreddit from '@/components/Subreddit';
import PostDetails from '@/components/PostDetails';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'front-page',
      component: Subreddit,
    },
    {
      path: '/:modifier',
      name: 'front-page-with-modifier',
      component: Subreddit,
    },
    {
      path: '/r/:subreddit',
      name: 'subreddit-page',
      component: Subreddit,
    },
    {
      path: '/r/:subreddit/:modifier',
      name: 'subreddit-page-with-modifier',
      component: Subreddit,
    },
    {
      path: '/r/:subreddit/comments/:postId/:postTitle',
      name: 'post',
      component: PostDetails,
    },
  ],
});
