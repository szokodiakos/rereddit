import DARK_MODE_STATES from '@/enums/dark-mode-states';

export const isDarkModeOn = (state) => { // eslint-disable-line import/prefer-default-export
  if (state.settings.darkMode === DARK_MODE_STATES.AUTO) {
    const currentHour = new Date().getHours();
    return currentHour <= 7 || currentHour >= 19;
  }
  return state.settings.darkMode === DARK_MODE_STATES.ON;
};
