import { Modal } from 'bootstrap';

export const showModal = ({ title, description, link }) => {
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
        id, link, title,
      } = post;

      const listItem = document.createElement('li');
      const linkElement = document.createElement('a');
      const button = document.createElement('button');

      listItem.classList.add('rss-posts-list__item');
      listItem.setAttribute('data-id', id);

      linkElement.setAttribute('href', link);
      linkElement.setAttribute('target', '_blank');
      linkElement.classList.add(appState.readedPosts.includes(post.id) ? 'fw-normal' : 'fw-bold');
      linkElement.textContent = title;

      button.setAttribute('type', 'button');
      button.textContent = i18n.t('basic.view');
      button.classList.add('btn');
      button.classList.add('btn-primary');
      button.addEventListener('click', () => {
        appState.shownPost = post;
        appState.isModalShown = true;

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

export const hideLoading = (i18n) => {
  const rssBtn = document.querySelector('.rss-form__submit-btn span');

  rssBtn.classList.remove('loading');
  rssBtn.textContent = i18n.t('basic.add');
  rssBtn.removeAttribute('disabled');
};

/**
 * Sets message in special HTML node
 * @param {string} message - Text of message
 * @param {'success' | 'danger'} status - Message status
 */
export const setMessage = (message, status = 'success') => {
  const messagesField = document.querySelector('.messages-field');
  const isSuccessful = status === 'success';

  messagesField.classList.add(isSuccessful ? 'text-success' : 'text-danger');
  messagesField.classList.remove(isSuccessful ? 'text-danger' : 'text-success');

  messagesField.textContent = message;
};

export const fillAppTitles = (i18n) => {
  const link = 'https://ru.hexlet.io/lessons.rss';

  document.querySelector('.app-name').textContent = i18n.t('basic.appName');
  document.querySelector('.posts-title').textContent = i18n.t('basic.posts');
  document.querySelector('.feeds-title').textContent = i18n.t('basic.feeds');
  document.querySelector('.example').textContent = `${i18n.t('basic.example')}: ${link}`;
  document.querySelector('.rss-form__submit-btn span').textContent = i18n.t('basic.add');
};
