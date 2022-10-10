/* eslint-disable arrow-body-style */
import { rssFeeds } from '@src/index';

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
      feed.posts.push(newPost);
    }
  });
};

export const saveRss = ({ posts, feed }) => new Promise((resolve) => {
  if (!isRssFeedAlreadyExists(feed)) {
    rssFeeds.push(feed);
  }

  const addedFeed = isRssFeedAlreadyExists ? findFeed(feed) : feed;

  addPostsToFeed(addedFeed, posts);

  console.log({ rssFeeds });
  resolve();
});
