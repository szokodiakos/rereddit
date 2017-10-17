<template>
  <section class="hero is-primary is-bold jump-target">
    <div class="hero-body heading-body" v-bind:style="{
      'background-image': `-webkit-linear-gradient(left, ${color}, rgba(0,0,0,0))${bannerImg ? `, url(${bannerImg})` : ''}`,
      'background-size': 'cover',
      'background-position': 'center center',
      'background-repeat': 'no-repeat'
    }">
      <div v-if="subreddit" class="go-to-frontpage-button">
        <router-link
          to="/"
          class="button"
          v-bind:style="{ color: textColor, 'border-color': textColor }"
          v-tippy="{ position: 'right' }"
          title="Go to Front Page"
        >
          Re&nbsp;<i class="fa fa-reddit-alien" aria-hidden="true"></i>
        </router-link>
      </div>

      <div v-if="headerImg" class="header-img">
        <router-link v-if="subreddit" :to="subreddit">
          <img :src="headerImg">
        </router-link>
        <img v-else :src="headerImg">
      </div>

      <div class="container">
        <h1 v-if="subreddit" class="title" v-bind:style="{ color: textColor }">
          <router-link :to="subreddit" style="white-space: nowrap;">{{ subreddit }}</router-link>
        </h1>
        <h1 v-else class="title" v-bind:style="{ color: textColor }">
          Rereddit
        </h1>

        <h2 class="subtitle" v-bind:style="{ color: textColor }">
          <span v-if="title"><router-link :to="subreddit">{{ title }}</router-link></span>
          <span v-else>An alternative <i class="fa fa-reddit-alien" aria-hidden="true"></i> client</span>
        </h2>

        <Search :color="color" :text-color="textColor"></Search>

      </div>

      <div v-if="onlineUsers && totalUsers" class="field is-grouped is-grouped-multiline badges">
        <div class="control">
          <div class="tags has-addons">
            <span class="tag">{{ onlineUsers }}</span>
            <span class="tag online-badge green-background">online</span>
          </div>
        </div>
        <div class="control">
          <div class="tags has-addons">
            <span class="tag">{{ totalUsers }}</span>
            <span class="tag" v-bind:style="{ 'background-color': color, color: textColor }">total</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Search from '@/components/Search';

export default {
  name: 'heading',
  props: [
    'color',
    'bannerImg',
    'headerImg',
    'textColor',
    'subreddit',
    'title',
    'onlineUsers',
    'totalUsers',
  ],
  components: {
    Search,
  },
};
</script>

<style scoped>
.heading-body {
  background-size: auto, cover;
}

.go-to-frontpage-button {
  position: absolute;
  top: 10px;
  left: 10px;
}

.go-to-frontpage-button .button {
  background: transparent;
}

.container .title, .container .subtitle {
  display: flex;
  justify-content: center;
}

.container .subtitle {
  text-align: center;
}

.header-img {
  text-align: center;
}

.header-img img {
  max-width: 120px;
  max-height: 120px;
}

.badges {
  position: relative;
  bottom: -37px;
  float: right;
  right: -8px;
}

.online-badge {
  color: white;
}

.tag {
  text-transform: uppercase;
}

h1 {
  white-space: nowrap;
}
</style>
