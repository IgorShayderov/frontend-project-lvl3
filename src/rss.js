/* eslint-disable arrow-body-style */
import { rssFeeds } from '@src/index';
import { loadRssStream } from '@src/api';
import { renderRss } from '@src/render';
import { validateRssUrl } from '@src/validation';

const isRssFeedAlreadyExists = ({ title, link }) => {
  return rssFeeds.some((rssFeed) => rssFeed.title === title && rssFeed.link === link);
};

const findFeed = ({ title, link }) => {
  return rssFeeds.find((existingFeed) => {
    return existingFeed.title === title && existingFeed.link === link;
  });
};

const addPostsToFeed = (feed, newPosts) => {
  newPosts.forEach((newPost) => {
    const isPostExists = feed.posts.some((post) => post.title === newPost.title);

    if (!isPostExists) {
      feed.posts.push({
        ...newPost,
        feedId: feed.id,
        isReaded: false,
      });
    }
  });
};

let uniqueId = performance.now();

export const saveRss = ({ posts, feed }) => new Promise((resolve) => {
  const isExistingFeed = isRssFeedAlreadyExists(feed);

  if (!isExistingFeed) {
    rssFeeds.push({
      ...feed,
      id: uniqueId += 1,
      posts: [],
    });
  }

  const addedFeed = isRssFeedAlreadyExists ? findFeed(feed) : feed;

  addPostsToFeed(addedFeed, posts);

  console.log({ rssFeeds });
  resolve();
});

export const getRssStream = (rssUrl) => {
  return validateRssUrl(rssUrl)
    .then((isValid) => {
      if (isValid) {
        return loadRssStream(rssUrl);
      }

      throw new Error('Invalid input');
    })
    .then((result) => saveRss(result))
    .then(() => renderRss());
};

export const watchRssStreams = () => {
  const timeout = 5000;

  window.setTimeout(() => {
    rssFeeds.forEach((feed) => {
      return new Promise((resolve) => {
        getRssStream(feed.link)
          .then(() => resolve());
      });
    });

    watchRssStreams();
  }, timeout);
};
