import '@src/stylesheets/main.scss';

import { initI18N } from '@src/i18n';
import { init } from '@src/view';
import ModalWindow from '@src/modal';

export const appState = {
  currentState: 'pending',
  availableStates: ['loading', 'pending'],
  postsModal: new ModalWindow('#postsModal'),
  changeAppState(newState) {
    if (this.isValidState(newState)) {
      const event = new CustomEvent('app-state-change', { detail: newState });

      this.currentState = newState;
      document.dispatchEvent(event);
    }
  },
  isValidState(state) {
    return this.availableStates.includes(state);
  },
  startLoading() {
    this.changeAppState('loading');
  },
  finishLoading() {
    this.changeAppState('pending');
  },
};

export const rssFeeds = [];

initI18N();
init();
