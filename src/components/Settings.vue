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
              <div @click="clickDarkModeSwitch()" style="position: absolute; top:0; bottom:0; width: 45px;" :class="{ 'in-front': darkModeAuto }"></div>
            </span>

            <div class="b-checkbox is-success is-inline" style="bottom: 2px; left: 20px;">
              <input id="checkbox" class="styled" v-model="darkModeAuto" type="checkbox">
              <label for="checkbox">
                Auto
              </label>
            </div>
          </div>
        </div>
        <div class="field" style="margin-top: 25px;">
          <label class="label">Show NSFW content</label>
          <div class="control">
            <switches
              v-model="nsfwSwitchValue"
              theme="bulma"
              color="green"
              style="padding-left: 5px;"
            ></switches>
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
      darkModeSwitchValue: settings.darkMode === DARK_MODE_STATES.ON,
      darkModeAuto: settings.darkMode === DARK_MODE_STATES.AUTO,
      nsfwSwitchValue: settings.showNsfw,
    };
  },
  computed: {
    isActive() {
      return this.$store.state.isSettingsOpen;
    },
  },
  methods: {
    ...mapMutations(['setDarkMode', 'setShowNsfw', 'closeSettings']),
    clickDarkModeSwitch() {
      if (this.darkModeAuto) {
        this.darkModeAuto = false;
        this.darkModeSwitchValue = !this.darkModeSwitchValue;
      }
    },
    saveDarkMode() {
      if (this.darkModeAuto) {
        this.setDarkMode(DARK_MODE_STATES.AUTO);
      } else if (this.darkModeSwitchValue) {
        this.setDarkMode(DARK_MODE_STATES.ON);
      } else {
        this.setDarkMode(DARK_MODE_STATES.OFF);
      }
    },
    saveShowNsfw() {
      this.setShowNsfw(this.nsfwSwitchValue);
    },
    close(shouldSave) {
      if (shouldSave) {
        this.saveDarkMode();
        this.saveShowNsfw();
      }
      this.closeSettings();
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
