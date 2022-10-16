import '@src/stylesheets/main.scss';

import init from '@src/view';
import initI18N from '@src/i18n';
import ModalWindow from '@src/modal';

export const rssFeeds = [];

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

initI18N();
init();
