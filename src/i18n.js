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
            nodeSearchErrors: {
              messagesField: 'Can\'t find messages field',
              modal: 'Modal window is not found',
            },
            appErrors: {
              postNotFound: 'Not found post with id {{id}}',
            },
            emptyState: {
              posts: 'Posts are absent',
              feeds: 'Feeds are absent',
            },
            basic: {
              example: 'Example',
              appName: 'RSS aggregator',
              feeds: 'Feeds',
              posts: 'Posts',
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
            nodeSearchErrors: {
              messagesField: 'Не удалось найти поле для сообщений',
              modal: 'Не удалось найти модальное окно',
            },
            appErrors: {
              postNotFound: 'Не найден пост с идентификатором {{id}}',
            },
            emptyState: {
              posts: 'Посты отсутствуют',
              feeds: 'Фиды отсутствуют',
            },
            basic: {
              example: 'Пример',
              appName: 'RSS агрегатор',
              feeds: 'Фиды',
              posts: 'Посты',
            },
          },
        },
      },
    }).then(() => resolve(i18nInstance));
  });
};

export default initI18N;
