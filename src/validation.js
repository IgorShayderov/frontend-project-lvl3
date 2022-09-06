import { string } from 'yup';

import { rssList } from './index';

const rssSchema = string()
  .trim()
  .required()
  .url()
  .test((rss) => !rssList.includes(rss));

export const validate = (input) => rssSchema.isValid(input);
