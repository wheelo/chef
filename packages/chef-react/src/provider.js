import * as React from 'react';
import PropTypes from 'prop-types';
// 可使用React最新的API createContext

export default {
  create: name => {
    class Provider extends React.Component {
      getChildContext() {
        return { [name]: this.props.provides };
      }
      render() {
        return React.Children.only(this.props.children);
      }
    }
    Provider.childContextTypes = {
      ...(Provider.childContextTypes || {}),
      [name]: PropTypes.any.isRequired,
    };
    // 在.之后再UpperCase
    Provider.displayName = name.replace(/^./, c => c.toUpperCase()) + 'Provider';

    return Provider;
  },
};
