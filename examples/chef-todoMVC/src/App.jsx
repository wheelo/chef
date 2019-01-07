import React from 'react';

import chef from '@chef/chef-react';
import RouterPlugin from '@chef/chef-router';
import ReduxPlugin from '@chef/chef-redux';
import HelmetPlugin from '@chef/chef-helmet';
import I18nPlugin from '@chef/chef-i18n';

import ThemePlugin from './plugins/ThemePlugin';

// 语言和reducer配置
import reducer from './reducers';
import translations from '../public/lang/init.json';

// 项目的React入口（即传入ReactDOM.render方法中的第一个参数)
import root from './router';

import './styles/app.css';

export default () =>
  chef(root, 'root')
    .use(ReduxPlugin, {
      reducer,
      // state: {  visibilityFilter: 'show'}
    })
    .use(ThemePlugin)
    .use(RouterPlugin)
    .use(HelmetPlugin)
    .use(I18nPlugin, { translations, lng: 'en', detect: true });
