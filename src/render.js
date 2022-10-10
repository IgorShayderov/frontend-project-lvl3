import { rssFeeds } from '@src/index';

const renderPosts = (posts) => {
  const rssPostsList = document.querySelector('.rss-posts-list');
  const rssPostsFragment = posts.reduce((rssPostsNode, { link, title }) => {
    const listItem = document.createElement('li');

    listItem.classList.add('rss-posts-list__item');

    const linkElement = document.createElement('a');

    linkElement.setAttribute('href', link);
    linkElement.setAttribute('target', '_blank');
    linkElement.textContent = title;

    const button = document.createElement('button');

    button.setAttribute('type', 'button');
    button.textContent = 'Посмотреть';
    button.classList.add('btn');
    button.classList.add('btn-primary');

    listItem.append(linkElement, button);
    rssPostsNode.append(listItem);

    return rssPostsNode;
  }, new DocumentFragment());

  rssPostsList.replaceChildren(rssPostsFragment);
};

export const renderRss = () => new Promise((resolve, reject) => {
  try {
    const rssFeedsList = document.querySelector('.rss-feeds-list');
    const rssFeedsFragment = rssFeeds.reduce((rssFeedsNode, { title, description, posts }) => {
      const listItem = document.createElement('li');

      listItem.classList.add('rss-feeds-list__item');

      const header = document.createElement('h3');

      header.textContent = title;

      const text = document.createElement('p');

      text.textContent = description;

      listItem.append(header, text);
      rssFeedsNode.append(listItem);

      renderPosts(posts);

      return rssFeedsNode;
    }, new DocumentFragment());

    rssFeedsList.replaceChildren(rssFeedsFragment);
    resolve();
  } catch (error) {
    reject(error);
  }
});
