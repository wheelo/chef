import * as React from 'react';

import { createPlugin } from '@chef/chef-core';

import Provider from './provider';

export default {
  create: (
    name,
    plugin,
    provider
  ) => {
    if (plugin.__plugin__ === undefined) {
      plugin = createPlugin(plugin);
    }
    if (!plugin.__plugin__) {
      throw new Error(
        'Provided plugin does not match Plugin<TDeps, TService>'
      );
    }

    let originalMiddleware = plugin.middleware;
    const ProviderComponent = provider || Provider.create(name);
    plugin.middleware = (deps, provides) => {
      let nextMiddleware =
        originalMiddleware && originalMiddleware(deps, provides);
      const mw = function (ctx, next) {
        if (ctx.element) {
          ctx.element = React.createElement(
            ProviderComponent,
            { provides, ctx },
            ctx.element
          );
        }
        if (nextMiddleware) {
          return nextMiddleware(ctx, next);
        }
        return next();
      };
      return mw;
    };
    return plugin;
  },
};
