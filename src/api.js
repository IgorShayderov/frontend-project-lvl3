import axios from 'axios';

const getProxiedUrl = (path) => {
  const baseURL = 'https://allorigins.hexlet.app/get';
  const proxiedURL = new URL(baseURL);

  proxiedURL.searchParams.set('disableCache', true);
  proxiedURL.searchParams.set('url', path);

  return proxiedURL.toString();
};

const loadRssStream = (rssPath) => axios.get(getProxiedUrl(rssPath))
  .then(({ data }) => {
    if (data.status?.error) {
      throw new Error('Response error');
    }

    return data.contents;
  });

export default loadRssStream;
