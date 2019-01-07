/* TODO: 这个模块以后有SSR后再优化

import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import BaseComponent from './BaseComponent';
import getDisplayName from './getDisplayName';
import isBrowserSide from '../is/isBrowserSide';

export default function withServerRender() {
  return WrappedComponent => {
    const isBrowser = isBrowserSide();

    class WithServerRender extends BaseComponent {
      static displayName = `withServerRender(${getDisplayName(
        WrappedComponent
      )})`;

      isPreload = isBrowser ? window.__IS_PRELOAD__ : null;

      componentDidMount() {
        if (isBrowser) {
          window.__IS_PRELOAD__ = false;
          this.isPreload = window.__IS_PRELOAD__;
        }
      }

      render() {
        const props = {
          isPreload: this.isPreload,
        };

        return <WrappedComponent {...this.props} {...props} />;
      }
    }

    hoistNonReactStatics(WithServerRender, WrappedComponent);

    return WithServerRender;
  };
}

*/