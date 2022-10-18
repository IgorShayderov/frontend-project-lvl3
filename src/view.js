import { getRssStream, watchRssStreams } from '@src/rss';
import { renderDefaultMessages } from '@src/render';
import validateRssUrl from '@src/validation';
import { appState } from '@src/index';

const listenAppStateChange = () => {
  document.addEventListener('app-state-change', (event) => {
    const { detail: newAppState } = event;
    const rssBtn = document.querySelector('.rss-form__submit-btn span');

    switch (newAppState) {
      case 'loading':
        rssBtn.textContent = '';
        rssBtn.classList.add('loading');
        rssBtn.setAttribute('disabled', 'disabled');
        break;
      case 'pending':
        rssBtn.classList.remove('loading');
        rssBtn.textContent = 'Add';
        rssBtn.removeAttribute('disabled');
        break;
      default:
        throw new Error(appState.i18n.t('appErrors.unknownState', { appState: newAppState }));
    }
  });
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

  if (messagesField !== null) {
    messagesField.textContent = message;
  } else {
    throw new Error(appState.i18n.t('nodeSearchErrors.messagesField'));
  }
};

const fillAppTitles = () => {
  const link = 'https://ru.hexlet.io/lessons.rss';

  document.querySelector('.app-name').textContent = appState.i18n.t('basic.appName');
  document.querySelector('.posts-title').textContent = appState.i18n.t('basic.posts');
  document.querySelector('.feeds-title').textContent = appState.i18n.t('basic.feeds');
  document.querySelector('.example').textContent = `${appState.i18n.t('basic.example')}: ${link}`;
};

const init = () => {
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

      validateRssUrl(rssValue)
        .then((isValid) => {
          if (isValid) {
            return getRssStream(rssValue);
          }

          throw new Error(appState.i18n.t('rssLoadMessages.ivalidURL'));
        })
        .then(() => {
          setMessage(appState.i18n.t('rssLoadMessages.success'), 'success');
        })
        .catch((error) => {
          invalidateInput();
          setMessage(error.message, 'danger');
        })
        .finally(() => {
          rssInput.focus();
          rssInput.value = '';
        });
    });
  }

  if (rssInput !== null) {
    rssInput.addEventListener('keydown', () => {
      rssInput.classList.remove('rss-form__input_invalid');
    });
  }

  document.querySelector('.copy-btn').addEventListener('click', handleCopyBtnClick);

  fillAppTitles();
  listenAppStateChange();
  watchRssStreams();
  renderDefaultMessages();
};

export default init;
