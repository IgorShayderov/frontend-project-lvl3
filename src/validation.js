import { string } from 'yup';
import { appState } from '@src/index';

import { rssFeeds } from './index';

const rssSchema = string()
  .trim()
  .required()
  .url()
  .test((rssURL) => {
    const isValid = !rssFeeds.map(({ link }) => link).includes(rssURL);

    if (isValid) {
      return true;
    }
    throw new Error(appState.i18n.t('rssLoadMessages.isExists'));
  });

const validateRssUrl = (input) => rssSchema.isValid(input);

export default validateRssUrl;
