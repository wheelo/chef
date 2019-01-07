function Container() {}

export function memoize(fn) {
  const memoizeKey = new Container();
  return function memoized(ctx) {
    if (ctx.memoized.has(memoizeKey)) {
      return ctx.memoized.get(memoizeKey);
    }
    const result = fn(ctx);
    ctx.memoized.set(memoizeKey, result);
    return result;
  };
}
