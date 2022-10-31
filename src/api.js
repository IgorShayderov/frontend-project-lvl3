import axios from 'axios';

const getProxiedUrl = (path) => {
  const baseURL = 'https://allorigins.hexlet.app/get';
  const proxiedURL = new URL(baseURL);

  proxiedURL.searchParams.set('disableCache', true);
  proxiedURL.searchParams.set('url', path);

  return proxiedURL.toString();
};

const loadRssStream = (rssPath) => axios.get(getProxiedUrl(rssPath))
  .catch(() => { throw new Error('rssLoadMessages.networkError'); })
  .then(({ data }) => {
    if (data.status?.error) {
      throw new Error('rssLoadMessages.networkError');
    }

    return data.contents;
  });

export default loadRssStream;
