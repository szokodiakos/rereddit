<template>
  <div class="center-text">
    <img src="static/waitasec.jpg" style="width: 170px;"><br/>
    <span style="font-size: 25px;">This post is marked as <span class="red-color">Not Safe For Work</span>.</span><br/>
    <a style="margin-top: 25px;" @click="showPost()" class="button red-color red-border is-outlined red-background-hover">Show me anyway!</a><br/>
    or<br/>
    Turn on all NSFW posts in the <a @click="openSettings()">Settings</a>.
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'nsfwPost',
  props: [
    'post',
  ],
  methods: {
    ...mapMutations(['openSettings', 'showNsfwPostById']),
    showPost() {
      const id = this.post.id;
      this.showNsfwPostById(id);
    },
  },
};
</script>

<style scoped>
.center-text {
  text-align: center;
}

.red-border {
  border-color: #e74c3c !important;
}

.red-background-hover:hover {
  background-color: #e74c3c;
  color: white !important;
}
</style>
