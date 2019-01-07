export function createPlugin(opts) {
  return {
    __plugin__: true,
    ...opts,
  };
}
