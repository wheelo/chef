import * as React from 'react';

import dispatched from './dispatched';
import prepare from './prepare';
import prepared from './prepared';
import L from './L';
const asyncComponent = L;  // 别名

import exclude from './traverse-exclude';
import middleware from './middleware';

export {
  dispatched,
  prepare,
  prepared,
  L,
  asyncComponent,
  exclude,
  middleware
};
