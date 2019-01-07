/**
 * 插件的封装参考[fusion](https://github.com/fusionjs/fusion-core/blob/master/src/base-app.js)
 * 与[UMI](https://github.com/umijs/umi/blob/master/packages/umi-build-dev/src/Service.js)
 */

import { createPlugin } from './utils/create-plugin';
import { createToken, TokenType, TokenImpl } from './utils/create-token';
import { ElementToken, RenderToken } from './tokens';

class BaseApp {
  constructor(el, render) {
    this.modules = new Map();
    this.enhancerToToken = new Map();
    this._dependedOn = new Set();
    this.plugins = [];
    this.cleanups = [];
    el && this._useBuildIn(ElementToken, el);
    render && this._useBuildIn(RenderToken, render);
  }

  /**
   * @param {*} plugin - 通过createPlugin创建的插件
   * @param {*} config - 使用插件过程用户带入的配置项
   */
  use(plugin, config) {
    if (!plugin) {
      throw new Error('Cannot register without a plugin');
    }
    const { token, __plugin__ } = plugin;
    if (__plugin__ && !token) {
      plugin.token = createToken('UnnamedPlugin');
    }

    return this._use(plugin.token, plugin, config);
  }

  // 组件内部使用
  _useBuildIn(token, plugin, config) {
    if (token && token.__plugin__) {
      plugin = token;
      token = createToken('UnnamedPlugin');
    }
    if (!(token instanceof TokenImpl) && plugin === undefined) {
      throw new Error('Cannot register without a token');
    }
    // the renderer is a special case, since it needs to be always run last
    if (token === RenderToken) {
      this.renderer = plugin;
      return this;
    }
    return this._use(token, plugin, config);
  }

  _use(token, plugin, config) {
    this.plugins.push(token);
    const { aliases, enhancers } = this.modules.get(getTokenRef(token)) || {
      aliases: new Map(),
      enhancers: []
    };
    if (plugin && plugin.__plugin__) {
      if (plugin.deps) {
        Object.values(plugin.deps).forEach(token =>
          this._dependedOn.add(getTokenRef(token))
        );
      }
    }
    this.modules.set(getTokenRef(token), {
      plugin,
      aliases,
      enhancers,
      token,
      config
    });
    // 支持级联操作
    return this;
  }

  middleware(deps, middleware) {
    if (middleware === undefined) {
      middleware = () => deps;
    }
    this._useBuildIn(createPlugin({ deps, middleware }));
  }
  // TODO: 这边需要增加定制操作
  enhance(token, enhancer) {
    const { plugin, aliases, enhancers } = this.modules.get(
      getTokenRef(token)
    ) || {
        aliases: new Map(),
        enhancers: [],
        plugin: undefined,
      };
    this.enhancerToToken.set(enhancer, token);

    if (enhancers && Array.isArray(enhancers)) {
      enhancers.push(enhancer);
    }
    this.modules.set(getTokenRef(token), {
      plugin,
      aliases,
      enhancers,
      token,
    });
  }
  cleanup() {
    return Promise.all(this.cleanups.map(fn => fn()));
  }
  resolve() {
    if (!this.renderer) {
      throw new Error('Missing registration for RenderToken');
    }
    this._use(RenderToken, this.renderer);
    const resolved = new Map();
    const nonPluginTokens = new Set();
    const resolving = new Set();
    const modules = this.modules;
    const resolvedPlugins = [];
    const appliedEnhancers = [];
    const resolveToken = (token, tokenAliases) => {
      // Base: if we have already resolved the type, return it
      if (tokenAliases && tokenAliases.has(token)) {
        const newToken = tokenAliases.get(token);
        if (newToken) {
          token = newToken;
        }
      }
      if (resolved.has(getTokenRef(token))) {
        return resolved.get(getTokenRef(token));
      }

      // Base: if currently resolving the same type, we have a circular dependency
      if (resolving.has(getTokenRef(token))) {
        throw new Error(`Cannot resolve circular dependency: ${token.name}`);
      }

      // 从注册的插件中获取插件的内容
      let { plugin, aliases, enhancers, config } = modules.get(getTokenRef(token)) || {};
      if (plugin === undefined) {
        // Attempt to get default plugin, if optional
        if (token instanceof TokenImpl && token.type === TokenType.Optional) {
          this.use(token, undefined);
        } else {
          const dependents = Array.from(this.modules.entries());
          // console.log('no plugin and no TokenImpl');
        }
      }
      // config优先级高于本身的plugin
      config && (plugin.__comp__ = true);

      // Recursive: get the registered type and resolve it
      resolving.add(getTokenRef(token));

      function resolvePlugin(plugin, config) {
        const registeredDeps = (plugin && plugin.deps) || {};
        const resolvedDeps = {};

        for (const key in registeredDeps) {
          const registeredToken = registeredDeps[key];
          // 需要区别下用户直接提供实现的场景
          resolvedDeps[key] =
            config && config[key] ? config[key] : resolveToken(registeredToken, aliases);
        }
        // `provides` should be undefined if the plugin does not have a `provides` function
        let provides =
          plugin && plugin.provides ? plugin.provides(resolvedDeps) : undefined;

        if (plugin && plugin.middleware) {
          resolvedPlugins.push(plugin.middleware(resolvedDeps, provides));
        }
        return provides;
      }

      let provides = plugin;
      if (plugin && (plugin.__plugin__ || plugin.__comp__)) {
        provides = resolvePlugin(provides, config);
        if (plugin.cleanup) {
          this.cleanups.push(function () {
            return typeof plugin.cleanup === 'function'
              ? plugin.cleanup(provides)
              : Promise.resolve();
          });
        }
      } else {
        nonPluginTokens.add(token);
      }

      if (enhancers && enhancers.length) {
        enhancers.forEach(e => {
          let nextProvides = e(provides);
          appliedEnhancers.push([e, nextProvides]);
          if (nextProvides && nextProvides.__plugin__) {
            // if the token has a plugin enhancer, allow it to be registered with no dependents
            nonPluginTokens.delete(token);
            if (nextProvides.deps) {
              Object.values(nextProvides.deps).forEach(token =>
                this._dependedOn.add(getTokenRef(token))
              );
            }
            nextProvides = resolvePlugin(nextProvides);
          }
          provides = nextProvides;
        });
      }
      resolved.set(getTokenRef(token), provides);
      resolving.delete(getTokenRef(token));
      return provides;
    };

    for (let i = 0; i < this.plugins.length; i++) {
      resolveToken(this.plugins[i]);
    }
    for (const token of nonPluginTokens) {
      if (
        token !== ElementToken &&
        token !== RenderToken &&
        !this._dependedOn.has(getTokenRef(token))
      ) {
        throw new Error(
          `Registered token without depending on it: "${token.name}"`
        );
      }
    }

    this.plugins = resolvedPlugins;
    this._getService = token => resolved.get(getTokenRef(token));
  }
  getService(token) {
    if (!this._getService) {
      throw new Error('Cannot get service from unresolved app');
    }
    return this._getService(token);
  }
}

function getTokenRef(token) {
  if (token instanceof TokenImpl) {
    return token.ref;
  }
  return token;
}

export default BaseApp;