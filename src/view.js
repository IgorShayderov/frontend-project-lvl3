import { getRssStream, watchRssStreams } from '@src/rss';
import { renderDefaultMessages } from '@src/render';
import { validateRssUrl } from '@src/validation';
import { t } from 'i18next';

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
      throw new Error(t('appErrors.unknownState', { appState: newAppState }));
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
 * @param {*} message - Text of message
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
    throw new Error(t('nodeSearchErrors.messagesField'));
  }
};

const fillAppTitles = () => {
  const link = 'https://news.rambler.ru/rss/holiday/';

  document.querySelector('.app-name').textContent = t('basic.appName');
  document.querySelector('.posts-title').textContent = t('basic.posts');
  document.querySelector('.feeds-title').textContent = t('basic.feeds');
  document.querySelector('.example').textContent = `${t('basic.example')}: ${link}`;
};

export const init = () => {
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

          throw new Error(t('rssLoadMessages.ivalidURL'));
        })
        .then(() => {
          setMessage(t('rssLoadMessages.success'), 'success');
        })
        .catch((error) => {
          invalidateInput();
          setMessage(error, 'danger');
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
