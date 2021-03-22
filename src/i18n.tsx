import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// eslint-disable-next-line import/no-webpack-loader-syntax
const resBundle = require('i18next-resource-store-loader!./assets/i18n/index.js');

i18n.use(initReactI18next).init({
  lng: 'de',
  resources: resBundle,
  fallbackLng: 'en',
  debug: true,
  /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

export default i18n;
