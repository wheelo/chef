import React, { Component } from 'react';
import { I18nContext, withI18n } from './context';
import { warnOnce, deprecated } from './utils';


export class NamespacesConsumerComponent extends Component {
  constructor(props) {
    super(props);

    if (!props.i18n) {
      // I18nextProvider or by using i18nextReactModule
      return warnOnce(
        '没有内置i18n模块'
      );
    }

    // const namespaces = this.getNamespaces();
    const language = props.i18n.languages && props.i18n.languages[0];
    const ready = !!language && props.i18n.has(language);

    this.state = {
      i18nLoadedAt: null,
      ready,
    };

    this.t = this.getI18nTranslate();

    this.onI18nChanged = this.onI18nChanged.bind(this);
    this.getI18nTranslate = this.getI18nTranslate.bind(this);
    this.namespaces = this.getNamespaces.bind(this);
  }

  componentDidMount() {
    this.loadNamespaces();
  }

  componentDidUpdate(prevProps) {
    // Note that dynamically loading additional namespaces after the initial mount will not block rendering – even if the `wait` option is true.
    if (this.props.ns && prevProps.ns !== this.props.ns) this.loadNamespaces();
  }

  componentWillUnmount() {
    const { i18n, i18nOptions } = this.props;
    this.mounted = false;
    if (this.onI18nChanged) {
      if (i18nOptions.bindI18n) {
        const p = i18nOptions.bindI18n.split(' ');
        p.forEach(f => i18n.off(f, this.onI18nChanged));
      }
      if (i18nOptions.bindStore) {
        const p = i18nOptions.bindStore.split(' ');
        p.forEach(f => i18n.store && i18n.store.off(f, this.onI18nChanged));
      }
    }
  }

  onI18nChanged() {
    const { i18nOptions } = this.props;
    const { ready } = this.state;
    if (!this.mounted) return;
    if (!ready && i18nOptions.omitBoundRerender) return;
    this.t = this.getI18nTranslate();
    this.setState({ i18nLoadedAt: new Date() }); // rerender
  }

  getI18nTranslate() {
    const { i18n, i18nOptions } = this.props;

    const namespaces = this.getNamespaces();
    return i18n.getFixedT(
      null,
      i18nOptions.nsMode === 'fallback'
        ? namespaces
        : namespaces && namespaces.length
          ? namespaces[0]
          : 'translation'
    );
  }

  getNamespaces() {
    const { i18n, ns, defaultNS } = this.props;

    const namespaces =
      typeof ns === 'function'
        ? ns(this.props)
        : ns || defaultNS || (i18n.options && i18n.options.defaultNS);

    return typeof namespaces === 'string' ? [namespaces] : namespaces || [];
  }

  loadNamespaces() {
    const { i18n, i18nOptions } = this.props;
    const { ready } = this.state;

    const bind = () => {
      if (i18nOptions.bindI18n && i18n) i18n.on(i18nOptions.bindI18n, this.onI18nChanged);
      if (i18nOptions.bindStore && i18n.store)
        i18n.store.on(i18nOptions.bindStore, this.onI18nChanged);
    };

    this.mounted = true;
    i18n.loadNamespaces(this.getNamespaces(), () => {
      const handleReady = () => {
        if (this.mounted && !ready) {
          this.setState({ ready: true }, () => {
            if (!i18nOptions.wait) this.onI18nChanged();
          });
        }
        if (i18nOptions.wait && this.mounted) bind();
      };

      if (i18n.isInitialized) {
        handleReady();
      } else {
        const initialized = () => {
          // due to emitter removing issue in i18next we need to delay remove
          setTimeout(() => {
            i18n.off('initialized', initialized);
          }, 1000);
          handleReady();
        };

        i18n.on('initialized', initialized);
      }
    });

    if (!i18nOptions.wait) bind();
  }

  render() {
    const { children, i18n, defaultNS, i18nOptions } = this.props;
    const { ready } = this.state;
    const { t } = this;

    if (!ready && i18nOptions.wait) return null;


    return React.createElement(
      I18nContext.Provider,
      {
        value: { i18n, t, defaultNS, lng: i18n && i18n.language },
      },
      children(this.t, {
        i18n,
        t,
        lng: i18n.language,
        ready,
      })
    );
  }
}

export const NamespacesConsumer = withI18n()(NamespacesConsumerComponent);

export function I18n(props) {
  deprecated(
    'I18n was renamed to "NamespacesConsumer" to make it more clear what the render prop does.'
  );
  return <NamespacesConsumer {...props} />;
}
