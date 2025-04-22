import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import JSON files
import enTranslations from './en.json';
import ptTranslations from './pt.json';

const resources = {
  en: {
    translation: enTranslations
  },
  pt: {
    translation: ptTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: Localization.getLocales()[0].languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      console.warn(`Missing translation: ${key}`);
    },
  });

export default i18n;