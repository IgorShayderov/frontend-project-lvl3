import './main.scss';

import { validate } from '@src/validation.js';

export const rssList = [];

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
          rssList.push(rssValue);
        } else {
          invalidateInput();
        }

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
