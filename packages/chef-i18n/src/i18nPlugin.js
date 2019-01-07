import { createPlugin, unescape, createToken } from '@chef/chef-core';
import i18n from './i18n/index.js';
import { reactI18nextModule } from './i18nContext/context';
// 可以检测本地并且缓存
import LngDetector from 'i18next-browser-languagedetector';

const I18nToken = createToken('I18nToken');

const pluginFactory = () =>
  createPlugin({
    token: I18nToken,
    deps: {
      translations: createToken('translationsToken'),
      lng: createToken('lngToken'),
      detect: createToken('detectToken')
    },
    // translations: 本地提供的翻译数据
    // lng: 默认的翻译语种
    provides: ({ translations, lng, detect }) => {
      // const i18n = new I18n(): I18n extends EventEmitter
      i18n.use(reactI18nextModule);
  
      if (detect) {
        i18n
        .use(LngDetector)
        .init({
          resources: translations,
          fallbackLng: lng,
          // lng,
          keySeparator: false,
          interpolation: {
            escapeValue: false
          },
          detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['localStorage', 'cookie']
          }
        });
      }
      else {
        i18n.init({
          resources: translations,
          fallbackLng: lng,
          keySeparator: false,
          interpolation: {
            escapeValue: false
          }
        });
      }

      return { from: () => i18n };
    }
  });


export { i18n, I18nToken };

export default pluginFactory();
