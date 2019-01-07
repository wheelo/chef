import React from 'react';
import PropTypes from 'prop-types';

import { withReducer } from '@chef/chef-redux';
import prepared from './prepared.js';

const CHUNKS_KEY = '__CHUNK_IDS';

const contextTypes = {
  splitComponentLoaders: PropTypes.array.isRequired
};

const defaultElement = () => <div className="chef-empty" />;

export default function L({
  defer,
  load,
  model,
  LoadingComponent = defaultElement,
  ErrorComponent = defaultElement
}) {
  let [AsyncComponent, AsyncModel, error] = [null, null, null];
  let chunkIds = [];

  function WithAsyncComponent(props) {
    if (error) {
      return <ErrorComponent error={error} />;
    }
    if (!AsyncComponent) {
      return <LoadingComponent />;
    }
    if (AsyncModel) {
      AsyncComponent = withReducer(AsyncModel)(AsyncComponent);
    }
    return <AsyncComponent {...props} />;
  }

  // 支持异步或者原生
  function loadReducers(reducerOpts) {
    let reducerKeys;

    if (!Array.isArray(reducerOpts)) {
      reducerKeys = Object.keys(reducerOpts);
    }

    if (reducerKeys && reducerKeys.length) {
      const reducerPromises = reducerKeys.map(key => reducerOpts[key]());

      return Promise.all(reducerPromises)
        .then(reducerMods => reducerMods.map(m => m.reducer || m.default))
        .then(reducerValues => {
          // 需要补充下withReducer的逻辑
          // AsyncComponent.reducers = zipObject(reducerKeys, reducerValues);
        });
    } else if (reducerOpts.length) {
      const reducerPromises = reducerOpts.map(reducer => reducer());

      return Promise.all(reducerPromises)
        .then(reducerMods =>
          reducerMods.reduce(
            (ret, m) =>
              Object.assign(ret, {
                [m.namespace]: m.reducer || m.default,
              }),
            {}
          )
        )
        .then(reducers => {
          // AsyncComponent
          // AsyncComponent.reducers = reducers;
        });
    }

    const reducerPromises = reducerKeys.map(key => reducerOpts[key]());

    return Promise.all(reducerPromises)
      .then(reducerMods => reducerMods.map(m => m.reducer || m.default))
      .then(reducerValues => {
        AsyncComponent.reducers = zipObject(reducerKeys, reducerValues);
      });
  }

  return prepared((props, context) => {
    if (AsyncComponent) {
      return Promise.resolve(AsyncComponent);
    }

    let componentPromise, modelPromise;
    try {
      componentPromise = load();
      modelPromise = model ? model() : Promise.resolve();
    } catch (e) {
      componentPromise = Promise.reject(e);
      modelPromise = Promise.reject(e);
    }
    chunkIds = componentPromise[CHUNKS_KEY] || [];

    const loadPromises = [
      componentPromise,
      modelPromise
      // ...context.splitComponentLoaders.map(loader => loader(chunkIds))
    ];

    return Promise.all(loadPromises)
      .then(([asyncComponent, asyncModel]) => {
        AsyncComponent = asyncComponent.default;
        // AsyncModel = asyncModel.default;
        // console.log(model[0]);
        if (asyncModel) {
          AsyncModel = asyncModel.default;
        }

        if (AsyncComponent === undefined) {
          throw new Error('Bundle does not contain a default export');
        }
      })
      .catch(err => {
        error = err;
        setTimeout(() => {
          throw err;
        }); // log error
      });
  },
    { defer, contextTypes, forceUpdate: true }
  )(WithAsyncComponent);
}
