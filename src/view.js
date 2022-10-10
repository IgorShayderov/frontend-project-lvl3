import { validate } from '@src/validation';
import { rssPosts, rssFeeds } from '@src/index';
import { loadRssStream } from '@src/api';
import { renderRss } from '@src/render';

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
};
