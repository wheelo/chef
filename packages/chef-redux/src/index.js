import pluginFactory from './plugin';
import injectReducer from './injectReducer';
const withReducer = injectReducer;  // 别名

export { connect } from "react-redux";
// 直接导出redux中的模块
export { compose, createStore, combineReducers, bindActionCreators } from 'redux';

export default pluginFactory();

export {
  injectReducer,
  withReducer
}

export {
  ReduxToken,
  ReducerToken,
  EnhancerToken
} from './tokens';
