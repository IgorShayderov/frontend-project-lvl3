/* eslint-disable arrow-body-style */
import { uniqueId } from 'lodash';

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

// export default getRssStream;

// export const watchRssStreams = (appState) => {
//   const timeout = 5000;

//   window.setTimeout(() => {
//     appState.rssFeeds.forEach((feed) => {
//       return new Promise((resolve) => {
//         getRssStream(feed.link, appState)
//           .then(() => resolve());
//       });
//     });

//     watchRssStreams(appState);
//   }, timeout);
// };

// запустили таймаут
// обновили фид
// запустили еще один со следующим фидом
