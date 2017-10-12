<template>
  <div style="display:flex; justify-content: center;">
    <span style="padding-top: 6px; padding-right: 6px;">Show posts from</span>
    <b-dropdown>
      <button class="button is-primary is-outlined" slot="trigger">
          <span>{{ selectedFrom.label }} <i class="fa fa-angle-down"></i></span>
      </button>
      <b-dropdown-item
        v-if="fromOption.query !== selectedFrom.query"
        v-for="fromOption in fromOptions"
        :key="fromOption.query"
        @click="changeFrom(fromOption)"
      >
        {{ fromOption.label }}</router-link>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'modifierDropdown',
  created() {
    this.selectedFrom = this.getSelectedFrom();
  },
  data() {
    return {
      selectedFrom: null,
      fromOptions: [{
        query: 'day',
        label: 'past 24 hours',
      }, {
        query: 'hour',
        label: 'past hour',
      }, {
        query: 'week',
        label: 'past week',
      }, {
        query: 'year',
        label: 'past year',
      }, {
        query: 'all',
        label: 'all time',
      }],
    };
  },
  watch: {
    async $route() {
      this.selectedFrom = this.getSelectedFrom();
    },
  },
  methods: {
    changeFrom(fromOption) {
      this.$router.push({
        query: { show: fromOption.query },
      });
    },
    getSelectedFrom() {
      const show = this.$route.query.show;
      const fromOption = this.fromOptions.find(f => f.query === show);
      if (!fromOption) {
        return this.fromOptions[0];
      }
      return fromOption;
    },
  },
};
</script>

<style scoped>

</style>
