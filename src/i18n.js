import i18next from 'i18next';

const initI18N = () => {
  const i18nInstance = i18next.createInstance();

  return new Promise((resolve) => {
    i18nInstance.init({
      lng: 'ru',
      resources: {
        en: {
          translation: {
            rssLoadMessages: {
              success: 'RSS has been successfully loaded',
              invalidRSS: 'The resource does not have valid RSS',
              ivalidURL: 'The link should be valid URL',
              isExists: 'RSS уже существует',
              networkError: 'Network error',
            },
            emptyState: {
              posts: 'Posts are absent',
              feeds: 'Feeds are absent',
            },
            errors: {
              unknownStatus: 'Unknown status - {{status}}',
            },
            basic: {
              example: 'Example',
              appName: 'RSS aggregator',
              feeds: 'Feeds',
              posts: 'Posts',
              view: 'View',
              add: 'Add',
            },
          },
        },
        ru: {
          translation: {
            rssLoadMessages: {
              success: 'RSS успешно загружен',
              invalidRSS: 'Ресурс не содержит валидный RSS',
              ivalidURL: 'Ссылка должна быть валидным URL',
              isExists: 'RSS уже существует',
              networkError: 'Ошибка сети',
            },
            emptyState: {
              posts: 'Посты отсутствуют',
              feeds: 'Фиды отсутствуют',
            },
            errors: {
              unknownStatus: 'Неизвестный статус - {{status}}',
            },
            basic: {
              example: 'Пример',
              appName: 'RSS агрегатор',
              feeds: 'Фиды',
              posts: 'Посты',
              view: 'Просмотр',
              add: 'Добавить',
            },
          },
        },
      },
    }).then(() => resolve(i18nInstance));
  });
};

export default initI18N;
