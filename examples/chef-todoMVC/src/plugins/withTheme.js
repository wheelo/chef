import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

// 动态注入一个reducer
export default WrappedComponent => {
  class ThemeComponent extends React.Component {
    // this.context.theme

    static contextTypes = {
      theme: PropTypes.object.isRequired
    };

    static displayName = `withTheme(${WrappedComponent.displayName || 'Component'})`;

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ThemeComponent, WrappedComponent);
};