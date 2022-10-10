import axios from 'axios';

import { parseData } from '@src/parser';
import { rssPosts, rssFeeds } from '@src/index';

const baseUrl = 'https://allorigins.hexlet.app';

export const loadRssStream = (rssPath) => axios.get(`${baseUrl}/raw?disableCache=true&url=${rssPath}`)
  .then(({ data }) => {
    const parsedDocument = parseData(data);

    const title = parsedDocument.querySelector('title')?.textContent;
    const link = parsedDocument.querySelector('link')?.textContent;
    const description = parsedDocument.querySelector('description')?.textContent;
    const language = parsedDocument.querySelector('language')?.textContent;

    rssFeeds.push({
      title,
      link,
      description,
      language,
    });

    const items = parsedDocument.querySelectorAll('item');

    items.forEach((item) => {
      const itemTitle = item.querySelector('title')?.textContent;
      const itemLink = item.querySelector('link')?.textContent;
      const itemDescription = item.querySelector('description')?.textContent;

      rssPosts.push({
        title: itemTitle,
        link: itemLink,
        description: itemDescription,
      });
    });
  });
