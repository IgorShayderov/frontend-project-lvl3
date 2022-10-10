import { string } from 'yup';

import { rssFeeds } from './index';

const rssSchema = string()
  .trim()
  .required()
  .url()
  .test((rss) => !rssFeeds.includes(rss));

export const validate = (input) => rssSchema.isValid(input);
