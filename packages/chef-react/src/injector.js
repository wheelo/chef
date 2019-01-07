import * as React from 'react';

import { createPlugin } from '@chef/chef-core';
import PropTypes from 'prop-types';

// React.createContext polyfill
function createContext(value) {
  if (React.createContext) {
    return React.createContext(value);
  }
  // UUID
  const key = `_ContextPolyfill${Math.random()}`;

  class Provider extends React.Component {
    getChildContext() {
      return { [key]: this.props.value || value };
    }

    render() {
      return this.props.children;
    }
  }

  Provider.childContextTypes = {
    [key]: PropTypes.any.isRequired,
  };

  // 也可以使用16.7里面useContext
  function Consumer(props, context) {
    return props.children(context[key]);
  }

  Consumer.contextTypes = {
    [key]: PropTypes.any.isRequired,
  };

  return {
    Provider,
    Consumer
  };
}

let InjectorContext;

function getServices(app, deps) {
  const services = {};
  Object.entries(deps).forEach(([name, token]) => {
    services[name] = app.getService(token);
  });
  return services;
}

function defaultInject(deps) {
  return {};
}

function defaultMap(services) {
  return services;
}

export function useInjector(app) {
  // Lazily create context for easier testing
  InjectorContext = createContext(defaultInject);

  function inject(deps) {
    return getServices(app, deps);
  }

  function renderProvider(children) {
    return (
      <InjectorContext.Provider value={inject}>
        {children}
      </InjectorContext.Provider>
    );
  }

  const injectorPlugin = createPlugin({
    middleware: () => (ctx, next) => {
      ctx.element = ctx.element && renderProvider(ctx.element);
      return next();
    },
  });
  // 调用app中的use方法
  app.use(injectorPlugin);
}

export function withServices(
  deps,
  mapServicesToProps = defaultMap
) {
  function resolve(inject, props) {
    const services = inject(deps);
    const serviceProps = mapServicesToProps(services);

    return {
      ...serviceProps,
      ...props,
    };
  }

  // 这边可使用useContext
  function renderConsumer(Component, props) {
    return (
      <InjectorContext.Consumer>
        {inject => <Component {...resolve(inject, props)} />}
      </InjectorContext.Consumer>
    );
  }

  return Component => {
    return function WithServices(props) {
      return renderConsumer(Component, props);
    };
  };
}
