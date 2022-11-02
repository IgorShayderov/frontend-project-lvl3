/* eslint-disable arrow-body-style */
import { uniqueId } from 'lodash';

import loadRssStream from '@src/api';
import parseData from '@src/parser';

export const savePosts = (posts, newPosts, feedId) => {
  const addablePosts = newPosts.filter((newPost) => {
    return !posts.some((post) => post.title === newPost.title);
  });

  posts.splice(0, posts.length, ...addablePosts.map((post) => {
    return {
      ...post,
      id: uniqueId(),
      feedId,
    };
  }));
};

export const saveRss = (feeds, feed, link) => {
  const newFeed = {
    ...feed,
    id: uniqueId(),
    posts: [],
    link,
  };

  feeds.push(newFeed);

  return newFeed;
};

export const watchRssStreams = (appState) => {
  const timeout = 5000;

  window.setTimeout(() => {
    Promise.all(appState.feeds.map(({ link }) => loadRssStream(link)))
      .then((dataList) => {
        dataList.forEach((data, index) => {
          const { posts } = parseData(data);
          const { id: feedId } = appState.feeds[index];

          savePosts(appState.posts, posts, feedId);
        });

        watchRssStreams(appState);
      });
  }, timeout);
};
