import React, { Component } from 'react';
import { REACT_PREPARE } from './constants';

const prepared = (sideEffect, opts = {}) => OriginalComponent => {
  opts = Object.assign(
    {
      boundary: false,
      defer: false,
      componentDidMount: true,
      componentWillReceiveProps: false,
      componentDidUpdate: false,
      contextTypes: {},
      forceUpdate: false
    },
    opts
  );
  const prep = {
    prepare: (...args) => Promise.resolve(sideEffect(...args)),
    defer: opts.defer
  };

  class PreparedComponent extends Component {

    constructor(props, context) {
      super(props, context);

      this[REACT_PREPARE] = prep;
    }
    componentDidMount() {
      if (opts.componentDidMount) {
        Promise.resolve(sideEffect(this.props, this.context)).then(() => {
          if (opts.forceUpdate) {
            this.forceUpdate();
          }
        });
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
      if (opts.componentWillReceiveProps) {
        sideEffect(nextProps, nextContext);
      }
    }

    componentDidUpdate() {
      if (opts.componentDidUpdate) {
        sideEffect(this.props, this.context);
      }
    }

    render() {
      return <OriginalComponent {...this.props} />;
    }
  }

  const displayName =
    OriginalComponent.displayName || OriginalComponent.name || '';
  PreparedComponent.contextTypes = opts.contextTypes;
  PreparedComponent.displayName = `PreparedComponent(${displayName})`;

  return PreparedComponent;
};

function isPrepared(CustomComponent) {
  return (
    CustomComponent[REACT_PREPARE] &&
    typeof CustomComponent[REACT_PREPARE].prepare === 'function'
  );
}

function getPrepare(CustomComponent) {
  return CustomComponent[REACT_PREPARE] || {};
}

export { isPrepared, getPrepare };
export default prepared;
