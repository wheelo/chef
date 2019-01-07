import { createStore } from 'redux';

export default ctx => createStore => (
  ...args
) => {
  const store = {
    ...createStore(...args),
    ctx: ctx,
  };
  return store;
};
