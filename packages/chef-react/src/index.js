import * as React from 'react';
import ReactDOM from 'react-dom';

import ChefApp, { createPlugin, CriticalChunkIdsToken } from '@chef/chef-core';
import { prepare } from './async/index.js';
import PrepareProvider from './async/prepare-provider';
import { useInjector, withServices } from './injector.js';

import clientRender from './clientRender';

import ProviderPlugin from './plugin';
import ProvidedHOC from './hoc';
import Provider from './provider';

let domElement = null;

class App extends Che {
  constructor(root, id) {
    if (!React.isValidElement(root))
      throw new Error(
        'Invalid React element. Ensure your root element is a React.Element'
      );
    const renderer = createPlugin({
      deps: {},
      provides() {
        return el => {
          return prepare(el).then(() => {
            // 如果用户传输指定的渲染元素，就是直接使用那个元素作为入口
            domElement = clientRender(el, id);
          });
        };
      },
      middleware() {
        return (ctx, next) => {
          ctx.element = (
            <PrepareProvider>
              {ctx.element}
            </PrepareProvider>
          );
          return next();
        };
      }
    });

    super(root, renderer);
    useInjector(this);
  }
  // 卸载组件
  cleanup() {
    if (domElement) {
      ReactDOM.unmountComponentAtNode(domElement);
    }
  }
}

// 直接导出函数, 函数中生成应用的单例
export default (root, id) => {
  const app = new App(root, id);
  return app;
}

// 做高阶函数compose的
export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

export { ProviderPlugin, ProvidedHOC, Provider, withServices };

export * from './async/index.js';
