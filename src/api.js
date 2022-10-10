import axios from 'axios';

import { parseData } from '@src/parser';
import { rssPosts, rssFeeds, appState } from '@src/index';

const baseUrl = 'https://allorigins.hexlet.app';

export const loadRssStream = (rssPath) => {
  appState.startLoading();

  return axios.get(`${baseUrl}/raw?disableCache=true&url=${rssPath}`)
    .then(({ data }) => {
      const parsedDocument = parseData(data);

      const title = parsedDocument.querySelector('title')?.textContent;
      const link = parsedDocument.querySelector('link')?.textContent;
      const description = parsedDocument.querySelector('description')?.textContent;
      const language = parsedDocument.querySelector('language')?.textContent;

      const feed = {
        title,
        link,
        description,
        language,
        posts: [],
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
    .finally(() => appState.finishLoading());
};
