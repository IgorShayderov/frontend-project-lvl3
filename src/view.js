import { validate } from '@src/validation';
import { loadRssStream } from '@src/api';
import { renderRss } from '@src/render';
import { saveRss } from '@src/rss';

const listenAppStateChange = () => {
  document.addEventListener('app-state-change', (event) => {
    const { detail: newAppState } = event;
    const rssBtn = document.querySelector('.rss-form__submit-btn span');

    switch (newAppState) {
    case 'loading':
      rssBtn.textContent = '';
      rssBtn.classList.add('loading');
      break;
    case 'pending':
      rssBtn.classList.remove('loading');
      rssBtn.textContent = 'Add';
      break;
    default:
      throw new Error(`Unknown app state ${newAppState}`);
    }
  });
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

      validate(rssValue)
        .then((isValid) => {
          if (isValid) {
            return loadRssStream(rssValue);
          }

          invalidateInput();
          throw new Error('Invalid input');
        })
        .then((result) => saveRss(result))
        .then(() => renderRss())
        .catch((error) => {
          console.error(`Ошибочка! ${error.message}`);
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

  listenAppStateChange();
};
