import onChange from 'on-change';

import { savePosts, saveRss, watchRssStreams } from '@src/rss';
import {
  renderDefaultMessages,
  renderFeeds,
  renderPosts,
  showLoading,
  hideLoading,
  fillAppTitles,
  setMessage,
  showModal,
} from '@src/render';

import validateRssUrl from '@src/validation';
import initI18N from '@src/i18n';
import loadRssStream from '@src/api';
import parseData from '@src/parser';

const handleCopyBtnClick = (event) => {
  const text = event.target.parentNode.textContent.trim();
  const rssLink = text.split(' ').at(-1);

  navigator.clipboard.writeText(rssLink);
};

const wrapState = (initialState, i18n) => {
  const rssForm = document.querySelector('.rss-form');
  const rssInput = rssForm.querySelector('.rss-form__input');

  const wrappedState = onChange(initialState, (path, value) => {
    if (path === 'feeds') {
      renderFeeds(wrappedState);
    }

    if (path === 'posts') {
      renderPosts(wrappedState, i18n);
    }

    if (path === 'isLoading') {
      if (value) {
        showLoading();
      } else {
        hideLoading(i18n);
        rssInput.focus();
        rssInput.value = '';
      }
    }

    if (path === 'readedPosts') {
      const id = value.at(-1);
      const postNode = document.querySelector(`.rss-posts-list__item[data-id='${id}']`);

      postNode.querySelector('a').classList.replace('fw-bold', 'fw-normal');
    }

    if (path === 'status') {
      switch (value) {
        case 'success':
          setMessage(i18n.t('rssLoadMessages.success'), 'success');
          break;
        case 'error':
          rssInput.classList.add('rss-form__input_invalid');
          setMessage(i18n.t(wrappedState.errorKey), 'danger');
          break;
        case 'pending':
          rssInput.classList.remove('rss-form__input_invalid');
          break;
        default:
          throw new Error(i18n.t('errors.unknownStatus', { status: value }));
      }
    }

    if (path === 'isModalShown' && value) {
      showModal(wrappedState.shownPost);
      wrappedState.isModalShown = false;
    }
  });

  return wrappedState;
};

const init = (initialState) => {
  initI18N()
    .then((i18nInstance) => {
      const i18n = i18nInstance;
      const appState = wrapState(initialState, i18n);
      const rssForm = document.querySelector('.rss-form');
      const rssInput = rssForm.querySelector('.rss-form__input');

      rssForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const rssUrl = new FormData(rssForm).get('rss-value');

        validateRssUrl(rssUrl, appState, i18n)
          .then((isValid) => {
            if (isValid) {
              appState.isLoading = true;

              return loadRssStream(rssUrl);
            }

            throw new Error(i18n.t('rssLoadMessages.ivalidURL'));
          })
          .then((data) => {
            const { posts, feed } = parseData(data);
            const newFeed = saveRss(appState.feeds, feed, rssUrl);

            savePosts(appState.posts, posts, newFeed.id);
            appState.status = 'success';
          })
          .catch((error) => {
            appState.errorKey = error.message;
            appState.status = 'error';
          })
          .finally(() => {
            appState.isLoading = false;
          });
      });

      rssInput.addEventListener('keydown', () => {
        appState.status = 'pending';
      });

      document.querySelector('.copy-btn').addEventListener('click', handleCopyBtnClick);

      fillAppTitles(i18n);
      renderDefaultMessages(i18n);
      watchRssStreams(appState);
    });
};

export default init;
