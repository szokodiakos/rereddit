import DARK_MODE_STATES from '@/enums/dark-mode-states';

export default {
  settings: {
    darkMode: DARK_MODE_STATES.AUTO,
    showNsfw: false,
  },
  isSettingsOpen: false,
  posts: [],
  lastPostId: null,
  scrollId: null,
};
