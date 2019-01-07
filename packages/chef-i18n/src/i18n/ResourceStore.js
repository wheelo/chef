import { EventEmitter } from '@chef/chef-utils';
import * as utils from './utils.js';

class ResourceStore extends EventEmitter {
  constructor(data, options = {}) {
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }
  }

  // 动态添加语言
  add(lng, resources, options = { silent: false }) {
    if (!lng) {
      console.log('缺少必要的语言包', lng);
    }
    let path = [lng];
    let pack = utils.getPath(this.data, path) || {};

    pack = { ...pack, ...resources };

    utils.setPath(this.data, path, pack);

    if (!options.silent) this.emit('added', lng, resources);
  }

  // 异步加载语言包
  addAsync(lan, asyncLoad) {
    if (!lan) {
      console.log('缺少语言code, 请参考: https://www.science.co.il/language/Codes.php 中code2')
      return Promise.reject();
    }
    let componentPromise;
    try {
      componentPromise = asyncLoad();
    } catch (e) {
      componentPromise = Promise.reject(e);
    }
    if (componentPromise) {
      return componentPromise
        .then(data => {
          try {
            this.add(lan, data);
          }
          catch (e) {
            console.log('加载语言包错误', e);
            return null;
          }
          return data;
        });
    }
  }

  // 可以删除具体的条目
  remove(lng, key) {
    if (!lng) {
      console.log('不支持删除所有语言数据');
      return;
    }
    if (key) {
      if (this.has(lng, key)) {
        delete this.data[lng][key];
      }
    }
    else {
      delete this.data[lng];
    }

    this.emit('removed', lng);
  }

  has(lng, key) {
    return this.getLan(lng, key) !== undefined;
  }

  getLan(lng, key, options) {
    if (!lng) {
      return this.data;
    }
    if (!key) {
      return this.data[lng];
    }
    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

    let path = [lng];
    if (key && typeof key !== 'string') path = path.concat(key);
    // 未来只处理单个key的场景
    if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
    }

    return utils.getPath(this.data, path);
  }

  toJSON() {
    return this.data;
  }
}

export default ResourceStore;
