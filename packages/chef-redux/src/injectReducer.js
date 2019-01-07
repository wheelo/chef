import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import injectorHelper from './utils/injectorHelper';

// 动态注入一个reducer
export default (reducers) => WrappedComponent => {
  class ReducerInjector extends React.Component {
    injectors = injectorHelper.getInjectors(this.context.store);

    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    static displayName = `withReducer(${WrappedComponent.displayName || 'Component'})`;

    componentWillMount() {
      const { injectReducers } = this.injectors;

      injectReducers(reducers);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};