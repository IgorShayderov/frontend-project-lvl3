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

const renderDefaultPostsMessage = (i18n) => {
  const rssPostsList = document.querySelector('.rss-posts-list');

  rssPostsList.append(i18n.t('emptyState.posts'));
};

const renderDefaultFeedsMessage = (i18n) => {
  const rssFeedsList = document.querySelector('.rss-feeds-list');

  rssFeedsList.append(i18n.t('emptyState.feeds'));
};

export const renderDefaultMessages = (i18n) => {
  renderDefaultPostsMessage(i18n);
  renderDefaultFeedsMessage(i18n);
};

export const renderPosts = (appState, i18n) => {
  if (appState.posts.length > 0) {
    const rssPostsList = document.querySelector('.rss-posts-list');
    const rssPostsFragment = appState.posts.reduce((rssPostsNode, post) => {
      const {
        id, link, title, description,
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
      button.textContent = i18n.t('basic.view');
      button.classList.add('btn');
      button.classList.add('btn-primary');
      button.addEventListener('click', () => {
        showModal({
          title, description, link,
        });

        if (!appState.readedPosts.includes(post.id)) {
          appState.readedPosts.push(post.id);
        }
      });

      listItem.append(linkElement, button);
      rssPostsNode.append(listItem);

      return rssPostsNode;
    }, new DocumentFragment());

    rssPostsList.replaceChildren(rssPostsFragment);
  }
};

export const renderFeeds = (appState) => {
  if (appState.feeds.length > 0) {
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

    rssFeedsList.replaceChildren(rssFeedsFragment);
  }
};

export const showLoading = () => {
  const rssBtn = document.querySelector('.rss-form__submit-btn span');

  rssBtn.textContent = '';
  rssBtn.classList.add('loading');
  rssBtn.setAttribute('disabled', 'disabled');
};

export const hideLoading = () => {
  const rssBtn = document.querySelector('.rss-form__submit-btn span');

  rssBtn.classList.remove('loading');
  rssBtn.textContent = 'Add';
  rssBtn.removeAttribute('disabled');
};
