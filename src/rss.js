/* eslint-disable arrow-body-style */
import { uniqueId } from 'lodash';

let uniquePostId = uniqueId();

export const savePosts = (posts, newPosts, feedId) => {
  const addablePosts = newPosts.filter((newPost) => {
    return !posts.some((post) => post.title === newPost.title);
  });

  posts.splice(0, posts.length, ...addablePosts.map((post) => {
    uniquePostId += 1;

    return {
      ...post,
      id: uniquePostId,
      feedId,
      isReaded: false,
    };
  }));
};

let uniqueFeedId = uniqueId();

export const saveRss = (feeds, feed, link) => {
  const newFeed = {
    ...feed,
    id: uniqueFeedId += 1,
    posts: [],
    link,
  };

  feeds.push(newFeed);

  return newFeed;
};

// const getRssStream = (rssUrl, appState) => {
//   const { i18n } = appState;

//   return loadRssStream(rssUrl)
//     .then((data) => parseData(data))
//     .then((result) => saveRss(appState.rssFeeds, result, rssUrl))
//     .catch((error) => {
//       throw new Error(i18n.t(error.message));
//     });
// };

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
