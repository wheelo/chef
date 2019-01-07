/**
 * root reducers
 */

import todos from "./todos";
import visibilityFilter from "./visibilityFilter";
// import { combineReducers } from '@chef/chef-redux';

// reducer可以是对象或者是由combineReducers生成的reducer函数
export default {
  todos,
  visibilityFilter,
  // layout
};
