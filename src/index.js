import '@src/stylesheets/main.scss';

import init from '@src/view';

const getState = () => {
  const appState = {
    isLoading: false,
    feeds: [],
    posts: [],
    readedPosts: [],
    status: null,
    errorKey: 'pending',
    isModalShown: false,
    shownPost: null,
  };

  return appState;
};

const appState = getState();

init(appState);
