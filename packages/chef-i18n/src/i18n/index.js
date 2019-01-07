// TODO: i18n的class放到utils
import i18n from './i18n.js';

export default i18n;

// 只导出需要的模块
export const changeLanguage = i18n.changeLanguage.bind(i18n);
export const createInstance = i18n.createInstance.bind(i18n);
export const dir = i18n.dir.bind(i18n);
export const exists = i18n.exists.bind(i18n);
export const getFixedT = i18n.getFixedT.bind(i18n);
export const init = i18n.init.bind(i18n);
export const loadLanguages = i18n.loadLanguages.bind(i18n);
// export const loadNamespaces = i18n.loadNamespaces.bind(i18n);
export const loadResources = i18n.loadResources.bind(i18n);
export const off = i18n.off.bind(i18n);
export const on = i18n.on.bind(i18n);
export const setDefaultNamespace = i18n.setDefaultNamespace.bind(i18n);
export const t = i18n.t.bind(i18n);
export const use = i18n.use.bind(i18n);
