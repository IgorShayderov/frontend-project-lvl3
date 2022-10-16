import axios from 'axios';

import { parseData } from '@src/parser';
import { appState } from '@src/index';
import { t } from 'i18next';

const getProxiedUrl = (path) => {
  const baseURL = 'https://allorigins.hexlet.app/get';
  const proxiedURL = new URL(baseURL);

  proxiedURL.searchParams.set('disableCache', true);
  proxiedURL.searchParams.set('url', path);

  return proxiedURL.toString();
};

export const loadRssStream = (rssPath) => {
  appState.startLoading();

  return axios.get(getProxiedUrl(rssPath))
    .catch(() => { throw new Error(t('rssLoadMessages.networkError')); })
    .then(({ data }) => {
      if (data.status?.error) {
        throw new Error(t('rssLoadMessages.networkError'));
      }

      const parsedDocument = parseData(data.contents);

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
    .finally(() => appState.finishLoading());
};
