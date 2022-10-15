import { rssFeeds, appState } from '@src/index';

const renderDefaultPostsMessage = () => {
  const rssPostsList = document.querySelector('.rss-posts-list');

  rssPostsList.append('Посты отсутствуют');
};

const renderDefaultFeedsMessage = () => {
  const rssFeedsList = document.querySelector('.rss-feeds-list');

  rssFeedsList.append('Фиды отсутствуют');
};

export const renderDefaultMessages = () => {
  renderDefaultPostsMessage();
  renderDefaultFeedsMessage();
};

const renderPosts = (posts) => {
  const rssPostsList = document.querySelector('.rss-posts-list');
  const rssPostsFragment = posts.reduce((rssPostsNode, post) => {
    const {
      id, link, title, description, isReaded,
    } = post;
    const listItem = document.createElement('li');
    const linkElement = document.createElement('a');
    const button = document.createElement('button');

    listItem.classList.add('rss-posts-list__item');
    listItem.classList.add('fw-bold');
    listItem.setAttribute('data-id', id);

    linkElement.setAttribute('href', link);
    linkElement.setAttribute('target', '_blank');
    linkElement.textContent = title;

    button.setAttribute('type', 'button');
    button.textContent = 'Посмотреть';
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.addEventListener('click', () => {
      appState.postsModal.show({
        title, description, link,
      });

      if (!isReaded) {
        post.isReaded = true;

        const postNode = document.querySelector(`.rss-posts-list__item[data-id='${id}']`);

        if (postNode !== null) {
          postNode.classList.replace('fw-bold', 'fw-normal');
        } else {
          throw new Error(`Not found post with id ${id}`);
        }
      }
    });

    listItem.append(linkElement, button);
    rssPostsNode.append(listItem);

    return rssPostsNode;
  }, new DocumentFragment());

  if (posts.length === 0) {
    renderDefaultPostsMessage();
  }

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

    if (rssFeeds.length === 0) {
      renderDefaultFeedsMessage();
    }

    rssFeedsList.replaceChildren(rssFeedsFragment);
    resolve();
  } catch (error) {
    reject(error);
  }
});
