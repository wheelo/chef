// 注入element与memoized
export default function createClientHydrate({ element }) {
  return function clientHydrate(ctx, next) {
    // ctx.prefix = window.__ROUTE_PREFIX__ || '';
    ctx.element = element;
    ctx.memoized = new Map();

    // ctx.preloadChunks = [];
    return next();
  };
}
