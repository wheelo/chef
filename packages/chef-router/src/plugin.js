import * as React from 'react';
import { createPlugin, createToken, unescape, memoize } from '@chef/chef-core';
import { Router } from './index';
import { Router as DefaultProvider } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { addRoutePrefix } from './modules/utils';

export const RouterProviderToken = createToken('RouterProvider');
export const RouterToken = createToken('Router');

export default createPlugin({
  deps: {
    Provider: RouterProviderToken.optional
  },
  token: RouterToken,
  middleware: ({ Provider = DefaultProvider }, self) => {
    return async (ctx, next) => {
      const prefix = ctx.prefix || '';
      if (!ctx.element) {
        return next();
      }
      const myAPI = self.from(ctx);

      // https://reacttraining.com/react-router/web/api/Router/history-object
      const history = createBrowserHistory();
      myAPI.history = history;
      ctx.element = (
        <Router
          history={history}
          Provider={Provider}
          basename={ctx.prefix}
        >
          {ctx.element}
        </Router>
      );
      return next();
    };
  },
  provides() {
    return {
      from: memoize(() => {
        const api = ({
          history: null,
        });
        return api;
      }),
    };
  },
});
