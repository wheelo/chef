import React from 'react';
import PropTypes from 'prop-types';

class PrepareProvider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.splitComponentLoaders = [];
    this.markAsCritical = props.markAsCritical;
  }

  getChildContext() {
    return {
      splitComponentLoaders: this.splitComponentLoaders,
      markAsCritical: this.markAsCritical,
    };
  }
  render() {
    return React.Children.only(this.props.children);
  }
}

PrepareProvider.childContextTypes = {
  splitComponentLoaders: PropTypes.array.isRequired,
  markAsCritical: PropTypes.func,
};

export default PrepareProvider;
