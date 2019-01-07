import React from 'react';
import {
  isFragment,
  isContextConsumer,
  isContextProvider,
  isForwardRef,
  isPortal
} from 'react-is';

import isReactCompositeComponent from './utils/isReactCompositeComponent';
import isReactFunctionalComponent from './utils/isReactFunctionalComponent';
import { isPrepared, getPrepare } from './prepared';

function renderCompositeElementInstance(instance) {
  const childContext = Object.assign(
    {},
    instance.context,
    instance.getChildContext ? instance.getChildContext() : {}
  );

  if (instance.constructor && instance.constructor.getDerivedStateFromProps) {
    instance.state = {
      ...instance.state,
      ...instance.constructor.getDerivedStateFromProps(
        instance.props,
        instance.state
      ),
    };
  } else {
    if (instance.componentWillMount) {
      instance.componentWillMount();
    } else if (instance.UNSAFE_componentWillMount) {
      instance.UNSAFE_componentWillMount();
    }
  }
  const children = instance.render();
  return [children, childContext];
}

function prepareComponentInstance(instance) {
  if (!isPrepared(instance)) {
    return Promise.resolve({});
  }
  const prepareConfig = getPrepare(instance);
  // If the component is deferred, skip the prepare step
  if (prepareConfig.defer) {
    return Promise.resolve(prepareConfig);
  }

  return prepareConfig.prepare(instance.props, instance.context).then(() => {
    return prepareConfig;
  });
}

function prepareElement(element, context) {
  if (element === null || typeof element !== 'object') {
    return Promise.resolve([null, context]);
  }
  const { type, props } = element;
  if (isContextConsumer(element)) {
    return Promise.resolve([props.children(type._currentValue), context]);
  }
  if (isContextProvider(element)) {
    type._context._currentValue = props.value;
    return Promise.resolve([props.children, context]);
  }
  if (
    typeof type === 'string' ||
    isFragment(element) ||
    isForwardRef(element)
  ) {
    return Promise.resolve([props.children, context]);
  } else if (isReactFunctionalComponent(type)) {
    return Promise.resolve([type(props, context), context]);
  } else if (isReactCompositeComponent(type)) {
    const CompositeComponent = type;
    const instance = new CompositeComponent(props, context);
    instance.props = props;
    instance.context = context;
    return prepareComponentInstance(instance).then(prepareConfig => {
      // Stop traversing if the component is defer or boundary
      if (prepareConfig.defer || prepareConfig.boundary) {
        return Promise.resolve([null, context]);
      }
      return renderCompositeElementInstance(instance);
    });
  } else if (isPortal(element)) {
    return Promise.resolve([element.children, context]);
  } else {
    throw new TypeError(
      `Invalid React element type. Must be a string, a function or a subclass of React.Component.  \n\n` +
      JSON.stringify(element, null, 2)
    );
  }
}

function prepare(element, context = {}) {
  context.__IS_PREPARE__ = true;

  return prepareElement(element, context).then(() => {
    context.__IS_PREPARE__ = false;
  });
}

export default prepare;
