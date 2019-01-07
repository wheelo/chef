const replaceEscaped = c => String.fromCodePoint(parseInt(c.slice(2), 16));
export const unescape = str => {
  return str.replace(
    /\\u003C|\\u003E|\\u0022|\\u002F|\\u2028|\\u2029/g,
    replaceEscaped
  );
};