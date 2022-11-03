import { string } from 'yup';

const validateRssUrl = (input, appState) => {
  const rssSchema = string()
    .trim()
    .required()
    .url()
    .test((rssURL) => {
      const isValid = !appState.feeds.map(({ link }) => link).includes(rssURL);

      if (isValid) {
        return true;
      }

      throw new Error('rssLoadMessages.isExists');
    });

  return rssSchema.isValid(input);
};

export default validateRssUrl;
