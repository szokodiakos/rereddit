<template>
  <div>
    <div :class="[`card ${isRoot ? '' : 'non-root'}`, { 'dark-background': isDarkModeOn, 'dark-box-shadow': isDarkModeOn }]" style="margin-bottom: 8px;">
      <div class="card-content" style="overflow: auto;">
        <div @click="expandCollapse" style="text-align: left;">
          <a v-if="!hideExpand">
            <b-icon v-if="isExpanded" pack="fa" icon="caret-down" size="is-small" style="margin-bottom: 3px"></b-icon>
            <b-icon v-else pack="fa" icon="caret-right" size="is-small" style="margin-bottom: 3px"></b-icon>
          </a>
          <strong>{{ author }}</strong>
          &nbsp;&middot;
          {{ date }}
          <span v-if="hasCommentSuffix">&middot;&nbsp;</span>
          <span v-if="!isScoreHidden">
            <b-icon pack="fa" icon="arrow-up" size="is-small" class="green-color" style="margin-bottom: 3px;"></b-icon>
            <span class="green-color">{{ score }}</span>
          </span>
          <b-icon v-if="isGilded" pack="fa" icon="star" class="gold-color" size="is-small" style="margin-left: 2px; margin-bottom: 3px;"></b-icon>
          <b-icon v-if="isSticky" pack="fa" icon="thumb-tack" class="fa-rotate-270 red-color" size="is-small" style="margin-left: 2px; margin-bottom: 3px;"></b-icon>
          <strong v-if="isOP" style="color: #3498db; text-transform: uppercase; margin-left: 2px">op</strong>
        </div>
        <div style="margin-top: 7px;">
          <span v-if="isExpanded" v-html="body" style="text-align: justify;"></span>
        </div>
        <div v-if="isExpanded && showReplies && replies.length" class="replies" :style="isRoot ? '' : 'position: relative; bottom: -10px;'">
          <comment v-for="reply in replies" :key="reply.id" :comment="reply" :show-replies="true" :is-root="false" style="margin-top: 15px;"></comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import he from 'he';
import { mapGetters } from 'vuex';
import _ from 'lodash';
import common from '@/common';

export default {
  name: 'comment',
  props: [
    'comment',
    'showReplies',
    'isRoot',
    'hideExpand',
  ],
  computed: {
    ...mapGetters(['isDarkModeOn']),
    hasCommentSuffix() {
      return !this.isScoreHidden || this.isOP || this.isGilded || this.isSticky;
    },
  },
  methods: {
    expandCollapse() {
      if (!this.hideExpand) {
        this.isExpanded = !this.isExpanded;
      }
    },
  },
  data() {
    return {
      author: this.comment.author,
      body: this.comment.body_html ? he.decode(this.comment.body_html) : this.comment.body,
      score: common.formatNumber(this.comment.score),
      isScoreHidden: this.comment.score_hidden,
      date: common.formatDate(this.comment.created_utc),
      isOP: this.comment.is_submitter,
      isGilded: this.comment.gilded > 0,
      isSticky: this.comment.stickied,
      replies: _.get(this.comment, 'replies.data.children', [])
        .filter(({ kind }) => kind !== 'more')
        .map(({ data: comment }) => comment),
      isExpanded: true,
    };
  },
};
</script>

<style scoped>
.card-header {
  height: 35px;
}

.card-content {
  padding-top: 5px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

@media screen and (min-width: 769px) {
  .non-root {
    right: -4px;
  }

  .replies {
    margin-left: 25px;
  }
}

@media screen and (max-width: 768px) {
  .non-root {
    right: -10px;
  }

  .replies {
    margin-left: -5px;
  }
}
</style>
