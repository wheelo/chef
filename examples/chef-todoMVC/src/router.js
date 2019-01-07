/* 整体路由配置
 * TODO: 1. 支持umi或next.js中的自动路由生成功能
 * 2. 支持国际化模板
**/

import React from 'react';
import { Router, Route, Switch, Link } from '@chef/chef-router';
import { renderRoutes } from 'react-router-config';

// import dynamic from 'umi/dynamic';
// import renderRoutes from 'umi/_renderRoutes';

import { asyncComponent } from '@chef/chef-react';

import test from './reducers/test';

let routes = [
  {
    path: '/',
    exact: true,
    component: asyncComponent({
      load: () => import(/* webpackChunkName: 'containers/Todo' */'./containers/Todo')
    }),
  },
  {
    path: '/test',
    component: asyncComponent({
      load: () => import(/* webpackChunkName: 'containers/Test' */'./containers/Test'),
      // model: () => import(/* webpackChunkName: 'reducers/Test' */'./reducers/test')
    })
  }
];

const root = (
  <div>
    {renderRoutes(routes)}
    <Link className="todo-button" to="/">Todo</Link>
    <Link className="test-button" to="/test">Test</Link>
  </div>
);

export default root;