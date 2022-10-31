import onChange from 'on-change';

import { savePosts, saveRss } from '@src/rss';
import {
  renderDefaultMessages, renderFeeds, renderPosts, showLoading, hideLoading,
} from '@src/render';
import validateRssUrl from '@src/validation';
import initI18N from '@src/i18n';
import loadRssStream from '@src/api';
import parseData from '@src/parser';

const watchRssStreams = (appState) => {
  const timeout = 5000;
  let feedIndex = 0;

  window.setTimeout(() => {
    if (appState.feeds.length === 0) {
      return watchRssStreams(appState);
    }

    const { id: feedId, link } = appState.feeds[feedIndex];

    return loadRssStream(link)
      .then((data) => parseData(data))
      .then(({ posts }) => {
        savePosts(appState.posts, posts, feedId);
        feedIndex = feedIndex < appState.feeds.length - 1 ? feedIndex + 1 : 0;
      })
      .finally(() => {
        watchRssStreams(appState);
      });
  }, timeout);
};

const handleCopyBtnClick = (event) => {
  const text = event.target.parentNode.textContent.trim();
  const rssLink = text.split(' ').at(-1);

  navigator.clipboard.writeText(rssLink);
};

/**
 * Sets message in special HTML node
 * @param {string} message - Text of message
 * @param {'success' | 'danger'} status - Message status
 */
const setMessage = (message, status = 'success') => {
  const messagesField = document.querySelector('.messages-field');
  const isSuccessful = status === 'success';

  messagesField.classList.add(isSuccessful ? 'text-success' : 'text-danger');
  messagesField.classList.remove(isSuccessful ? 'text-danger' : 'text-success');

  messagesField.textContent = message;
};

const fillAppTitles = (appState) => {
  const { i18n } = appState;
  const link = 'https://ru.hexlet.io/lessons.rss';

  document.querySelector('.app-name').textContent = i18n.t('basic.appName');
  document.querySelector('.posts-title').textContent = i18n.t('basic.posts');
  document.querySelector('.feeds-title').textContent = i18n.t('basic.feeds');
  document.querySelector('.example').textContent = `${i18n.t('basic.example')}: ${link}`;
};

const getState = () => {
  const appState = {
    i18n: null,
    isLoading: false,
    feeds: [],
    posts: [],
    readedPosts: [],
  };

  const wrappedState = onChange(appState, (path, value) => {
    if (path === 'feeds') {
      renderFeeds(wrappedState);
    }

    if (path === 'posts') {
      renderPosts(wrappedState);
    }

    if (path === 'isLoading') {
      if (value) {
        showLoading();
      } else {
        hideLoading();
      }
    }

    if (path === 'readedPosts') {
      const id = value.at(-1);
      const postNode = document.querySelector(`.rss-posts-list__item[data-id='${id}']`);

      postNode.querySelector('a').classList.replace('fw-bold', 'fw-normal');
    }
  });

  return wrappedState;
};

const invalidateInput = (rssInput) => {
  rssInput.classList.add('rss-form__input_invalid');
};

const init = () => {
  const appState = getState();

  initI18N()
    .then((i18nInstance) => {
      appState.i18n = i18nInstance;
    })
    .then(() => {
      const { i18n } = appState;
      const rssForm = document.querySelector('.rss-form');
      const rssInput = rssForm.querySelector('.rss-form__input');

      const getRssInputValue = () => rssInput?.value ?? '';

      rssForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const rssUrl = getRssInputValue();

        validateRssUrl(rssUrl, appState)
          .then((isValid) => {
            if (isValid) {
              appState.isLoading = true;

              return loadRssStream(rssUrl)
                .then((data) => parseData(data))
                .then(({ posts, feed }) => {
                  const newFeed = saveRss(appState.feeds, feed, rssUrl);

                  savePosts(appState.posts, posts, newFeed.id);
                });
            }

            throw new Error(i18n.t('rssLoadMessages.ivalidURL'));
          })
          .then(() => {
            setMessage(i18n.t('rssLoadMessages.success'), 'success');
          })
          .catch((error) => {
            invalidateInput(rssInput);
            setMessage(i18n.t(error.message), 'danger');
          })
          .finally(() => {
            rssInput.focus();
            rssInput.value = '';
            appState.isLoading = false;
          });
      });

      rssInput.addEventListener('keydown', () => {
        rssInput.classList.remove('rss-form__input_invalid');
      });

      document.querySelector('.copy-btn').addEventListener('click', handleCopyBtnClick);

      fillAppTitles(appState);
      renderDefaultMessages(appState);
      watchRssStreams(appState);
    });
};

export default init;
