<template>
  <div :class="['modal', { 'is-active': isActive }]">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Settings</p>
        <button class="delete" aria-label="close" @click="close(false)"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Dark mode</label>
          <div class="control">
            <span>
              <switches
                v-model="darkModeSwitchValue"
                theme="bulma"
                color="green"
                :disabled="darkModeAuto"
                style="padding-left: 5px;"
              ></switches>
              <div @click="clickSwitch()" style="position: absolute; top:0; bottom:0; width: 45px;" :class="{ 'in-front': darkModeAuto }"></div>
            </span>

            <div class="b-checkbox is-success is-inline" style="bottom: 2px; left: 20px;">
              <input id="checkbox" class="styled" v-model="darkModeAuto" type="checkbox">
              <label for="checkbox">
                Auto
              </label>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="close(true)">Save</button>
        <button class="button" @click="close(false)">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import Switches from 'vue-switches';
import { mapMutations } from 'vuex';
import DARK_MODE_STATES from '@/enums/dark-mode-states';

export default {
  name: 'settings',
  data() {
    const settings = this.$store.state.settings;
    return {
      isActive: false,
      darkModeSwitchValue: settings.darkMode === DARK_MODE_STATES.ON,
      darkModeAuto: settings.darkMode === DARK_MODE_STATES.AUTO,
    };
  },
  methods: {
    ...mapMutations(['setDarkMode']),
    clickSwitch() {
      if (this.darkModeAuto) {
        this.darkModeAuto = false;
        this.darkModeSwitchValue = !this.darkModeSwitchValue;
      }
    },
    close(shouldSave) {
      if (shouldSave) {
        if (this.darkModeAuto) {
          this.setDarkMode(DARK_MODE_STATES.AUTO);
        } else if (this.darkModeSwitchValue) {
          this.setDarkMode(DARK_MODE_STATES.ON);
        } else {
          this.setDarkMode(DARK_MODE_STATES.OFF);
        }
      }
      this.isActive = false;
    },
    open() {
      this.isActive = true;
    },
  },
  components: {
    Switches,
  },
};
</script>

<style scoped>
.in-front {
  z-index: 10000;
}
</style>
