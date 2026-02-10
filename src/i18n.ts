
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// We'll create these translation files in the next step
import enTranslation from './locales/en/translation.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
