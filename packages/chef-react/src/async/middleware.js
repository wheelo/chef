import React from 'react';

import PrepareProvider from './prepare-provider';

const middleware = function (ctx, next) {
  ctx.element = (
    <PrepareProvider>
      {ctx.element}
    </PrepareProvider>
  );
  return next();
};

export default middleware;
