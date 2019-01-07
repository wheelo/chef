import { combineReducers } from 'redux';
import { mergeReducers } from './mergeReducers';
import { isObject } from '@chef/chef-utils.is';

class InjectorHelper {
  constructor() {
    this.initReducer = {};
    this.injectedReducers = {};
  }

  use(reducer) {
    this.initReducer = reducer;
    return this;
  }

  makeRootReducer(asyncReducers) {
    // 调试下
    if (isObject(asyncReducers)) {
      return mergeReducers(this.initReducer, combineReducers(asyncReducers));
    }
    else if (typeof asyncReducers === 'function') {
      return mergeReducers(this.initReducer, asyncReducers);
    }
  }

  getInjectors(store) {
    const asyncReducers = {};

    this.injectedReducers = {
      injectReducers: reducers => {
        if (!reducers) return;

        Object.keys(reducers).forEach(key => {
          // hot model暂时没考虑: store.asyncReducers[key] === reducer
          // Object.hasOwnProperty.call(asyncReducers, key)
          if (!Reflect.has(asyncReducers, key)) {
            asyncReducers[key] = reducers[key];
          }
        });
        store.replaceReducer(this.makeRootReducer(asyncReducers));
      }
    };
    return this.injectedReducers;
  }
}

export default new InjectorHelper();