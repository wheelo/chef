import { createModule, customReducerUtil, customActionUtil } from '@chef/chef-utils.model';
// import { createActionHandler } from 'shared/utils/reducerUtil';
// import api from 'shared/utils/api';

const initCustomState = customReducerUtil.initCustomState;
const customTimestampMeta = customActionUtil.customTimestampMeta;

const model = {
  namespace: 'common',
  state: {
    loginInfo: initCustomState({
      loginAsBrand: false,
    }),
    abcState: {},
    ui: { b: 123 },
  },
  reducers: {
    getLoginInfo(state, action) {
      createActionHandler({
        name: 'loginInfo',
      })(state, action);
    },
    abc(state, { payload }) {
      state.abcState = payload;
    },
    example(state, { payload }) {
      state.example = payload;
    }
  },
  actions: {
    getLoginInfo() {
      return {
        payload: api.get('/getLoginInfo', {
          currentUrl: window.location.href,
        }),
        meta: customTimestampMeta(),
      };
    },
  },
  thunks: {
    // 参数对象为 { dispatch, getState, extraArgument, type, createActionType, ...所有actions 和 thunks, 三个UI actions}
    example({ dispatch, type, getState, createActionType }, param) {
      dispatch({
        type: createActionType('abc'),
        payload: { param, type },
        meta: customTimestampMeta(),
      });
      dispatch({
        type,
        payload: getState().common,
        meta: customTimestampMeta(),
      });
    },
  },
};

export const {
  namespace,
  initialState,
  handlers,
  createActionType,
  actions,
  reducers,
} = createModule(model);

console.log('actions: ', actions)


export default reducers;
