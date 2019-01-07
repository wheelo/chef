import React from 'react';
import { compose, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { createPlugin } from '@chef/chef-core';
import { isObject } from '@chef/chef-utils.is';

import ctxEnhancer from './ctx-enhancer';
import { ReducerToken, EnhancerToken, ReduxToken, StateToken } from './tokens.js';
import injectorHelper from './utils/injectorHelper';

const pluginFactory = () => {
  // 为动态reducer做准备
  let cacheStore = null;
  return createPlugin({
    deps: {
      reducer: ReducerToken,  // 必选, root reducer
      state: StateToken.optional, // 初始化状态
      enhancer: EnhancerToken.optional   // 用户传输的enhancer
    },
    token: ReduxToken,
    // provides返回的数据就是服务:services
    provides({ reducer, state = {}, enhancer }) {
      class Redux {
        constructor(ctx) {
          if (cacheStore) {
            this.store = cacheStore;
          }
          else {
            const devTool =
              __DEV__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__ &&
              __REDUX_DEVTOOLS_EXTENSION__();
            const enhancers = [enhancer, ctxEnhancer(ctx), devTool].filter(
              Boolean
            );

            if (isObject(reducer)) {
              reducer = combineReducers(reducer);
            }

            this.store = createStore(
              reducer,
              state,
              compose(...enhancers)
            );
          }
          // 初始化reducer, 为动态injectReducer铺垫
          injectorHelper.use(reducer);
        }
      }
      return {
        from: ctx => {
          return new Redux(ctx);
        }
      };
    },
    // 第一个参数是依赖，第二个是服务services
    middleware(_, redux) {
      return (ctx, next) => {
        const { store } = redux.from(ctx);
        ctx.element = <Provider store={store}>{ctx.element}</Provider>;
        return next();
      };
    },
    cleanup: async () => {
      storeCache = null;
    },
  });
};

export default pluginFactory;
