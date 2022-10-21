/* eslint-disable arrow-body-style */
import { renderRss } from '@src/render';
import loadRssStream from '@src/api';
import parseData from '@src/parser';

export const getRssStream = (rssUrl, appState) => {
  const getCacheKey = () => {
    const postsCount = appState.rssFeeds.reduce((total, { posts }) => total + posts.length, 0);

    return appState.rssFeeds.length + postsCount;
  };

  const isRssFeedAlreadyExists = ({ title }) => {
    return appState.rssFeeds.some((rssFeed) => rssFeed.title === title);
  };

  const findFeed = ({ title }) => {
    return appState.rssFeeds.find((existingFeed) => {
      return existingFeed.title === title;
    });
  };

  let uniquePostId = performance.now();

  const addPostsToFeed = (feed, newPosts) => {
    newPosts.forEach((newPost) => {
      const isPostExists = feed.posts.some((post) => post.title === newPost.title);

      if (!isPostExists) {
        feed.posts.push({
          ...newPost,
          id: uniquePostId += 1,
          feedId: feed.id,
          isReaded: false,
        });
      }
    });
  };

  let uniqueFeedId = performance.now() * Math.random();

  const saveRss = ({ posts, feed }, link) => new Promise((resolve) => {
    const isExistingFeed = isRssFeedAlreadyExists(feed);

    if (!isExistingFeed) {
      appState.rssFeeds.push({
        ...feed,
        id: uniqueFeedId += 1,
        posts: [],
        link,
      });
    }

    const addedFeed = isRssFeedAlreadyExists ? findFeed(feed) : feed;

    addPostsToFeed(addedFeed, posts);

    resolve();
  });

  const { i18n } = appState;
  const oldCacheKey = getCacheKey();

  return loadRssStream(rssUrl)
    .then((data) => parseData(data))
    .then((result) => saveRss(result, rssUrl))
    .then(() => {
      const newCacheKey = getCacheKey();

      if (oldCacheKey !== newCacheKey) {
        renderRss(appState);
      }
    })
    .catch((error) => {
      throw new Error(i18n.t(error.message));
    });
};

export const watchRssStreams = (appState) => {
  const timeout = 5000;

  window.setTimeout(() => {
    appState.rssFeeds.forEach((feed) => {
      return new Promise((resolve) => {
        getRssStream(feed.link, appState)
          .then(() => resolve());
      });
    });

    watchRssStreams(appState);
  }, timeout);
};
