import { rssFeeds } from '@src/index';

const renderPosts = (posts) => {
  const rssPostsList = document.querySelector('.rss-posts-list');
  const rssPostsFragment = posts.reduce((rssPostsNode, { link, title }) => {
    const listItem = document.createElement('li');
    const linkElement = document.createElement('a');
    const button = document.createElement('button');

    listItem.classList.add('rss-posts-list__item');
    linkElement.setAttribute('href', link);
    linkElement.setAttribute('target', '_blank');
    linkElement.textContent = title;

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
      const header = document.createElement('h3');
      const text = document.createElement('p');

      listItem.classList.add('rss-feeds-list__item');
      header.textContent = title;
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
