import { rssPosts, rssFeeds } from '@src/index';

export const renderRss = () => new Promise((resolve, reject) => {
  try {
    console.log(rssPosts, 'rssPosts');
    console.log(rssFeeds, 'rssFeeds');

    const rssFeedsList = document.querySelector('.rss-feeds-list');
    const rssFeedsFragment = rssFeeds.reduce((rssFeedsNode, { link, title, description }) => {
      const listItem = document.createElement('li');
      const header = document.createElement('h3');

      header.textContent = title;

      const text = document.createElement('p');

      text.textContent = description;

      listItem.append(header, text);
      rssFeedsNode.append(listItem);

      return rssFeedsNode;
    }, new DocumentFragment());

    rssFeedsList.replaceChildren(rssFeedsFragment);

    const rssPostsList = document.querySelector('.rss-posts-list');
    const rssPostsFragment = rssPosts.reduce((rssPostsNode, { link, title, description }) => {
      const listItem = document.createElement('li');
      const linkElement = document.createElement('a');

      linkElement.setAttribute('href', link);
      linkElement.setAttribute('target', '_blank');
      linkElement.textContent = title;

      const button = document.createElement('button');

      button.setAttribute('type', 'button');
      button.textContent = 'Посмотреть';

      listItem.append(linkElement, button);
      rssPostsNode.append(listItem);

      return rssPostsNode;
    }, new DocumentFragment());

    rssPostsList.replaceChildren(rssPostsFragment);
    resolve();
  } catch (error) {
    reject(error);
  }
});
