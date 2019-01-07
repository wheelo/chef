import * as ACTION_TYPES from '../constants/ActionTypes';
import { combineReducers } from '../../../../packages/chef-redux/src';

export default function test(state = { hello: '' }, action) {
  switch (action.type) {
    case ACTION_TYPES.TEST:
      return {
        hello: action.test + Math.floor(Math.random()*10)
      };
    default:
      return state;
  }
}


/* function test(state = { hello: '' }, action) {
  switch (action.type) {
    case ACTION_TYPES.TEST:
      return {
        hello: action.test + Math.floor(Math.random()*10)
      };
    default:
      return state;
  }
}


export default combineReducers({
  test
}); */