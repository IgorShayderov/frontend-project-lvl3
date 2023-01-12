import i18next from 'i18next';
import resources from './locales/index.js';

const initI18N = () => {
  const i18nInstance = i18next.createInstance();

  return new Promise((resolve) => {
    i18nInstance.init({
      lng: 'ru',
      resources,
    }).then(() => resolve(i18nInstance));
  });
};

export default initI18N;
