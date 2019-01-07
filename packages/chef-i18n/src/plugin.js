import * as React from 'react';
import PropTypes from 'prop-types';

import i18n from './i18n';
import { ProviderPlugin } from '@chef/chef-react';

// 将使用React.useContext重构, 同时支持异步加载语言包
class BundleSplitConsumer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.i18n = props.provides.from(props.ctx);
    /* if (context.splitComponentLoaders) {
      context.splitComponentLoaders.push(ids => this.i18n.load(ids));
    } */
  }
  getChildContext() {
    return { i18n: this.i18n };
  }
  render() {
    return React.Children.only(this.props.children);
  }
}

/* BundleSplitConsumer.contextTypes = {
  splitComponentLoaders: PropTypes.array
}; */


BundleSplitConsumer.childContextTypes = {
  i18n: PropTypes.object.isRequired
};

export default ProviderPlugin.create('i18n', i18n, BundleSplitConsumer);
