/**
 * 统一导出is开头的模块
 */

import isFunction from 'lodash.isfunction';
import isEmpty from 'lodash.isempty';
import isArray from 'lodash.isarray';
import isObject from 'lodash.isobject';

import isBrowserSide from './isBrowserSide';
import isPromise from './isPromise';
import isReactNative from './isReactNative';
import isServerSide from './isServerSide';

export default {
  isFunction,
  isArray,
  isEmpty,
  isObject,
  isBrowserSide,
  isPromise,
  isReactNative,
  isServerSide
};