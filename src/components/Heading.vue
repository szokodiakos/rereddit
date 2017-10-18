<template>
  <div>
    <div v-if="isCompact" :style="{
      'background-image': `-webkit-linear-gradient(left, ${color}, rgba(0,0,0,0))${bannerImg ? `, url(${bannerImg})` : ''}`,
      'background-size': 'cover',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      width: '100%',
      height: '50px',
      display: 'flex',
      'flex-direction': 'row',
      'justify-content': 'center'
    }">
      <div v-if="subreddit" class="compact-go-to-frontpage-button" style="align-self: center; margin-right: auto; margin-left: 5px;">
        <router-link
          to="/"
          class="button"
          :style="{ color: textColor, 'border-color': textColor }"
          v-tippy="{ position: 'right' }"
          title="Go to Front Page"
        >
          Re&nbsp;<i class="fa fa-reddit-alien" aria-hidden="true"></i>
        </router-link>
      </div>

      <div v-if="subreddit" :style="{ color: textColor, display: 'flex', 'align-items': 'center' }">
        <router-link :to="subreddit" :style="{ color: textColor, 'white-space': 'nowrap' }">
          <strong>{{ subreddit }}</strong>
        </router-link>
      </div>
      <div v-else :style="{ color: textColor }">
        Rereddit
      </div>

      <div v-if="headerImg" style="margin-left: auto; margin-right: 5px; width: 45px; height: 45px; position: relative;">
        <img :src="headerImg" style="max-height: 45px; max-width: 45px; position: absolute; top: 0px; bottom: 0px; left: 0px; right 0px; margin: auto;">
      </div>
    </div>

    <section v-else class="hero is-primary is-bold jump-target">
      <div class="hero-body heading-body" :style="{
        'background-image': `-webkit-linear-gradient(left, ${color}, rgba(0,0,0,0))${bannerImg ? `, url(${bannerImg})` : ''}`,
        'background-size': 'cover',
        'background-position': 'center center',
        'background-repeat': 'no-repeat'
      }">
        <div v-if="subreddit" class="go-to-frontpage-button">
          <router-link
            to="/"
            class="button"
            :style="{ color: textColor, 'border-color': textColor }"
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
          <h1 v-if="subreddit" class="title" :style="{ color: textColor }">
            <router-link :to="subreddit" style="white-space: nowrap;">{{ subreddit }}</router-link>
          </h1>
          <h1 v-else class="title" :style="{ color: textColor }">
            Rereddit
          </h1>

          <h2 class="subtitle">
            <span v-if="title"><router-link :to="subreddit" :style="{ color: textColor }">{{ title }}</router-link></span>
            <span :style="{ color: textColor }" v-else>An alternative <i class="fa fa-reddit-alien" aria-hidden="true"></i> client</span>
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
              <span class="tag" :style="{ 'background-color': color, color: textColor }">total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
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
    'isCompact',
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

.go-to-frontpage-button .button,
.compact-go-to-frontpage-button .button {
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
