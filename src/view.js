import { getRssStream, watchRssStreams } from '@src/rss';
import { renderDefaultMessages } from '@src/render';
import validateRssUrl from '@src/validation';
import initI18N from '@src/i18n';

const startLoading = () => {
  const rssBtn = document.querySelector('.rss-form__submit-btn span');

  rssBtn.textContent = '';
  rssBtn.classList.add('loading');
  rssBtn.setAttribute('disabled', 'disabled');
};

const endLoading = () => {
  const rssBtn = document.querySelector('.rss-form__submit-btn span');

  rssBtn.classList.remove('loading');
  rssBtn.textContent = 'Add';
  rssBtn.removeAttribute('disabled');
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
const setMessage = (message, appState, status = 'success') => {
  const { i18n } = appState;
  const messagesField = document.querySelector('.messages-field');
  const isSuccessful = status === 'success';

  messagesField.classList.add(isSuccessful ? 'text-success' : 'text-danger');
  messagesField.classList.remove(isSuccessful ? 'text-danger' : 'text-success');

  if (messagesField !== null) {
    messagesField.textContent = message;
  } else {
    throw new Error(i18n.t('nodeSearchErrors.messagesField'));
  }
};

const fillAppTitles = (appState) => {
  const { i18n } = appState;
  const link = 'https://ru.hexlet.io/lessons.rss';

  document.querySelector('.app-name').textContent = i18n.t('basic.appName');
  document.querySelector('.posts-title').textContent = i18n.t('basic.posts');
  document.querySelector('.feeds-title').textContent = i18n.t('basic.feeds');
  document.querySelector('.example').textContent = `${i18n.t('basic.example')}: ${link}`;
};

const init = () => {
  const appState = {
    i18n: null,
    rssFeeds: [],
  };

  initI18N()
    .then((i18nInstance) => {
      appState.i18n = i18nInstance;
    })
    .then(() => {
      const rssForm = document.querySelector('.rss-form');
      const rssInput = rssForm.querySelector('.rss-form__input');

      const getRssInputValue = () => rssInput?.value ?? '';

      const invalidateInput = () => {
        rssInput.classList.add('rss-form__input_invalid');
      };

      if (rssForm !== null) {
        rssForm.addEventListener('submit', (event) => {
          event.preventDefault();

          const rssValue = getRssInputValue();

          validateRssUrl(rssValue, appState)
            .then((isValid) => {
              startLoading();

              if (isValid) {
                return getRssStream(rssValue, appState);
              }

              throw new Error(appState.i18n.t('rssLoadMessages.ivalidURL'));
            })
            .then(() => {
              setMessage(appState.i18n.t('rssLoadMessages.success'), appState, 'success');
            })
            .catch((error) => {
              invalidateInput();
              setMessage(error.message, appState, 'danger');
            })
            .finally(() => {
              rssInput.focus();
              rssInput.value = '';
              endLoading();
            });
        });
      }

      if (rssInput !== null) {
        rssInput.addEventListener('keydown', () => {
          rssInput.classList.remove('rss-form__input_invalid');
        });
      }

      document.querySelector('.copy-btn').addEventListener('click', handleCopyBtnClick);

      fillAppTitles(appState);
      watchRssStreams(appState);
      renderDefaultMessages(appState);
    });
};

export default init;
