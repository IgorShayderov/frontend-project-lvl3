import onChange from 'on-change';

import { savePosts, saveRss } from '@src/rss';
import { renderDefaultMessages, renderFeeds, renderPosts } from '@src/render';
import validateRssUrl from '@src/validation';
import initI18N from '@src/i18n';
import loadRssStream from '@src/api';
import parseData from '@src/parser';

// const startLoading = () => {
//   const rssBtn = document.querySelector('.rss-form__submit-btn span');

//   rssBtn.textContent = '';
//   rssBtn.classList.add('loading');
//   rssBtn.setAttribute('disabled', 'disabled');
// };

// const endLoading = () => {
//   const rssBtn = document.querySelector('.rss-form__submit-btn span');

//   rssBtn.classList.remove('loading');
//   rssBtn.textContent = 'Add';
//   rssBtn.removeAttribute('disabled');
// };

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
    feeds: [],
    posts: [],
  };

  const wrappedState = onChange(appState, (path, value, previousValue, applyData) => {
    console.log({ path });
    console.log({ value });

    if (path === 'feeds') {
      renderFeeds(wrappedState);
    }

    if (path === 'posts') {
      renderPosts(wrappedState);
    }
  });

  return wrappedState;
};

const invalidateInput = (rssInput) => {
  rssInput.classList.add('rss-form__input_invalid');
};

const init = () => {
  const appState = getState();

  console.log({ appState });

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
            // startLoading();

            if (isValid) {
              return loadRssStream(rssUrl)
                .then((data) => parseData(data))
                .then(({ posts, feed }) => {
                  const newFeed = saveRss(appState.feeds, feed, rssUrl);

                  savePosts(appState.posts, posts, newFeed.id);
                })
                .catch((error) => {
                  throw new Error(i18n.t(error.message));
                });
            }

            throw new Error(appState.i18n.t('rssLoadMessages.ivalidURL'));
          })
          .then(() => {
            setMessage(appState.i18n.t('rssLoadMessages.success'), 'success');
          })
          .catch((error) => {
            invalidateInput(rssInput);
            setMessage(error.message, 'danger');
          })
          .finally(() => {
            rssInput.focus();
            rssInput.value = '';
            // endLoading();
          });
      });

      rssInput.addEventListener('keydown', () => {
        rssInput.classList.remove('rss-form__input_invalid');
      });

      document.querySelector('.copy-btn').addEventListener('click', handleCopyBtnClick);

      fillAppTitles(appState);
      renderDefaultMessages(appState);
    });
};

export default init;
