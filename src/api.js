import axios from 'axios';

import { parseData } from '@src/parser';
import { appState } from '@src/index';
import { t } from 'i18next';

const baseUrl = 'https://allorigins.hexlet.app';

export const loadRssStream = (rssPath) => {
  appState.startLoading();

  return axios.get(`${baseUrl}/raw?disableCache=true&url=${rssPath}`)
    .then(({ data }) => {
      const parsedDocument = parseData(data);

      if (parsedDocument.documentElement.tagName !== 'rss') {
        throw new Error(t('rssLoadMessages.invalidRSS'));
      }

      const title = parsedDocument.querySelector('title')?.textContent;
      const description = parsedDocument.querySelector('description')?.textContent;
      const language = parsedDocument.querySelector('language')?.textContent;

      const feed = {
        title,
        link: rssPath,
        description,
        language,
      };

      const items = parsedDocument.querySelectorAll('item');

      const posts = Array.from(items).map((item) => {
        const itemTitle = item.querySelector('title')?.textContent;
        const itemLink = item.querySelector('link')?.textContent;
        const itemDescription = item.querySelector('description')?.textContent;

        return {
          title: itemTitle,
          link: itemLink,
          description: itemDescription,
        };
      });

      return {
        feed,
        posts,
      };
    })
    .catch(() => {
      throw new Error(t('rssLoadMessages.invalidRSS'));
    })
    .finally(() => appState.finishLoading());
};
