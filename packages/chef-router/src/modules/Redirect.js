import React from 'react';
import PropTypes from 'prop-types';

export class Redirect extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (this.isStatic(context)) this.perform();
  }

  componentDidMount() {
    if (!this.isStatic()) this.perform();
  }

  isStatic(context = this.context) {
    return context.router && context.router.staticContext;
  }

  perform() {
    const { history, staticContext } = this.context.router;
    const { push, to, code } = this.props;

    if (push) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  render() {
    return null;
  }
}

Redirect.defaultProps = {
  push: false,
  code: 307,
};

Redirect.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    staticContext: PropTypes.object,
  }).isRequired,
};
