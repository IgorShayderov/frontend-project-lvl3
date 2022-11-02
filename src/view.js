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

const invalidateInput = (rssInput) => {
  rssInput.classList.add('rss-form__input_invalid');
};

const wrapState = (initialState, i18n) => {
  const wrappedState = onChange(initialState, (path, value) => {
    if (path === 'feeds') {
      renderFeeds(wrappedState);
    }

    if (path === 'posts') {
      console.log(path);
      renderPosts(wrappedState, i18n);
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

const init = (initialState) => {
  initI18N()
    .then((i18nInstance) => {
      const i18n = i18nInstance;
      const appState = wrapState(initialState, i18n);
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

      fillAppTitles(i18n);
      renderDefaultMessages(i18n);
      watchRssStreams(appState);
    });
};

export default init;
