import i18next from 'i18next';
import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'Não é válido',
  },
  number: {
    min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  },
});

// catch (err) {
//   messages = err.errors.map((err) => i18next.t(err.key));
// }

export const initI18N = () => {
  i18next.init({
    lng: 'en',
    resources: {
      en: {
        translation: {
          hz: 'hz',
        },
      },
    },
  });
};
