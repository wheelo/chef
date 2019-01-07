/**
 * 代码参考: https://github.com/i18next/i18next
 * TODO: 未来这个模块将会与插件系统深度整合
 */

import baseLogger from './logger.js';
import { EventEmitter } from '@chef/chef-utils';
import ResourceStore from './ResourceStore.js';
import Translator from './Translator.js';
import LanguageUtils from './LanguageUtils.js';
import PluralResolver from './PluralResolver.js';
import Interpolator from './Interpolator.js';
// 暂时不使用服务器加载语言数据
import BackendConnector from './BackendConnector.js';
import { get as getDefaults, transformOptions } from './defaults.js';

function noop() { }

class I18n extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = { external: [] };

    if (callback && !this.isInitialized && !options.isClone) {
      return this.init(options, callback);
    }
  }

  init(options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.options = { ...getDefaults(), ...this.options, ...transformOptions(options) };

    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;

    function createClassOnDemand(ClassOrObject) {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === 'function') return new ClassOrObject();
      return ClassOrObject;
    }

    // init services
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }

      const lu = new LanguageUtils(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);

      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, { prepend: this.options.pluralSeparator, compatibilityJSON: this.options.compatibilityJSON, simplifyPluralSuffix: this.options.simplifyPluralSuffix });
      s.interpolator = new Interpolator(this.options);
      // 考虑暂时不使用服务器
      s.backendConnector = new BackendConnector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      // pipe events from backendConnector
      s.backendConnector.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });

      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        s.languageDetector.init(s, this.options.detection, this.options);
      }

      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }

      this.translator = new Translator(this.services, this.options);
      // pipe events from translator
      this.translator.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });

      this.modules.external.forEach((m) => {
        if (m.init) m.init(this);
      });
    }

    // add 动态加载资源 remove 删除语言 getLan 获取语言 addAsync异步加载语言包
    const storeApi = ['add', 'remove', 'has', 'getLan', 'addAsync'];
    storeApi.forEach((fcName) => {
      this[fcName] = (...args) => this.store[fcName](...args);
    });

    this.changeLanguage(this.options.lng, (err, t) => {
      this.isInitialized = true;
      this.logger.log('initialized', this.options);
      this.emit('initialized', this.options);

      callback(err, t);
    });

    return this;
  }

  loadResources(callback = noop) {
    if (!this.options.resources) {
      if (this.language && this.language.toLowerCase() === 'cimode') return callback(); // avoid loading resources for cimode

      const toLoad = [];

      const append = lng => {
        if (!lng) return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };

      if (!this.language) {
        // at least load fallbacks in this case
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach(l => append(l));
      } else {
        append(this.language);
      }

      if (this.options.preload) {
        this.options.preload.forEach(l => append(l));
      }

      this.services.backendConnector.load(toLoad, callback);
    } else {
      callback(null);
    }
  }

  reloadResources(lngs, callback) {
    if (!lngs) lngs = this.languages;
    // if (!ns) ns = this.options.ns;
    if (!callback) callback = () => { };
    this.services.backendConnector.reload(lngs, callback);
  }

  use(module) {
    if (module.type === 'backend') {
      this.modules.backend = module;
    }

    if (module.type === 'logger' || (module.log && module.warn && module.error)) {
      this.modules.logger = module;
    }

    if (module.type === 'languageDetector') {
      this.modules.languageDetector = module;
    }

    // 暂时用不到
    if (module.type === 'i18nFormat') {
      this.modules.i18nFormat = module;
    }

    if (module.type === '3rdParty') {
      this.modules.external.push(module);
    }

    return this;
  }

  changeLan(lng, callback) {
    this.changeLanguage(lng, callback);
  }

  changeLanguage(lng, callback) {
    const done = (err, l) => {
      this.translator.changeLanguage(l);

      if (l) {
        this.emit('languageChanged', l);
        this.logger.log('languageChanged', l);
      }

      if (callback) callback(err, (...args) => this.t(...args));
    };

    const setLng = l => {
      if (l) {
        this.language = l;
        this.languages = this.services.languageUtils.toResolveHierarchy(l);
        if (!this.translator.language) this.translator.changeLanguage(l);

        if (this.services.languageDetector) this.services.languageDetector.cacheUserLanguage(l);
      }

      this.loadResources((err) => {
        done(err, l);
      });
    };

    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      this.services.languageDetector.detect(setLng);
    } else {
      setLng(lng);
    }
  }

  getFixedT(lng, ns) {
    const fixedT = (key, opts, ...rest) => {
      let options = { ...opts };
      if (typeof opts !== 'object') {
        options = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      }

      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      // 去掉ns限制
      // options.ns = options.ns || fixedT.ns;
      return this.t(key, options);
    };
    if (typeof lng === 'string') {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    // fixedT.ns = ns;
    return fixedT;
  }

  t(...args) {
    return this.translator && this.translator.translate(...args);
  }

  exists(...args) {
    return this.translator && this.translator.exists(...args);
  }

  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  // 将会deprecate
  loadNamespaces(ns, callback) {
    if (!this.options.ns) return callback && callback();
    if (typeof ns === 'string') ns = [ns];

    ns.forEach((n) => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });

    this.loadResources(callback);
  }

  loadLanguages(lngs, callback) {
    if (typeof lngs === 'string') lngs = [lngs];
    const preloaded = this.options.preload || [];

    const newLngs = lngs.filter(lng => preloaded.indexOf(lng) < 0);
    // Exit early if all given languages are already preloaded
    if (!newLngs.length) return callback();

    this.options.preload = preloaded.concat(newLngs);
    this.loadResources(callback);
  }

  dir(lng) {
    if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
    if (!lng) return 'rtl';

    const rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm',
      'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb',
      'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he',
      'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo',
      'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'
    ];

    return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
  }

  createInstance(options = {}, callback) {
    return new I18n(options, callback);
  }

}

export default new I18n();
