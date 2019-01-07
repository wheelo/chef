import { createPlugin, createToken } from '@chef/chef-core';
// import { ProviderPlugin } from '@chef/chef-react';
import PropTypes from 'prop-types';

import React from 'react';

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.theme = props.theme;
  }

  getChildContext() {
    return { theme: this.theme };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  theme: PropTypes.object.isRequired
};

/* 创建插件 */
export default createPlugin({
  token: createToken('themeToken'),
  // deps: {logger: LoggerToken},

  // services. 参数为依赖的插件或普通对象
  provides(/* {logger} */) {
    let color = 'red';

    const theme = {
      color, 
      changeColor(newColor) {
        theme.color = newColor;
      }
    };
    return {
      from: () => {
        return { theme };
      }
    };
  },
  // 动态注入方法到context中
  middleware: (_, services) => {
    const { theme } = services.from();

    return (ctx, next) => {
      ctx.element = <Provider theme={theme}>{ctx.element}</Provider>;
      return next();
    };
  }

});
