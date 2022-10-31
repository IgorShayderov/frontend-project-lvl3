import { Modal } from 'bootstrap';

const showModal = ({ title, description, link }) => {
  const modalNode = document.querySelector('#postsModal');
  const modal = new Modal(modalNode);
  const titleNode = document.querySelector('#postsModalLabel');
  const descriptionNode = document.querySelector('.modal-body');
  const showMoreLink = document.querySelector('.btn-primary a');

  titleNode.textContent = title;
  descriptionNode.textContent = description;
  showMoreLink.setAttribute('href', link);

  modal.show();
};

const renderDefaultPostsMessage = (appState) => {
  const { i18n } = appState;
  const rssPostsList = document.querySelector('.rss-posts-list');

  rssPostsList.append(i18n.t('emptyState.posts'));
};

const renderDefaultFeedsMessage = (appState) => {
  const { i18n } = appState;
  const rssFeedsList = document.querySelector('.rss-feeds-list');

  rssFeedsList.append(i18n.t('emptyState.feeds'));
};

export const renderDefaultMessages = (appState) => {
  renderDefaultPostsMessage(appState);
  renderDefaultFeedsMessage(appState);
};

export const renderPosts = (appState) => {
  const rssPostsList = document.querySelector('.rss-posts-list');
  const rssPostsFragment = appState.posts.reduce((rssPostsNode, post) => {
    const {
      id, link, title, description, isReaded,
    } = post;
    const listItem = document.createElement('li');
    const linkElement = document.createElement('a');
    const button = document.createElement('button');

    listItem.classList.add('rss-posts-list__item');
    listItem.setAttribute('data-id', id);

    linkElement.setAttribute('href', link);
    linkElement.setAttribute('target', '_blank');
    linkElement.classList.add('fw-bold');
    linkElement.textContent = title;

    button.setAttribute('type', 'button');
    button.textContent = appState.i18n.t('basic.view');
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.addEventListener('click', () => {
      showModal({
        title, description, link,
      });

      if (!isReaded) {
        post.isReaded = true;

        const postNode = document.querySelector(`.rss-posts-list__item[data-id='${id}']`);

        postNode.querySelector('a').classList.replace('fw-bold', 'fw-normal');
      }
    });

    listItem.append(linkElement, button);
    rssPostsNode.append(listItem);

    return rssPostsNode;
  }, new DocumentFragment());

  renderDefaultPostsMessage(appState);
  rssPostsList.replaceChildren(rssPostsFragment);
};

export const renderFeeds = (appState) => {
  const rssFeedsList = document.querySelector('.rss-feeds-list');
  const rssFeedsFragment = appState.feeds
    .reduce((rssFeedsNode, { title, description }) => {
      const listItem = document.createElement('li');
      const header = document.createElement('h3');
      const text = document.createElement('p');

      listItem.classList.add('rss-feeds-list__item');
      header.textContent = title;
      text.textContent = description;

      listItem.append(header, text);
      rssFeedsNode.append(listItem);

      return rssFeedsNode;
    }, new DocumentFragment());

  if (appState.feeds.length === 0) {
    renderDefaultFeedsMessage();
  }

  rssFeedsList.replaceChildren(rssFeedsFragment);
};
