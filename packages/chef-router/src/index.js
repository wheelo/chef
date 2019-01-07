/**
 * Router模块参考了fusion-router的实现：https://github.com/fusionjs/fusion-plugin-react-router
 */

import plugin, { RouterProviderToken, RouterToken } from './plugin';

import {
  BrowserRouter as Router,
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  Prompt,
  StaticRouter,
  Switch,
  matchPath,
  withRouter,
  Route
} from 'react-router-dom';

import { Status, NotFound } from './modules/Status';
import { Redirect } from './modules/Redirect';

export default plugin;

export {
  HashRouter,
  Link,
  matchPath,
  MemoryRouter,
  NavLink,
  NotFound,
  Prompt,
  Redirect,
  Route,
  Router,
  Status,
  Switch,
  withRouter,
  RouterProviderToken,
  RouterToken
};