const addLeadingSlash = path => (path.charAt(0) === '/' ? path : '/' + path);

export const addRoutePrefix = (
  location,
  prefix
) => {
  if (!prefix) return location;
  if (typeof location === 'string') {
    return `${prefix}${addLeadingSlash(location)}`;
  } else {
    return {
      ...location,
      pathname: `${prefix}${addLeadingSlash(location.pathname)}`,
    };
  }
};

export const removeRoutePrefix = (
  location,
  prefix
) => {
  if (!prefix) return location;
  const pathname = typeof location === 'string' ? location : location.pathname;
  const hasPrefix = (pathname + '/').indexOf(prefix + '/') === 0;
  const unprefixedPathname = pathname.slice(prefix.length);
  const relativePathname = hasPrefix ? unprefixedPathname : pathname;

  if (typeof location === 'string') {
    return relativePathname;
  } else {
    return {
      ...location,
      pathname: relativePathname,
    };
  }
};
