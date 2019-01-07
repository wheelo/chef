import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { shallowEqual, deprecated } from './utils';
import { withI18n, setDefaults, setI18n } from './context';
import { NamespacesConsumer } from './NamespacesConsumer';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

function withNameSpace(namespaceArg, options = {}) {
  return function Wrapper(WrappedComponent) {
    class LoadNamespace extends Component {
      shouldComponentUpdate(nextProps) {
        const { i18nOptions } = this.props;
        if (!i18nOptions.usePureComponent && !options.usePureComponent) {
          return true;
        }

        return !shallowEqual(this.props, nextProps);
      }

      render() {
        const { namespaces, i18nOptions } = this.props;
        const mergedI18nOptions = { ...i18nOptions, ...options };
        const extraProps = {};

        if (mergedI18nOptions.innerRef) {
          extraProps.ref = mergedI18nOptions.innerRef;
        }

        return React.createElement(
          NamespacesConsumer,
          {
            ns: namespaces || namespaceArg,
            ...this.props,
            // i18nOptions考虑不给用户显示出来
            i18nOptions: Object.keys(mergedI18nOptions).length > 0 ? mergedI18nOptions : null,
          },
          (t, { ready, ...rest }) =>
            React.createElement(WrappedComponent, {
              tReady: ready,
              ...this.props,
              ...extraProps,
              ...rest,
            })
        );
      }
    }

    // 这边需要简化下
    const LoadNamespaceWithContext = withI18n()(LoadNamespace);

    LoadNamespaceWithContext.WrappedComponent = WrappedComponent;
    LoadNamespaceWithContext.displayName = `LoadNamespace(${getDisplayName(WrappedComponent)})`;
    LoadNamespaceWithContext.namespaces = namespaceArg;

    return hoistStatics(LoadNamespaceWithContext, WrappedComponent);
  };
}

withNameSpace.setDefaults = setDefaults;
withNameSpace.setI18n = setI18n;

// TODO: 这边应该可以让用户自己配置, 默认是 translation
export const withT = withNameSpace('translation');
