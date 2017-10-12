<template>
  <article class="media">
    <div class="media-content">
      <div class="content">
        <strong>{{ author }}</strong>
        &middot;
        {{ date }}
        &middot;
        <b-icon pack="fa" icon="arrow-up" size="is-small" class="green-color" style="margin-bottom: 4px;"></b-icon>
        <span class="green-color">{{ score }}</span>
        <b-icon v-if="isGilded" pack="fa" icon="star" class="gold-color" size="is-small" style="margin-bottom: 3px;"></b-icon>
        <b-icon v-if="isSticky" pack="fa" icon="thumb-tack" class="fa-rotate-270 red-color" size="is-small" style="margin-bottom: 3px;"></b-icon>
        <strong v-if="isOP" style="color: #3498db; text-transform: uppercase;">op</strong>
        <br>
        <span v-html="body"></span>
      </div>
    </div>
  </article>
</template>

<script>
import he from 'he';
import common from '@/common';

export default {
  name: 'comment',
  props: [
    'comment',
  ],
  data() {
    return {
      author: this.comment.author,
      body: this.comment.body_html ? he.decode(this.comment.body_html) : this.comment.body,
      score: common.formatNumber(this.comment.score),
      date: common.formatDate(this.comment.created_utc),
      isOP: this.comment.is_submitter,
      isGilded: this.comment.gilded > 0,
      isSticky: this.comment.stickied,
    };
  },
};
</script>

<style scoped>

</style>
